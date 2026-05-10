const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
// const logSecurityEvent = require("../utils/securityLogger"); // Agar file hai toh enable rakho

/**
 * 🔐 AUTHENTICATION GATEWAY (TITAN v5.0)
 * Ref: Report Section 3.3.1 (Identity & Access Management)
 * Fixed: Destructuring Export & Silent Recovery Logic.
 */

// 1. PRIMARY PROTECT MIDDLEWARE
const protect = async (req, res, next) => {
  try {
    // 🛰️ EXTRACT TOKEN: Headers ya Cookies dono support karta hai
    let token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication Node Missing: Please login to establish a session." 
      });
    }

    try {
      // ✅ ACCESS_TOKEN VERIFICATION
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ success: false, message: "Identity mismatch: Node not found." });
      }

      // 💉 INJECT CONTEXT: Ye data aage routes/controllers mein use hoga
      req.user = user;
      req.userRole = user.role;
      
      return next();

    } catch (err) {
      // 🔁 SESSION_RECOVERY: Silent Refresh Logic agar Access Token expire ho gaya ho
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken || err.name !== 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: "Session invalidated: Persistent identity required." 
        });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        const storedToken = await RefreshToken.findOne({
          token: refreshToken,
          user: decodedRefresh.id,
        });

        if (!storedToken) {
          // Security Breach: Token mismatch
          return res.status(403).json({ 
            success: false, 
            message: "Security Protocol Violation: Invalid session signature." 
          });
        }

        const user = await User.findById(decodedRefresh.id).select("-password");
        if (!user) return res.status(401).json({ success: false, message: "Recovery Node Unreachable." });

        // ✨ NEW TOKEN GENERATION
        const newAccessToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Update Cookies & Header
        res.setHeader("x-new-access-token", newAccessToken);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000 
        });

        req.user = user;
        req.userRole = user.role;
        
        return next();
      } catch (refreshErr) {
        return res.status(401).json({ success: false, message: "Refresh Token Expired. Please login." });
      }
    }
  } catch (error) {
    console.error("🔥 TITAN-AUTH CRITICAL FAILURE:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Neural Authentication Failure: System state unstable." 
    });
  }
};

// 2. 🛡️ AUTHORIZATION GATEKEEPER
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Security Access Error: Role [${req.userRole}] is unauthorized.`
      });
    }
    next();
  };
};

// 🚀 EXPORT BOTH: Crucial for authRoutes to work!
module.exports = { protect, authorize };