/**
 * ============================================================
 * 🛰️ NEURAL RESPONSE INTERFACE (TITAN v5.0 - Bulletproof)
 * Ref: Report Section 3.2 (API Architecture & Standards)
 * Fixed: Added Safety Handshakes to prevent "json is not a function" crashes.
 * ============================================================
 */

/**
 * ✅ SUCCESS_RESPONSE: Standard 200-series handshake
 */
const successResponse = (
  res,
  message = "Operation Successful",
  data = null,
  statusCode = 200,
  meta = null 
) => {
  // 🛡️ Safety Handshake: Check if res is a valid express object
  if (!res || typeof res.status !== 'function') {
    console.error("❌ API_SYNC_CRITICAL: 'res' object was not passed to successResponse.");
    return;
  }

  const response = {
    success: true,
    message,
    data,
  };

  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

/**
 * ⚠️ FAIL_RESPONSE: Standard 400-series (Client-side errors)
 */
const failResponse = (
  res,
  message = "Invalid Request",
  statusCode = 400,
  errors = null
) => {
  if (!res || typeof res.status !== 'function') {
    console.error("❌ API_SYNC_CRITICAL: 'res' object was not passed to failResponse.");
    return;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors, 
  });
};

/**
 * ❌ ERROR_RESPONSE: Standard 500-series (Server-side critical failures)
 */
const errorResponse = (
  res,
  message = "Internal System Synchronisation Failure",
  statusCode = 500,
  error = null
) => {
  if (!res || typeof res.status !== 'function') {
    console.error("❌ API_SYNC_CRITICAL: 'res' object was not passed to errorResponse.");
    return;
  }

  const response = {
    success: false,
    message,
  };

  // 🛡️ SECURITY: Expose debug info ONLY in non-production nodes
  if (process.env.NODE_ENV !== "production" && error) {
    response.debug = error.message || error;
    if (error.stack) response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

// 🚀 EXPORT: Synchronized exports for global access
module.exports = {
  successResponse,
  failResponse,
  errorResponse,
};