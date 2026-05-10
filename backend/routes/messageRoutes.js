const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getChatHistory } = require("../controllers/messageController");

/**
 * 🛰️ NEURAL MESSAGE PROTOCOLS
 * Clean Architecture: Route -> Middleware -> Controller
 */
router.get("/class/:classId", protect, getChatHistory);

module.exports = router;