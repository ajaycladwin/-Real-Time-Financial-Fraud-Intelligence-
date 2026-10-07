const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
  {
    merchantId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    merchantName: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    riskScore: {
      type: Number,
      default: 0
    },
    riskReasons: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Merchant", merchantSchema);
