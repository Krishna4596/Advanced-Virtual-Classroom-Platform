// models/EmailVerification.js
const mongoose = require("mongoose");

/**
 * 🛰️ NEURAL VERIFICATION NODE (TITAN v4.2)
 * Ref: Report Section 4.2 (MFA & Email Validation)
 * Purpose: Secure handling of temporary OTPs for identity verification.
 */

const emailVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true // Fast lookup during verification handshake
    },

    otp: {
      type: String,
      required: true
    },

    // 🛡️ SECURITY AUDIT: Tracks if this is a login challenge or registration
    type: {
      type: String,
      enum: ["REGISTRATION", "LOGIN_MFA", "PASSWORD_RESET"],
      default: "REGISTRATION"
    },

    expiresAt: {
      type: Date,
      required: true,
      // ⚡ TTL INDEX: MongoDB handles automatic deletion of expired nodes
      index: { expires: 0 }
    }
  },
  { timestamps: true }
);

// Compound index for faster verification check
emailVerificationSchema.index({ user: 1, otp: 1 });

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);