// backend/config/roles.js
const logger = require("../utils/logger");

/**
 * 🛡️ TITAN ROLE-BASED ACCESS CONTROL (v4.2)
 * Ref: Report Section 1.2 (Access Matrix) & 3.3.1 (f)
 * Purpose: Enforcing strictly defined feature-access boundaries across the platform.
 */

const roles = {
  teacher: [
    "CREATE_CLASS", "VIEW_CLASS", "UPDATE_CLASS", "DELETE_CLASS",
    "CREATE_ASSIGNMENT", "VIEW_ASSIGNMENT", "GRADE_ASSIGNMENT",
    "MARK_ATTENDANCE", "VIEW_ANALYTICS", "COMMUNICATE_PARENT",
  ],
  student: [
    "JOIN_CLASS", "VIEW_CLASS", "VIEW_ASSIGNMENT", "SUBMIT_ASSIGNMENT", 
    "VIEW_OWN_PROGRESS", "PARTICIPATE_POLL",
  ],
  parent: [
    "VIEW_CHILD_PROGRESS", // Ref: Parent Portal Module
    "VIEW_ATTENDANCE", 
    "RECEIVE_NOTIFICATIONS",
  ],
  admin: ["ALL"],
};

// 🔒 IMMUTABILITY: Preventing runtime modification of the role matrix
Object.freeze(roles);

/**
 * 🔍 PERMISSION_CHECKER: Logic node for validating user capabilities
 */
const hasPermission = (role, permission) => {
  if (!roles[role]) {
    logger.warn(`⚠️ [AUTH_GATE]: Attempt to check undefined role [${role}]`);
    return false;
  }
  
  if (roles[role].includes("ALL")) return true;
  
  return roles[role].includes(permission);
};

module.exports = { roles, hasPermission };