const API_BASE = "";

export async function fetchFraudAnalysis() {
  const res = await fetch(`${API_BASE}/api/fraud/analyze`);
  if (!res.ok) throw new Error(`Failed to load fraud analysis: ${res.statusText}`);
  return res.json();
}

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE}/api/fraud/transactions`);
  if (!res.ok) throw new Error(`Failed to load transactions: ${res.statusText}`);
  return res.json();
}

export async function fetchAccounts() {
  const res = await fetch(`${API_BASE}/api/fraud/accounts`);
  if (!res.ok) throw new Error(`Failed to load accounts: ${res.statusText}`);
  return res.json();
}

export async function fetchFraudRings() {
  const res = await fetch(`${API_BASE}/api/fraud/rings`);
  if (!res.ok) throw new Error(`Failed to load fraud rings: ${res.statusText}`);
  return res.json();
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE}/api/dashboard/summary`);
  if (!res.ok) throw new Error(`Failed to load dashboard summary: ${res.statusText}`);
  return res.json();
}

export async function createTransaction(payload) {
  const res = await fetch(`${API_BASE}/api/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function createAccount(payload) {
  const res = await fetch(`${API_BASE}/api/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchSingleTransaction(transactionId) {
  const res = await fetch(`${API_BASE}/api/fraud/transactions/${transactionId}`);
  if (!res.ok) throw new Error("Transaction not found");
  return res.json();
}

export async function fetchSingleAccount(accountId) {
  const res = await fetch(`${API_BASE}/api/fraud/accounts/${accountId}`);
  if (!res.ok) throw new Error("Account not found");
  return res.json();
}
