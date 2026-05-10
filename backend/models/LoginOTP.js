// backend/models/LoginOTP.js
const mongoose = require("mongoose");

/**
 * 🏛️ TITAN MFA GATEWAY: v4.2
 * Ref: Report Section 4.2 (Login Multi-Factor Authentication)
 * Purpose: Secure handling of volatile keys for session authorization.
 */

const loginOtpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One active challenge per user node
      index: true
    },
    otp: {
      type: String,
      required: true
    },
    // 🛡️ ANTI-BRUTE FORCE: Tracks failed verification attempts
    attempts: {
      type: Number,
      default: 0,
      max: 5 // Optional: Controller can use this to block the user
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

/**
 * ⚡ TTL ARCHITECTURE
 * Automatically purges the document when the challenge expires.
 */
loginOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("LoginOTP", loginOtpSchema);