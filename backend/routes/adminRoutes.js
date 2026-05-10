// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const SecurityLog = require("../models/SecurityLog");
const auth = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

/**
 * 🏛️ ADMIN COMMAND CENTER (v4.2)
 * Ref: Report Section 3.3.1 (f) - Multi-Node Monitoring
 */

// 1. 👨‍👩‍👦 ASSIGN_CHILD: Creating a secure neural link between Parent and Student
router.post("/assign-child", auth, isAdmin, async (req, res) => {
  try {
    const { parentId, studentId } = req.body;

    // Prevention: Cannot link a parent to themselves
    if (parentId === studentId) {
      return res.status(400).json({ success: false, message: "Cyclic dependency error" });
    }

    const [parent, student] = await Promise.all([
      User.findById(parentId),
      User.findById(studentId)
    ]);

    if (!parent || parent.role !== "parent") {
      return res.status(400).json({ success: false, message: "Target account is not a Parent node" });
    }
    if (!student || student.role !== "student") {
      return res.status(400).json({ success: false, message: "Target account is not a Student node" });
    }

    // Check for existing link to prevent duplicates
    if (parent.children.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Relationship already synchronized" });
    }

    parent.children.push(studentId);
    await parent.save();

    // 🛡️ SECURITY AUDIT: Log this administrative change
    await SecurityLog.create({
      user: req.user.id,
      level: "INFO",
      action: "PARENT_STUDENT_LINK",
      ip: req.ip,
      details: `Parent ${parent.name} linked to Student ${student.name}`
    });

    res.json({ success: true, message: "Neural link established successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Command failed", error: err.message });
  }
});

// 2. 🛰️ TELEMETRY: Monitoring all system-wide activities
router.get("/activity-logs", auth, isAdmin, async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name role email") // Fetching full node details for audit
      .sort({ createdAt: -1 })
      .limit(200); // Storage safety limit

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to sync activity telemetry" });
  }
});

module.exports = router;