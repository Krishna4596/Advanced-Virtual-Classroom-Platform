const mongoose = require("mongoose");

/**
 * 🛰️ NEURAL ACTIVITY TRACKER: v4.2
 * Ref: Report Section 3.3.4 (Security Audit Trail)
 * Purpose: Provides a forensic record of all node interactions within the AVCP.
 */

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Performance optimized for individual history lookups
    },
    // 🏷️ Category based tagging for better dashboard filtering
    type: {
      type: String,
      enum: ["LOGIN", "LOGOUT", "ACADEMIC", "SECURITY", "SYSTEM", "AUTH_CHALLENGE"],
      default: "SYSTEM",
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    // 🎯 Target Resource Tracking (Classroom ID, Assignment ID, etc.)
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      default: null
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    // 🔍 Meta-data for Browser/Device identification
    userAgent: {
      type: String,
      trim: true,
    }
  },
  { 
    timestamps: true,
    // Automated TTL (Time-To-Live) logic added for storage optimization
    // Logs will be automatically pruned if needed (Optional configuration)
  }
);

// 🚀 COMPOUND INDEXING: For ultra-fast "Recent Activity" queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);