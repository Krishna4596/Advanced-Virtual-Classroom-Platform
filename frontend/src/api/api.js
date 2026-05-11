//frontend/src/api/api.js
/**
 * ============================================================
 * 🛡️ TITAN API GATEWAY (v5.3 - Self-Healing Build)
 * Upgrade: Auto-Token Rotation Sync, CSRF Persistence.
 * Fix: Capturing silently refreshed tokens from Backend Headers.
 * ============================================================
 */
import axios from "axios";

// 🌐 DYNAMIC_BASE_URL: Centralizing the endpoint
const BASE_URL = `${import.meta.env.VITE_BACKEND_API || "http://localhost:5000"}/api`;

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let cachedCsrfToken = null;

/**
 * 🛰️ CSRF_HANDSHAKE: Fetches security token from the neural backend
 */
const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/csrf-token`, { 
      withCredentials: true 
    });
    cachedCsrfToken = response.data.csrfToken;
    return cachedCsrfToken;
  } catch (error) {
    console.error("❌ TITAN_SECURITY: CSRF Handshake Failed", error.message);
    return null;
  }
};

// ================= 🛸 REQUEST_INTERCEPTOR =================
API.interceptors.request.use(async (config) => {
  // 1. 🔑 JWT_AUTH: Injecting access token into the header node
  const authToken = localStorage.getItem("token");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  // 2. 🛡️ CSRF_ENFORCEMENT: Protected modification protocols
  if (!["get", "head", "options"].includes(config.method?.toLowerCase())) {
    let csrfToken = cachedCsrfToken || (await fetchCsrfToken());
    if (csrfToken) {
      // 🔥 FIX: 'X-CSRF-Token' hata kar 'CSRF-Token' kiya, taaki backend se match ho!
      config.headers["CSRF-Token"] = csrfToken; 
    }
  }

  // 3. 📤 MULTIPART_HANDSHAKE: Auto-detecting file uploads
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
}, (error) => Promise.reject(error));

// ================= 📡 RESPONSE_INTERCEPTOR =================
API.interceptors.response.use(
  (response) => {
    // 🔥 FIX 1: SILENT TOKEN RECOVERY SYNC
    const newAccessToken = response.headers["x-new-access-token"];
    if (newAccessToken) {
      console.log("🔄 TITAN_SIGNAL: Session seamlessly rotated & updated.");
      localStorage.setItem("token", newAccessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAuthCheck = originalRequest.url.includes("/auth/me");

    // 🔄 FIX 2: PERMANENT SESSION DEATH HANDLING
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthCheck) {
      console.warn("⚠️ TITAN_SIGNAL: Session Links Permanently Expired.");
      cachedCsrfToken = null;
      localStorage.removeItem("token");
      
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login?session=expired";
      }
    }

    // 🛡️ CSRF_RETRY: Agar CSRF fail ho toh ek baar naya token lekar retry karo
    if (error.response?.status === 403 && error.response?.data?.message?.includes("CSRF")) {
      cachedCsrfToken = null;
      const newToken = await fetchCsrfToken();
      if (newToken) {
        // 🔥 FIX: Yahan bhi 'X-CSRF-Token' ki jagah 'CSRF-Token' kar diya
        originalRequest.headers["CSRF-Token"] = newToken;
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default API;