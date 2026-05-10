// backend/middleware/roleMiddleware.js
const logSecurityEvent = require("../utils/securityLogger");

/**
 * 🛡️ TITAN ROLE-BASED ACCESS CONTROL (v4.2)
 * Ref: Report Section 1.2 & 3.3.1 (f)
 * Purpose: Enforcing strictly defined node boundaries based on User Roles.
 */

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    // 🛡️ AUTH_CHECK: Ensuring identity context was established by authMiddleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied: Missing identity context." 
      });
    }

    // 🔍 AUTHORIZATION_CHECK: Validating user role against allowed array
    if (!allowedRoles.includes(req.user.role)) {
      
      // 🚩 SECURITY AUDIT: Log unauthorized access attempts
      await logSecurityEvent(
        req, 
        req.user.id, 
        "UNAUTHORIZED_ROLE_ACCESS_ATTEMPT", 
        "MEDIUM"
      );

      return res.status(403).json({ 
        success: false, 
        message: `Security Protocol Violation: Role [${req.user.role}] is restricted from this node.` 
      });
    }

    // ✅ Access Granted: Proceeding to the controller node
    next();
  };
};

/**
 * 🚀 TITAN PRE-CONFIGURED HELPERS
 * Streamlining route definitions for common access patterns.
 */
module.exports = {
  isTeacher: roleMiddleware("teacher"),
  isStudent: roleMiddleware("student"),
  isParent: roleMiddleware("parent"),
  isAdmin: roleMiddleware("admin"),
  // Support for dual-access nodes (e.g., Teacher and Admin)
  isStaff: roleMiddleware("teacher", "admin"),
  roleMiddleware
};