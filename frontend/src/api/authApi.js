/**
 * ============================================================
 * 🛡️ TITAN AUTH PROTOCOLS (v5.3 - Frontend Sync)
 * Ref: Report Section 4.2 (Auth Implementation) & 3.3.4 (MFA)
 * Fix: Explicit local memory cleanup on node termination.
 * ============================================================
 */
import API from "./api";

// 1. 📂 REGISTER
export const register = (userData) => API.post("/auth/register", userData);

// 2. 🛡️ VERIFY_EMAIL
export const verifyEmailOtp = (data) => API.post("/auth/verify-email-otp", data);

// 3. 🔄 RESEND_OTP
export const resendEmailOtp = (email) => API.post("/auth/resend-email-otp", { email });

// 4. 🔑 LOGIN_PHASE_1
export const login = (credentials) => API.post("/auth/login", credentials);

// 5. 🔓 LOGIN_PHASE_2
export const verifyLoginOtp = (data) => API.post("/auth/verify-login-otp", data);

// 6. 👤 IDENTITY_SYNC
export const getMe = () => API.get("/auth/me");

// 7. 🚪 TERMINATE: Systematic session cleanup and logout
export const logout = async () => {
  try {
    const res = await API.post("/auth/logout");
    // 🔥 FIX: Explicitly removing the token from client's neural memory
    localStorage.removeItem("token"); 
    return res.data;
  } catch (error) {
    console.error("🛰️ Logout Protocol Interference Detected");
    // Even if server fails, clear the local token to force logout
    localStorage.removeItem("token"); 
    throw error;
  }
};

/**
 * 🛠️ RECOVERY_CLUSTER: Node access restoration
 */
export const forgotPassword = (email) => API.post("/auth/forgot-password", { email });
export const resetPassword = (data) => API.post("/auth/reset-password", data);

// 🔄 TOKEN_ROTATION
export const refreshToken = () => API.post("/auth/refresh");