const mongoose = require("mongoose");

const fraudRingSchema = new mongoose.Schema(
  {
    ringId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    accountIds: {
      type: [String],
      default: []
    },
    deviceIds: {
      type: [String],
      default: []
    },
    merchantIds: {
      type: [String],
      default: []
    },
    locations: {
      type: [String],
      default: []
    },
    transactionIds: {
      type: [String],
      default: []
    },
    riskScore: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      default: "Low"
    },
    pattern: {
      type: String,
      trim: true
    },
    evidence: {
      type: [String],
      default: []
    },
    recommendedAction: {
      type: String,
      default: "Review"
    },
    detectedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FraudRing", fraudRingSchema);
