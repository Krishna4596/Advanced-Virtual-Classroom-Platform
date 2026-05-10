/**
 * ============================================================
 * 🛡️ NEURAL SECURITY TELEMETRY (TITAN v4.2)
 * ============================================================
 * Ref: Report Section 3.3.4 (Security Audit Trail)
 * Purpose: Forensic logging of high-risk authentication and authorization events.
 */
const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema(
  {
    // 👤 USER_NODE: Linked to the user attempting the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null // Guest/Unauthorized attempts ke liye null reh sakta hai
    },
    
    // 🏷️ LOG_LEVEL: Categorizes the severity of the security event
    level: {
      type: String,
      enum: ["INFO", "WARNING", "CRITICAL", "FAILURE"],
      default: "INFO",
      index: true
    },

    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    // 🌐 GEOGRAPHIC_NODE: Forensic identifiers
    ip: {
      type: String,
      trim: true,
    },
    
    userAgent: {
      type: String,
      trim: true,
    },

    // 🎯 TARGET_DATA: Description of what was being accessed/modified
    details: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    // 🛡️ STATUS_CODE: Result of the security handshake
    status: {
      type: String,
      enum: ["SUCCESS", "BLOCKED", "DENIED", "INTERCEPTED"],
      default: "SUCCESS"
    }
  },
  { 
    timestamps: true 
  }
);

/**
 * 🚀 HIGH-SPEED AUDIT INDEX
 * Logic: Optimized for security officers to review recent incidents first.
 */
securityLogSchema.index({ createdAt: -1 });
securityLogSchema.index({ user: 1, level: 1 });

module.exports = mongoose.model("SecurityLog", securityLogSchema);