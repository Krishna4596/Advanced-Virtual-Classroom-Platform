// backend/routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const auth = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

/**
 * 🛰️ NEURAL SESSION CONTROLLER (TITAN v4.2)
 * Ref: Report Section 3.4 (Real-time Communication Layer)
 * Purpose: Handling lifecycle and telemetry of virtual classroom nodes.
 */

// 1. 🚀 START_SESSION: Teacher initiates a live academic node
router.post("/start", auth, isTeacher, async (req, res) => {
  try {
    const { classId, title } = req.body;
    
    const session = await Session.create({ 
      classId,
      title: title || "Untitled Neural Session", //
      status: "LIVE" //
    });
    
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: "Session initiation failed" });
  }
});

// 2. 🏁 END_SESSION: Teacher terminates the live node and pushes archives
router.post("/end", auth, isTeacher, async (req, res) => {
  try {
    const { sessionId, recordingUrl } = req.body;
    
    // Fetch session to calculate duration automatically
    const sessionRecord = await Session.findById(sessionId);
    if (!sessionRecord) return res.status(404).json({ message: "Session not found" });

    const endedAt = new Date();
    // Calculate duration in minutes (Auto-logic)
    const duration = Math.floor((endedAt - sessionRecord.startedAt) / 60000);

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { 
        endedAt, 
        recordingUrl, 
        duration,
        status: "COMPLETED" //
      },
      { returnDocument: 'after' }
    );

    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: "Session termination failed" });
  }
});

module.exports = router;