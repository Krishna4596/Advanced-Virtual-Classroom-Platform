/**
 * ============================================================
 * 🛰️ TITAN GOOGLE AUTH NODE (v4.2 - Production)
 * Ref: Report Section 3.3.4 (Cybersecurity & OAuth)
 * Purpose: Secure passwordless handshake via Google Ecosystem.
 * ============================================================
 */

import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { ShieldCheck, Zap } from "lucide-react";
import ErrorMessage from "./ErrorMessage"; // Reusing our error node

function GoogleLoginButton() {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);

      if (!credentialResponse?.credential) {
        throw new Error("INVALID_NEURAL_TOKEN: Handshake rejected by Google.");
      }

      // 🛰️ Transmitting token to TITAN Backend for Verification
      const res = await API.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      // Supporting both .data.data and .data response structures
      const userData = res?.data?.data || res?.data;
      
      if (userData) {
        login(userData);
      } else {
        throw new Error("NODE_SYNC_ERROR: Profile retrieval failed.");
      }

    } catch (err) {
      console.error("❌ Google_Auth_Error:", err);
      setError(err.response?.data?.message || "OAuth Handshake Failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 gap-4 w-full">
      {/* 🔮 Neural Divider */}
      <div className="flex items-center gap-4 w-full opacity-30 mb-2">
        <div className="h-px flex-1 bg-slate-800"></div>
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">OR_USE_NEURAL_ID</span>
        <div className="h-px flex-1 bg-slate-800"></div>
      </div>

      <div className="relative group">
        {/* Glow Effect behind the button */}
        <div className="absolute inset-0 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
        
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError("OAUTH_SIGNAL_LOST: Connection failed.")}
          useOneTap
          theme="filled_black"
          shape="pill"
          text="continue_with"
          width="320px"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-3 animate-pulse">
          <Zap size={14} className="text-blue-500" />
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Validating Credentials...</p>
        </div>
      )}

      {error && <ErrorMessage message={error} />}
      
      {/* 🔐 Security Badge */}
      <div className="flex items-center gap-2 opacity-40 mt-2">
        <ShieldCheck size={12} className="text-slate-500" />
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol: SSL_ENCRYPTED_OAUTH</span>
      </div>
    </div>
  );
}

export default GoogleLoginButton;