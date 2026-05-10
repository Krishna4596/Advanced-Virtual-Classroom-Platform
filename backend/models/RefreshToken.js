/**
 * ============================================================
 * 🔑 NEURAL SESSION PERSISTENCE (TITAN v4.2)
 * ============================================================
 * Ref: Report Section 4.2 (Secure Token Rotation)
 * Purpose: Manages long-lived refresh tokens for seamless session continuity.
 */
const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      index: true, // Optimized for rapid lookup during rotation handshake
    },
    // 🛡️ SECURITY AUDIT: Tracking the source node of the refresh request
    ipAddress: { 
      type: String, 
      trim: true 
    },
    userAgent: { 
      type: String, 
      trim: true 
    },
    // 🔄 STATUS_TRACKER: For implementing "One-Time Use" refresh tokens
    isRevoked: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { 
    timestamps: true 
  }
);

/**
 * ⚡ STABLE TTL ARCHITECTURE
 * Logic: Automatically purges the record exactly when the session expires.
 */
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);