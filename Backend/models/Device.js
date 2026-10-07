const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    deviceType: {
      type: String,
      trim: true
    },
    os: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    accountIds: {
      type: [String],
      default: []
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

module.exports = mongoose.model("Device", deviceSchema);
