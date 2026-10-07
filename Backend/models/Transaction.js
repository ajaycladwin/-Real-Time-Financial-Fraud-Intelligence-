const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    accountId: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    merchantId: {
      type: String,
      trim: true
    },
    deviceId: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    paymentChannel: {
      type: String,
      trim: true
    },
    items: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      default: "Completed"
    },
    // Fraud intelligence fields
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      default: "Low"
    },
    riskReasons: {
      type: [String],
      default: []
    },
    recommendedAction: {
      type: String,
      default: "Allow"
    },
    isFraud: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
