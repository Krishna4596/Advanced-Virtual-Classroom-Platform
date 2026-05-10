// backend/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

/**
 * 🛰️ TITAN NEURAL NOTIFICATION GATEWAY (v4.2)
 * Ref: Report Section 3.5 (Alerting & Feedback Loop)
 * Purpose: Routing real-time predictive alerts and academic signals.
 */

// 1. 📥 FETCH_NOTIFICATIONS: Get all persistent alerts for the user node
router.get("/", auth, notificationController.getNotifications);

// 2. ✅ MARK_READ: Update a single notification's read status
router.put("/:id/read", auth, notificationController.markAsRead);

// 3. 🧹 MARK_ALL_READ: Synchronize all unread nodes (UX Enhancement)
router.put("/mark-all-read", auth, async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: "All notifications synchronized to read state" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Bulk update handshake failed" });
  }
});

module.exports = router;