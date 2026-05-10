/**
 * ============================================================
 * 🛰️ NEURAL ATTENDANCE TELEMETRY (TITAN v5.0)
 * ============================================================
 * Purpose: High-precision tracking of student engagement.
 * Upgraded: Supports Array-Based Bulk Sync & Global Classes.
 * ============================================================
 */
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // 👈 FIXED: Made required 'false' so Global Teacher Attendance doesn't crash
    classId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Class", 
      required: false, 
      index: true 
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    // 📅 Normalized Date
    date: { 
      type: Date, 
      required: true, 
      index: true,
      default: Date.now
    }, 
    
    // 🔥 THE FIX: Added 'records' array to match our Controller logic!
    records: [
      {
        student: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User", 
          required: true 
        },
        status: { 
          type: String, 
          default: "present" // Lowercase to match frontend
        },
        // ⏱️ Session Logistics (Kept your awesome telemetry metrics!)
        joinTime: { type: Date, default: Date.now },
        leaveTime: { type: Date, default: null },
        duration: { 
          type: Number, 
          default: 0, 
          description: "Total minutes spent in the neural session" 
        },
        ipAddress: { type: String, trim: true }
      }
    ],

    // 🤖 Automated Metadata
    isAutoMarked: { type: Boolean, default: false }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * 🛡️ THE NEW TRINITY LOCK
 * Logic: One Class Register per Day.
 */
attendanceSchema.index({ classId: 1, date: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);