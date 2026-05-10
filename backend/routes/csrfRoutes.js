// backend/routes/csrfRoutes.js
const express = require("express");
const router = express.Router();
const csurf = require("csurf");

/**
 * 🛡️ TITAN SECURITY: CSRF HANDSHAKE (v4.2)
 * Ref: Report Section 3.3.4 (Cross-Site Request Forgery Protection)
 * Purpose: Generating and distributing volatile tokens to prevent unauthorized request forgery.
 */

// CSRF Protection Middleware configuration
const csrfProtection = csurf({ 
  cookie: {
    httpOnly: true, // 🛡️ Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Only sends over HTTPS in production
    sameSite: "strict" // Prevents the cookie from being sent in cross-site requests
  } 
});

/**
 * 🛰️ TOKEN DISCOVERY NODE
 * Logic: Frontend calls this during app initialization to sync the security handshake.
 */
router.get("/token", csrfProtection, (req, res) => {
  res.json({
    success: true,
    // Providing the unique token for subsequent POST/PUT/DELETE requests
    csrfToken: req.csrfToken()
  });
});

module.exports = router;