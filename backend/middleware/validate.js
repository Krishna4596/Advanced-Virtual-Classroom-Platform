// backend/middleware/validate.js
const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/apiResponse");

/**
 * 🛡️ NEURAL DATA VALIDATOR (TITAN v4.2)
 * Ref: Report Section 3.1 (Schema Design & Data Validation)
 * Purpose: Pre-processing incoming request payloads to ensure schema compliance.
 */

const validate = (req, res, next) => {
  // 🛰️ EXTRACT_ERRORS: Gathering results from express-validator chain
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Standardizing the error message for the UI
    const firstErrorMessage = errors.array()[0].msg;
    
    // 🚀 DISPATCH_ERROR: Using our calibrated API utility
    return errorResponse(
      res, 
      `Validation Error: ${firstErrorMessage}`, 
      400, 
      errors.array() // Sending full array for field-specific highlights in frontend
    );
  }

  // ✅ Data verified: Proceeding to the controller node
  next();
};

module.exports = validate;