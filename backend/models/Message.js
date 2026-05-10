// backend/models/Message.js
const mongoose = require("mongoose");

/**
 * 🛰️ NEURAL MESSAGE NODE (TITAN v4.2)
 * Ref: Report Section 3.4 (Real-time Communication Layer)
 * Purpose: Low-latency storage and retrieval of classroom-specific communications.
 */

const messageSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    // 📎 ATTACHMENT_NODE: Support for images/docs in chat
    attachment: {
      type: String,
      default: null
    },
    // 🛡️ STATUS_TRACKER: For tracking message state
    isSystemMessage: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    // Virtuals for cleaner frontend parsing
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * 🚀 HIGH-SPEED TELEMETRY INDEX
 * Logic: Optimized for fetching recent chat history within a specific classroom.
 */
messageSchema.index({ classId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);