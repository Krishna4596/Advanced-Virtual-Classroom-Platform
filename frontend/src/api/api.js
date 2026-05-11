/**
 * ============================================================
 * 🛡️ TITAN API GATEWAY (v5.4 - JWT Only Build)
 * Upgrade: Removed CSRF Handshake. Fully secured via JWT.
 * ============================================================
 */
import axios from "axios";

// 🌐 DYNAMIC_BASE_URL: Centralizing the endpoint
const BASE_URL = `${import.meta.env.VITE_BACKEND_API || "http://localhost:5000"}/api`;

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ================= 🛸 REQUEST_INTERCEPTOR =================
API.interceptors.request.use(async (config) => {
  // 1. 🔑 JWT_AUTH: Injecting access token into the header node
  const authToken = localStorage.getItem("token");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  // 2. 📤 MULTIPART_HANDSHAKE: Auto-detecting file uploads
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
}, (error) => Promise.reject(error));

// ================= 📡 RESPONSE_INTERCEPTOR =================
API.interceptors.response.use(
  (response) => {
    // 🔥 SILENT TOKEN RECOVERY SYNC
    const newAccessToken = response.headers["x-new-access-token"];
    if (newAccessToken) {
      console.log("🔄 TITAN_SIGNAL: Session seamlessly rotated & updated.");
      localStorage.setItem("token", newAccessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Safety check in case originalRequest is undefined
    const isAuthCheck = originalRequest?.url?.includes("/auth/me");

    // 🔄 PERMANENT SESSION DEATH HANDLING
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthCheck) {
      console.warn("⚠️ TITAN_SIGNAL: Session Links Permanently Expired.");
      localStorage.removeItem("token");
      
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login?session=expired";
      }
    }

    return Promise.reject(error);
  }
);

export default API;