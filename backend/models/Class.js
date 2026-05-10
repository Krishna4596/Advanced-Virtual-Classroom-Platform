const mongoose = require("mongoose");
const crypto = require("crypto");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  classCode: { type: String, unique: true, index: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  announcements: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true }, 
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

classSchema.pre("save", function () {
  if (!this.classCode) {
    this.classCode = crypto.randomBytes(3).toString("hex").toUpperCase();
  }
});

module.exports = mongoose.model("Class", classSchema);