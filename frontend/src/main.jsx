/**
 * ============================================================
 * 🛰️ AVCP NEURAL CORE: Main Entry Point (v4.2)
 * Ref: Report Section 3.2 (Architecture & Provider Context)
 * ============================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; 

// 🛡️ NEURAL PROVIDERS
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/ThemeContext"; 
import { AuthProvider } from "./context/AuthContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 📡 SECURITY HANDSHAKE
if (!clientId) {
  console.warn("%c⚠️ AVCP_SECURITY_ALERT: VITE_GOOGLE_CLIENT_ID missing.", "color: #ef4444; font-weight: bold;");
}

const AppProviders = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <AccessibilityProvider>
        {clientId ? (
          <GoogleOAuthProvider clientId={clientId}>
            {children}
          </GoogleOAuthProvider>
        ) : (
          <div className="neural-no-auth-container min-h-screen">
            {children}
          </div>
        )}
      </AccessibilityProvider>
    </AuthProvider>
  </ThemeProvider>
);

// 🛡️ PRIMARY_MOUNT
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders>
      <div className="min-h-screen bg-[#020617] selection:bg-blue-600/40 selection:text-white antialiased overflow-x-hidden scroll-smooth">
          <App />
      </div>
    </AppProviders>
  </React.StrictMode>
);