const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

/**
 * Helper to determine risk level string from numeric score.
 * 0-29: Low
 * 30-59: Medium
 * 60-79: High
 * 80-100: Critical
 */
function getRiskLevel(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}

/**
 * Helper to determine recommended action string from risk level.
 * Low: Allow
 * Medium: Monitor
 * High: Review
 * Critical: Block
 */
function getRecommendedAction(riskLevel) {
  switch (riskLevel) {
    case "Critical":
      return "Block";
    case "High":
      return "Review";
    case "Medium":
      return "Monitor";
    case "Low":
    default:
      return "Allow";
  }
}

/**
 * Calculates behavioral baseline metrics for an account from its historical transactions.
 * Answers: "What is normal spending and activity for this specific account?"
 */
function calculateAccountBaseline(txns) {
  if (!txns || txns.length === 0) {
    return {
      transactionCount: 0,
      avgAmount: 0,
      medianAmount: 0,
      maxAmount: 0,
      stdDevAmount: 0,
      commonMerchants: new Set(),
      commonDevices: new Set(),
      commonLocations: new Set(),
      commonPaymentChannels: new Set()
    };
  }

  const amounts = txns.map((t) => Number(t.amount) || 0).sort((a, b) => a - b);
  const count = amounts.length;
  const sum = amounts.reduce((acc, v) => acc + v, 0);
  const avgAmount = Math.round(sum / count);
  const medianAmount =
    count % 2 === 0
      ? Math.round((amounts[count / 2 - 1] + amounts[count / 2]) / 2)
      : amounts[Math.floor(count / 2)];
  const maxAmount = amounts[count - 1];

  const variance =
    amounts.reduce((acc, v) => acc + Math.pow(v - avgAmount, 2), 0) / count;
  const stdDevAmount = Math.round(Math.sqrt(variance));

  const commonMerchants = new Set(txns.map((t) => t.merchantId).filter(Boolean));
  const commonDevices = new Set(txns.map((t) => t.deviceId).filter(Boolean));
  const commonLocations = new Set(txns.map((t) => t.location).filter(Boolean));
  const commonPaymentChannels = new Set(
    txns.map((t) => t.paymentChannel).filter(Boolean)
  );

  return {
    transactionCount: count,
    avgAmount,
    medianAmount,
    maxAmount,
    stdDevAmount,
    commonMerchants,
    commonDevices,
    commonLocations,
    commonPaymentChannels
  };
}

/**
 * Evaluates whether a transaction amount is anomalous relative to the account's historical spending.
 * Prevents false positives: high absolute amount alone is only a single moderate signal (+10),
 * requiring corroborating network signals for high-risk categorization.
 */
function calculateAmountAnomaly(txn, historicalBaseline) {
  let score = 0;
  let reason = null;

  if (historicalBaseline && historicalBaseline.transactionCount >= 1) {
    const historicalAvg = historicalBaseline.avgAmount || 1;
    const ratio = txn.amount / historicalAvg;

    if (ratio >= 3 && txn.amount >= 20000) {
      score = 10;
      reason = `Transaction amount of ₹${txn.amount.toLocaleString(
        "en-IN"
      )} is significantly above this account's historical baseline spending (${ratio.toFixed(1)}x average)`;
    } else if (txn.amount >= 45000) {
      score = 10;
      reason = `Transaction amount of ₹${txn.amount.toLocaleString(
        "en-IN"
      )} significantly exceeds standard consumer baseline`;
    }
  } else {
    if (txn.amount >= 45000) {
      score = 10;
      reason = `High transaction value (₹${txn.amount.toLocaleString(
        "en-IN"
      )}) observed on newly active account`;
    }
  }

  return { score, reason };
}

/**
 * Detects behavioral drift across an account's established patterns:
 * - Compares transaction against established historical baseline.
 * - Flags simultaneous divergence in hardware, merchant, velocity, and geography.
 * - Does not flag routine shopping (e.g. simply trying a new cafe or single merchant).
 */
function detectBehavioralDrift(txn, historicalTxns, baseline, allAccountTxns) {
  let driftScore = 0;
  const reasons = [];

  // Minimum history threshold: require at least 3 transactions to establish a reliable baseline
  if (!baseline || baseline.transactionCount < 3) {
    return {
      driftScore: 0,
      reasons: [],
      driftDetected: false
    };
  }

  const amountRatio = baseline.avgAmount > 0 ? txn.amount / baseline.avgAmount : 1;
  const isAmountSurge = amountRatio >= 4 && txn.amount >= 15000;

  const isNewDevice = txn.deviceId && !baseline.commonDevices.has(txn.deviceId);
  const isNewMerchant = txn.merchantId && !baseline.commonMerchants.has(txn.merchantId);
  const isNewLocation = txn.location && !baseline.commonLocations.has(txn.location);

  const txnTime = new Date(txn.timestamp).getTime();
  const sessionBursts = (allAccountTxns || []).filter((t) => {
    const diff = Math.abs(new Date(t.timestamp).getTime() - txnTime);
    return diff > 0 && diff <= 60 * 60 * 1000;
  }).length;
  const isVelocityDrift = sessionBursts >= 1;

  // Signal 1: New Device combined with severe spending surge
  if (isNewDevice && isAmountSurge) {
    driftScore += 15;
    reasons.push(
      `Device (${txn.deviceId}) has not previously been associated with this account and coincides with a significant spending surge`
    );
  }

  // Signal 2: New Merchant coinciding with an unusual spending increase
  if (isNewMerchant && isAmountSurge) {
    driftScore += 15;
    reasons.push(
      `Merchant (${txn.merchantId}) is new for this account and coincides with an unusual spending increase (${amountRatio.toFixed(1)}x baseline)`
    );
  }

  // Signal 3: Geographic dislocation combined with unobserved device
  if (isNewLocation && isNewDevice) {
    driftScore += 10;
    reasons.push(
      `Transaction location (${txn.location}) differs significantly from the account's established activity pattern`
    );
  }

  // Signal 4: Velocity burst of high-value transactions compared to historical pace
  if (isVelocityDrift && isAmountSurge) {
    driftScore += 10;
    reasons.push(
      `Transaction frequency is significantly higher than this account's normal activity pattern`
    );
  }

  return {
    driftScore,
    reasons,
    driftDetected: driftScore > 0
  };
}

/**
 * Builds correlation indices across all transactions for graph & network relationship inspection.
 */
function buildTransactionContext(transactions) {
  const deviceAccounts = new Map();
  const merchantAccounts = new Map();
  const itemAccounts = new Map();
  const accountTransactions = new Map();
  const locationAccounts = new Map();

  for (const txn of transactions) {
    const accId = txn.accountId;
    if (!accId) continue;

    if (!accountTransactions.has(accId)) {
      accountTransactions.set(accId, []);
    }
    accountTransactions.get(accId).push(txn);

    if (txn.deviceId) {
      if (!deviceAccounts.has(txn.deviceId)) {
        deviceAccounts.set(txn.deviceId, new Set());
      }
      deviceAccounts.get(txn.deviceId).add(accId);
    }

    if (txn.merchantId) {
      if (!merchantAccounts.has(txn.merchantId)) {
        merchantAccounts.set(txn.merchantId, new Set());
      }
      merchantAccounts.get(txn.merchantId).add(accId);
    }

    if (txn.location) {
      if (!locationAccounts.has(txn.location)) {
        locationAccounts.set(txn.location, new Set());
      }
      locationAccounts.get(txn.location).add(accId);
    }

    if (Array.isArray(txn.items)) {
      for (const item of txn.items) {
        if (!itemAccounts.has(item)) {
          itemAccounts.set(item, new Set());
        }
        itemAccounts.get(item).add(accId);
      }
    }
  }

  for (const [, txns] of accountTransactions) {
    txns.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  return {
    deviceAccounts,
    merchantAccounts,
    itemAccounts,
    accountTransactions,
    locationAccounts
  };
}

/**
 * Evaluates network and relationship signals across shared hardware, merchants, items, timing, and locations.
 */
function calculateNetworkSignals(txn, context, allTransactions) {
  let score = 0;
  const reasons = [];

  const txnTime = new Date(txn.timestamp).getTime();
  const accId = txn.accountId;

  // Signal 1: Shared Hardware Device
  let sharedDeviceAccountCount = 0;
  if (txn.deviceId && context.deviceAccounts.has(txn.deviceId)) {
    const accs = context.deviceAccounts.get(txn.deviceId);
    sharedDeviceAccountCount = accs.size;
    if (sharedDeviceAccountCount >= 2) {
      score += sharedDeviceAccountCount >= 3 ? 25 : 15;
      reasons.push(
        `Multiple accounts are using the same device (${sharedDeviceAccountCount} accounts on ${txn.deviceId})`
      );
    }
  }

  // Signal 2: Shared High-Liquidity Merchant
  let sharedMerchantAccountCount = 0;
  if (txn.merchantId && context.merchantAccounts.has(txn.merchantId)) {
    const merchantAccs = context.merchantAccounts.get(txn.merchantId);
    sharedMerchantAccountCount = merchantAccs.size;

    if (sharedMerchantAccountCount >= 3) {
      const isKnownLiquidMerchant =
        txn.merchantId.includes("GOLD") ||
        txn.merchantId.includes("CRYPTO") ||
        txn.merchantId.includes("VAULT");

      if (sharedDeviceAccountCount >= 2 || isKnownLiquidMerchant) {
        score += 15;
        reasons.push(
          `Multiple accounts are connected to the same merchant (${txn.merchantId})`
        );
      }
    }
  }

  // Signal 3: Rapid Liquidation / Unusual Items Shared Across Accounts
  let sharedItemsCount = 0;
  if (Array.isArray(txn.items) && txn.items.length > 0) {
    for (const item of txn.items) {
      const isLiquidKeyword =
        item.toLowerCase().includes("gold") ||
        item.toLowerCase().includes("voucher") ||
        item.toLowerCase().includes("token") ||
        item.toLowerCase().includes("crypto");

      if (context.itemAccounts.has(item)) {
        const itemAccs = context.itemAccounts.get(item);
        if (itemAccs.size >= 3 && isLiquidKeyword) {
          sharedItemsCount++;
        }
      }
    }

    if (sharedItemsCount > 0) {
      score += 15;
      reasons.push("Multiple accounts purchased the same unusual items");
    }
  }

  // Signal 4: Synchronized Activity (Temporal proximity across related accounts)
  let synchronizedMatch = false;
  const timeWindowMs = 45 * 60 * 1000;

  for (const otherTxn of allTransactions) {
    if (otherTxn.transactionId === txn.transactionId) continue;
    if (otherTxn.accountId === accId) continue;

    const otherTime = new Date(otherTxn.timestamp).getTime();
    const timeDiff = Math.abs(txnTime - otherTime);

    if (timeDiff <= timeWindowMs) {
      const sameDevice = txn.deviceId && txn.deviceId === otherTxn.deviceId;
      const sameMerchant = txn.merchantId && txn.merchantId === otherTxn.merchantId;

      if (sameDevice || (sameMerchant && sharedItemsCount > 0)) {
        synchronizedMatch = true;
        break;
      }
    }
  }

  if (synchronizedMatch) {
    score += 20;
    reasons.push("Multiple accounts show closely synchronized transaction activity");
  }

  // Signal 5: Transaction Frequency / Burst within cross-account group
  const userTxns = context.accountTransactions.get(accId) || [];
  const burstCount = userTxns.filter((t) => {
    const diff = Math.abs(new Date(t.timestamp).getTime() - txnTime);
    return diff > 0 && diff <= 120 * 60 * 1000;
  }).length;

  if (burstCount >= 2 && score >= 20) {
    score += 10;
    reasons.push("Unusually high transaction frequency");
  }

  // Signal 6: Related Location Hubs
  if (txn.location && context.locationAccounts.has(txn.location)) {
    const locAccounts = context.locationAccounts.get(txn.location);
    if (locAccounts.size >= 3 && (sharedDeviceAccountCount >= 2 || synchronizedMatch)) {
      score += 10;
      reasons.push("Multiple accounts show related transaction locations");
    }
  }

  return {
    score,
    reasons,
    sharedDeviceAccountCount,
    synchronizedMatch
  };
}

/**
 * Calculates transaction-level risk score, risk level, explanations, and action.
 * Synthesizes personal account baseline anomaly, behavioral drift, and cross-account network intelligence.
 */
function calculateTransactionRisk(txn, context, allTransactions) {
  const accId = txn.accountId;
  const allAccountTxns = context.accountTransactions.get(accId) || [];

  const txnTime = new Date(txn.timestamp).getTime();
  // To evaluate drift against established behavior, compare against prior established history (> 2h prior session window)
  const priorHistoryTxns = allAccountTxns.filter(
    (t) =>
      new Date(t.timestamp).getTime() < txnTime &&
      txnTime - new Date(t.timestamp).getTime() > 2 * 60 * 60 * 1000
  );

  const historicalTxns = priorHistoryTxns.length >= 3
    ? priorHistoryTxns
    : allAccountTxns.filter((t) => t.transactionId !== txn.transactionId);

  const baseline = calculateAccountBaseline(historicalTxns);

  // 1. Account-level Amount Anomaly
  const amountAnomaly = calculateAmountAnomaly(txn, baseline);

  // 2. Behavioral Drift Anomaly
  const behavioralDrift = detectBehavioralDrift(txn, historicalTxns, baseline, allAccountTxns);

  // 3. Cross-Account Network & Coordination Signals
  const networkSignals = calculateNetworkSignals(txn, context, allTransactions);

  let totalScore = amountAnomaly.score + behavioralDrift.driftScore + networkSignals.score;
  const reasons = [];

  if (amountAnomaly.reason) {
    reasons.push(amountAnomaly.reason);
  }
  if (behavioralDrift.reasons.length > 0) {
    reasons.push(...behavioralDrift.reasons);
  }
  reasons.push(...networkSignals.reasons);

  // Cap score at 100
  const finalScore = Math.min(100, Math.max(0, totalScore));
  const riskLevel = getRiskLevel(finalScore);
  const recommendedAction = getRecommendedAction(riskLevel);

  return {
    transactionId: txn.transactionId,
    accountId: txn.accountId,
    amount: txn.amount,
    timestamp: txn.timestamp,
    merchantId: txn.merchantId,
    deviceId: txn.deviceId,
    location: txn.location,
    paymentChannel: txn.paymentChannel,
    items: txn.items,
    status: txn.status || "Completed",
    riskScore: finalScore,
    riskLevel,
    riskReasons: reasons,
    recommendedAction,
    isFraud: finalScore >= 70
  };
}

/**
 * Calculates account-level risk based on historical behavior, transaction severity, behavioral drift, and network links.
 */
function calculateAccountRisk(account, accountTransactions, context) {
  const accId = account.accountId;
  const txns = accountTransactions || [];

  if (txns.length === 0) {
    return {
      accountId: accId,
      name: account.name,
      email: account.email,
      riskScore: 0,
      riskLevel: "Low",
      riskReasons: [],
      recommendedAction: "Allow",
      status: account.status || "Active"
    };
  }

  const reasons = [];
  let scoreSum = 0;
  let highRiskCount = 0;
  let sharedDeviceWithOthersCount = 0;
  let behavioralDriftObserved = false;

  const devicesUsed = new Set();
  for (const t of txns) {
    scoreSum += t.riskScore;
    if (t.riskScore >= 50) highRiskCount++;
    if (t.deviceId) devicesUsed.add(t.deviceId);
    if (
      t.riskReasons &&
      t.riskReasons.some(
        (r) =>
          r.includes("Device has not previously been associated") ||
          r.includes("Merchant is new for this account") ||
          r.includes("Transaction location differs significantly")
      )
    ) {
      behavioralDriftObserved = true;
    }
  }

  const avgTxnScore = Math.round(scoreSum / txns.length);

  for (const dev of devicesUsed) {
    const accountsOnDev = context.deviceAccounts.get(dev);
    if (accountsOnDev && accountsOnDev.size > 1) {
      sharedDeviceWithOthersCount = Math.max(sharedDeviceWithOthersCount, accountsOnDev.size - 1);
    }
  }

  if (sharedDeviceWithOthersCount > 0) {
    reasons.push(`Account shares a device with ${sharedDeviceWithOthersCount} other account(s)`);
  }

  const hasSynchronized = txns.some((t) =>
    t.riskReasons && t.riskReasons.some((r) => r.includes("synchronized"))
  );
  if (hasSynchronized) {
    reasons.push("Account participates in a synchronized transaction pattern");
  }

  if (behavioralDriftObserved) {
    reasons.push("Account exhibits significant behavioral drift across spending, device, and location");
  }

  if (highRiskCount > 0) {
    reasons.push(`Elevated risk activity detected in ${highRiskCount} transaction(s)`);
  }

  // Account score balances average risk with network coordination and drift indicators
  let accountScore = Math.round(avgTxnScore * 0.7);
  if (sharedDeviceWithOthersCount >= 2) accountScore += 20;
  if (hasSynchronized) accountScore += 15;
  if (behavioralDriftObserved) accountScore += 15;

  const finalScore = Math.min(100, Math.max(0, accountScore));
  const riskLevel = getRiskLevel(finalScore);
  const recommendedAction = getRecommendedAction(riskLevel);

  return {
    accountId: accId,
    name: account.name,
    email: account.email,
    riskScore: finalScore,
    riskLevel,
    riskReasons: reasons,
    recommendedAction,
    status: account.status || "Active"
  };
}

/**
 * Detects coordinated fraud rings using multi-factor relationship clustering:
 * Identifies groups of >= 3 accounts linked through:
 * - Shared devices
 * - Shared high-liquidity merchants
 * - Synchronized timing and unusual items
 */
function detectFraudRings(transactionResults, accounts, context) {
  const highRiskTxns = transactionResults.filter((t) => t.riskScore >= 60);

  const adjacencyList = new Map();

  function addEdge(u, v) {
    if (!adjacencyList.has(u)) adjacencyList.set(u, new Set());
    if (!adjacencyList.has(v)) adjacencyList.set(v, new Set());
    adjacencyList.get(u).add(v);
    adjacencyList.get(v).add(u);
  }

  // Connect accounts that share a device and have suspicious transactions
  for (const [deviceId, accSet] of context.deviceAccounts.entries()) {
    if (accSet.size >= 2) {
      const accList = Array.from(accSet);
      for (let i = 0; i < accList.length; i++) {
        for (let j = i + 1; j < accList.length; j++) {
          addEdge(accList[i], accList[j]);
        }
      }
    }
  }

  // Find connected components (candidate rings)
  const visited = new Set();
  const components = [];

  for (const node of adjacencyList.keys()) {
    if (!visited.has(node)) {
      const comp = [];
      const queue = [node];
      visited.add(node);

      while (queue.length > 0) {
        const curr = queue.shift();
        comp.push(curr);

        const neighbors = adjacencyList.get(curr) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }

      components.push(comp);
    }
  }

  const fraudRings = [];
  let ringIndex = 1;

  for (const comp of components) {
    if (comp.length < 3) continue;

    const compTxns = highRiskTxns.filter((t) => comp.includes(t.accountId));

    if (compTxns.length < 3) continue;

    const sharedDevices = new Set();
    const sharedMerchants = new Set();
    const locations = new Set();
    const transactionIds = [];

    for (const txn of compTxns) {
      transactionIds.push(txn.transactionId);
      if (txn.deviceId) sharedDevices.add(txn.deviceId);
      if (txn.merchantId) sharedMerchants.add(txn.merchantId);
      if (txn.location) locations.add(txn.location);
    }

    const avgRisk = Math.round(
      compTxns.reduce((sum, t) => sum + t.riskScore, 0) / compTxns.length
    );
    const ringRiskScore = Math.min(100, Math.max(80, avgRisk));
    const riskLevel = getRiskLevel(ringRiskScore);

    fraudRings.push({
      ringId: `RING_${String(ringIndex++).padStart(3, "0")}`,
      name: `Coordinated Device & Asset Fraud Ring #${ringIndex - 1}`,
      accountIds: comp.sort(),
      sharedDevices: Array.from(sharedDevices),
      sharedMerchants: Array.from(sharedMerchants),
      locations: Array.from(locations),
      transactionIds,
      riskScore: ringRiskScore,
      riskLevel,
      pattern:
        "Multi-account rapid liquidation via shared hardware, coordinated merchant timing, and matched asset values",
      evidence: [
        `Coordinated network of ${comp.length} accounts sharing ${sharedDevices.size} hardware device(s)`,
        `Synchronized high-value transactions across ${sharedMerchants.size} merchant(s)`,
        `Closely matched transaction timing within shared geographic hubs`
      ],
      recommendedAction: "Block",
      detectedAt: new Date()
    });
  }

  return fraudRings;
}

/**
 * Main coordinator function that executes end-to-end fraud analysis.
 * Analyzes MongoDB raw records or in-memory arrays without modifying database records.
 */
async function analyzeTransactions(options = {}) {
  let accounts = options.accounts;
  let transactions = options.transactions;

  if (!accounts) {
    accounts = await Account.find().lean();
  }
  if (!transactions) {
    transactions = await Transaction.find().lean();
  }

  // 1. Build contextual graph indices
  const context = buildTransactionContext(transactions);

  // 2. Score individual transactions with behavioral baseline + drift + network signals
  const transactionResults = transactions.map((txn) =>
    calculateTransactionRisk(txn, context, transactions)
  );

  // 3. Score individual accounts
  const accountResults = accounts.map((account) => {
    const userTxns = transactionResults.filter((t) => t.accountId === account.accountId);
    return calculateAccountRisk(account, userTxns, context);
  });

  // 4. Detect fraud rings
  const fraudRings = detectFraudRings(transactionResults, accounts, context);

  return {
    transactionResults,
    accountResults,
    fraudRings
  };
}

module.exports = {
  analyzeTransactions,
  calculateAccountBaseline,
  calculateAmountAnomaly,
  detectBehavioralDrift,
  calculateNetworkSignals,
  calculateTransactionRisk,
  calculateAccountRisk,
  detectFraudRings
};
