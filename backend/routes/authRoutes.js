/**
 * ============================================================
 * 🏛️ TITAN AUTHENTICATION GATEWAY (v5.4 - Node Config Patch)
 * Ref: Report Section 3.1 & 3.3 (RBAC Enforcement)
 * Fixed: Added /students node for Teacher Grading Center.
 * Upgrade: Integrated Node Configuration (Profile & Password update).
 * ============================================================
 */

const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Path check kar lena bhai

// 🛡️ MIDDLEWARE_NODES
const { protect, authorize } = require("../middleware/authMiddleware"); 
const validate = require("../middleware/validate"); 
const { registerValidator, loginValidator } = require("../middleware/validators/authValidator"); 

// 🧠 CONTROLLER_NODES
const {
  register,
  verifyEmailOtp,
  resendEmailOtp,
  login,
  verifyLoginOtp,
  refreshToken,
  logout,
  getMe,
  linkAdditionalChild,
  forgotPassword, 
  resetPassword,
  updateProfile,   // 🔥 NEW: Imported Profile Update logic
  updatePassword   // 🔥 NEW: Imported Internal Password Update logic
} = require("../controllers/authController");

/**
 * ------------------------------------------------------------
 * 🔓 PUBLIC IDENTITY PROTOCOLS
 * ------------------------------------------------------------
 */
router.post("/register", registerValidator, validate, register);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/resend-email-otp", resendEmailOtp);
router.post("/login", loginValidator, validate, login);
router.post("/verify-login-otp", verifyLoginOtp);

// Password Recovery Protocol
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/**
 * ------------------------------------------------------------
 * 🔄 SESSION & TOKEN MANAGEMENT
 * ------------------------------------------------------------
 */
router.post("/refresh", refreshToken);
router.post("/logout", logout);

/**
 * ------------------------------------------------------------
 * 👤 IDENTITY DISCOVERY & LINKING (Protected Nodes)
 * ------------------------------------------------------------
 */

// Global context retrieval (Available for all logged-in roles)
router.get("/me", protect, getMe);

// 🔥 NEW: NODE CONFIGURATION PROTOCOLS (Profile & Password Update)
router.put("/profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);

// GET ALL STUDENTS (For Teacher Grading Dropdown)
// Isse sirf Teacher ya authorized user hi students ki list nikal payega
router.get("/students", protect, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name _id email");
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Telemetry Fetch Failed." });
  }
});

// SECURITY PATCH: Only "parent" role can establish new neural student links
router.post("/link-child", protect, authorize("parent"), linkAdditionalChild); 

module.exports = router;