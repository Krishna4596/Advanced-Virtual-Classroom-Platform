/**
 * ============================================================
 * 📊 NEURAL POLL & ENGAGEMENT MODEL (TITAN v4.2)
 * ============================================================
 * Purpose: Real-time feedback and classroom decision-making node.
 */
const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    classId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Class", 
      required: true, 
      index: true 
    },
    // 👤 TEACHER_NODE: Tracking who initiated the poll
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    question: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 500 
    },
    options: [{
      text: { type: String, required: true },
      // 🗳️ NEURAL VOTE COUNT: Managed by controller increments
      votes: { type: Number, default: 0 }
    }],
    // 🛡️ TRACEABILITY: Prevent double voting and track student identity
    voters: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }], 
    active: { 
      type: Boolean, 
      default: true, 
      index: true 
    },
    // ⏱️ TEMPORAL LOGIC: Optional automatic poll closure
    expiresAt: { 
      type: Date,
      default: null 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * 🚀 VIRTUALS: Aggregate data for faster UI rendering
 */
pollSchema.virtual('totalVotes').get(function() {
  return this.voters.length;
});

// Performance indexing for classroom feed
pollSchema.index({ classId: 1, active: 1, createdAt: -1 });

module.exports = mongoose.model("Poll", pollSchema);