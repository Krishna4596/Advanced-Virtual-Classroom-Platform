const Message = require("../models/Message");
const Class = require("../models/Class");

/**
 * @desc    Fetch classroom chat history with security verification
 * @route   GET /api/messages/class/:classId
 */
exports.getChatHistory = async (req, res) => {
  try {
    const { classId } = req.params;
    const { limit = 50 } = req.query;
    const userId = req.user.id;

    // 🛡️ SECURITY_GATE: Verify if user belongs to this class
    const classroom = await Class.findById(classId);
    if (!classroom) {
      return res.status(404).json({ success: false, message: "Node not found" });
    }

    const isAuthorized = 
      classroom.teacher.toString() === userId || 
      classroom.students.some(s => s.toString() === userId);

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: "Unauthorized Node Access" });
    }

    // 🚀 TELEMETRY_RETRIEVAL
    const messages = await Message.find({ classId })
      .populate("user", "name role avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean(); // Performance boost for read-only data

    res.json({ 
      success: true, 
      data: messages.reverse() // Chronological order sync
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Sync failed", error: err.message });
  }
};