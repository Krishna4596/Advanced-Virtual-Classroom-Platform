/**
 * ============================================================
 * 📝 NEURAL ASSIGNMENT & ANALYTICS MODEL (TITAN v4.2 - Final)
 * Fixed: Added 'resubmitted' to status enum to prevent 500 error.
 * ============================================================
 */
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    fileUrl: { type: String, required: true }, 
    fileName: { type: String, trim: true }, 
    marks: { type: Number, min: 0, max: 100, default: null },
    feedback: { type: String, default: "" },
    status: { 
      type: String, 
      // 🔥 FIX: Added "resubmitted" to the enum list
      enum: ["submitted", "graded", "re-eval", "late", "resubmitted"], 
      default: "submitted" 
    },
    isLate: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now } 
  },
  { timestamps: true }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 200 
    },
    description: { type: String, trim: true, maxlength: 2000 },
    attachment: { type: String, default: null }, 
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dueDate: { type: Date, required: true },
    totalPoints: { type: Number, default: 100 },
    averageMarks: { type: Number, default: 0 },
    submissions: [submissionSchema],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

assignmentSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});

assignmentSchema.index({ classId: 1, createdAt: -1 });
assignmentSchema.index({ teacher: 1, createdAt: -1 });

module.exports = mongoose.model("Assignment", assignmentSchema);