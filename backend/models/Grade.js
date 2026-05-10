/**
 * ============================================================
 * 🗄️ TITAN NEURAL DB: Grade Schema
 * Purpose: Stores student performance metrics and remarks.
 * ============================================================
 */

const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  examType: { 
    type: String, 
    default: 'General Assessment' // e.g., Mid-Term, Final, Unit Test
  },
  score: { 
    type: Number, 
    required: true 
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },
  grade: { 
    type: String // A+, B, C etc. (Backend ya frontend par calculate kar sakte hain)
  },
  remarks: { 
    type: String, // Teacher ka feedback
    default: "Keep pushing the limits."
  }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);