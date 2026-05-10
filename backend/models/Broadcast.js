const mongoose = require("mongoose");

const broadcastSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high", "critical"], 
    default: "medium" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Broadcast", broadcastSchema);