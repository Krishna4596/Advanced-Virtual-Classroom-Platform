/**
 * ============================================================
 * 🛰️ NEURAL SESSION ARCHIVE (TITAN v4.2)
 * ============================================================
 * Ref: Report Section 3.4 (Real-time Communication Layer)
 * Purpose: Tracking lifecycle, recordings, and telemetry of virtual classroom nodes.
 */
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    // 🎥 CLOUD_STORAGE_NODE: Link to the recorded session (S3/Cloudinary)
    recordingUrl: {
      type: String,
      trim: true,
      default: null
    },
    // 🏷️ SESSION_IDENTITY: For naming specific lectures
    title: {
      type: String,
      trim: true,
      default: "Untitled Neural Session"
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null
    },
    // ⏱️ TEMPORAL_METRICS: Calculated in minutes
    duration: {
      type: Number, 
      min: 0,
      default: 0
    },
    // 📊 SESSION_ANALYTICS: Peak engagement tracking
    peakParticipants: {
      type: Number,
      default: 0
    },
    // 🛡️ STATUS_TRACKER
    status: {
      type: String,
      enum: ["LIVE", "COMPLETED", "TERMINATED"],
      default: "LIVE"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * 🚀 ARCHIVE RETRIEVAL INDEX
 * Logic: Optimized for fetching the most recent sessions of a classroom first.
 */
sessionSchema.index({ classId: 1, startedAt: -1 });

module.exports = mongoose.model("Session", sessionSchema);