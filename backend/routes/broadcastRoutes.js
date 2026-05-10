const express = require("express");
const router = express.Router();
const { createBroadcast, getClassBroadcasts } = require("../controllers/broadcastController");
const { protect, authorize } = require("../middleware/authMiddleware");

// 🛰️ BROADCAST_PROTOCOLS
router.post("/create", protect, authorize("teacher"), createBroadcast);
router.get("/class/:classId", protect, getClassBroadcasts);

module.exports = router;