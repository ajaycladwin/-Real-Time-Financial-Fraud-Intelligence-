const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    accountType: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    riskScore: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      default: "Low"
    },
    riskReasons: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Account", accountSchema);
