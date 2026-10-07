const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Account = require("./models/Account");
const Transaction = require("./models/Transaction");
const { analyzeTransactions } = require("./services/fraudEngine");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Backend is working!"
  });
});

// ==================================================
// 1. CREATE ACCOUNT
// ==================================================
app.post("/api/accounts", async (req, res) => {
  try {
    const newAccount = new Account(req.body);
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create account",
      message: error.message
    });
  }
});

// ==================================================
// 2. GET ALL ACCOUNTS
// ==================================================
app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve accounts",
      message: error.message
    });
  }
});

// ==================================================
// 3. GET ACCOUNT BY ID
// ==================================================
app.get("/api/accounts/:accountId", async (req, res) => {
  try {
    const account = await Account.findOne({ accountId: req.params.accountId });
    if (!account) {
      return res.status(404).json({
        error: "Account not found",
        message: `No account found with accountId: ${req.params.accountId}`
      });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve account",
      message: error.message
    });
  }
});

// ==================================================
// 4. CREATE TRANSACTION
// ==================================================
app.post("/api/transactions", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create transaction",
      message: error.message
    });
  }
});

// ==================================================
// 5. GET ALL TRANSACTIONS
// ==================================================
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve transactions",
      message: error.message
    });
  }
});

// ==================================================
// 6. GET TRANSACTION BY ID
// ==================================================
app.get("/api/transactions/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.transactionId });
    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
        message: `No transaction found with transactionId: ${req.params.transactionId}`
      });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve transaction",
      message: error.message
    });
  }
});

// ==================================================
// 7. DASHBOARD SUMMARY
// ==================================================
app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const [
      totalAccounts,
      totalTransactions,
      fraudTransactions,
      highRiskTransactions,
      amountAggregate
    ] = await Promise.all([
      Account.countDocuments(),
      Transaction.countDocuments(),
      Transaction.countDocuments({ isFraud: true }),
      Transaction.countDocuments({ riskScore: { $gte: 70 } }),
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ])
    ]);

    const totalTransactionAmount = amountAggregate.length > 0 ? amountAggregate[0].total : 0;

    res.json({
      totalAccounts,
      totalTransactions,
      fraudTransactions,
      highRiskTransactions,
      totalTransactionAmount
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch dashboard summary",
      message: error.message
    });
  }
});

// ==================================================
// FRAUD INTELLIGENCE REST ENDPOINTS
// ==================================================

// 1. Full Fraud Analysis
app.get("/api/fraud/analyze", async (req, res) => {
  try {
    const analysis = await analyzeTransactions();
    res.json(analysis);
  } catch (error) {
    res.status(500).json({
      error: "Failed to run fraud analysis",
      message: error.message
    });
  }
});

// 2. Transaction Risk Analysis
app.get("/api/fraud/transactions", async (req, res) => {
  try {
    const { transactionResults } = await analyzeTransactions();
    res.json({ transactions: transactionResults });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve transaction risk analysis",
      message: error.message
    });
  }
});

// 3. Account Risk Analysis
app.get("/api/fraud/accounts", async (req, res) => {
  try {
    const { accountResults } = await analyzeTransactions();
    const accounts = accountResults.map((acc) => ({
      ...acc,
      recommendedAction:
        acc.riskScore >= 80
          ? "Block"
          : acc.riskScore >= 60
          ? "Review"
          : acc.riskScore >= 30
          ? "Monitor"
          : "Allow"
    }));
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve account risk analysis",
      message: error.message
    });
  }
});

// 4. Fraud Rings Endpoint
app.get("/api/fraud/rings", async (req, res) => {
  try {
    const { fraudRings } = await analyzeTransactions();
    res.json({ fraudRings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve fraud rings",
      message: error.message
    });
  }
});

// 5. Single Transaction Analysis
app.get("/api/fraud/transactions/:transactionId", async (req, res) => {
  try {
    const { transactionResults } = await analyzeTransactions();
    const transaction = transactionResults.find(
      (t) => t.transactionId === req.params.transactionId
    );
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      error: "Failed to analyze transaction",
      message: error.message
    });
  }
});

// 6. Single Account Analysis
app.get("/api/fraud/accounts/:accountId", async (req, res) => {
  try {
    const { accountResults } = await analyzeTransactions();
    const account = accountResults.find(
      (a) => a.accountId === req.params.accountId
    );
    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }
    const accountWithAction = {
      ...account,
      recommendedAction:
        account.riskScore >= 80
          ? "Block"
          : account.riskScore >= 60
          ? "Review"
          : account.riskScore >= 30
          ? "Monitor"
          : "Allow"
    };
    res.json(accountWithAction);
  } catch (error) {
    res.status(500).json({
      error: "Failed to analyze account",
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});