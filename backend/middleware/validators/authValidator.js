// backend/middleware/validators/authValidator.js
const { body } = require("express-validator");

/**
 * 🔐 NEURAL AUTH VALIDATORS (TITAN v4.2)
 */

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Name must be between 2-150 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must only contain alphabets and spaces"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid academic or personal email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Security Policy: Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one numeric digit")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character (!@#$%^&*)"),

  body("role")
    .optional()
    .isIn(["student", "teacher", "parent"])
    .withMessage("Invalid Role: Please select a valid system identity"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Identity Error: Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Credential Error: Password field cannot be empty"),
];

// 🔥 FIXED: Curly brace se band kiya
module.exports = {
  registerValidator,
  loginValidator,
};