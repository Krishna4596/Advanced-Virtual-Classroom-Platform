/**
 * ============================================================
 * 🔐 TITAN NEURAL MFA GATEWAY (v5.5 - Liquid UI)
 * Ref: Report Section 3.3 (MFA Verification Protocols)
 * Fixed: Fluid OTP Input Grids, Mobile-First Paddings,
 * Adaptive Typography, and Touch-Friendly Resend Targets.
 * ============================================================
 */

import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { ShieldCheck, RefreshCw, Fingerprint, Zap } from "lucide-react";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const emailFromState = location.state?.email;
  const flowType = location.state?.flow || "register";

  const [email] = useState(emailFromState || "");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // 🛰️ SESSION_MONITOR: Protocol Integrity Check
  useEffect(() => {
    if (!emailFromState) {
      setError("🛑 PROTOCOL_FAIL: No active session. Redirecting...");
      setTimeout(() => navigate(flowType === "login" ? "/login" : "/register"), 3000);
    }
  }, [emailFromState, navigate, flowType]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return setError("Validation Error: 6-digit key required.");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = flowType === "login" ? "/auth/verify-login-otp" : "/auth/verify-email-otp";
      const res = await API.post(endpoint, { email, otp: finalOtp });

      if (res.data.success) {
        setSuccess("IDENTITY_VERIFIED: Syncing Neural Node...");
        
        if (flowType === "login" && res.data.user) {
          const { token, user } = res.data;
          
          // 🏆 1. Sync token and user to Context
          login(token || res.data.token, user); 
          
          // 🔥 FIX 1: Complete Dynamic Role Redirection
          let targetPath = "/student"; // Default
          if (user.role === "teacher") targetPath = "/teacher";
          if (user.role === "parent") targetPath = "/parent"; 
          if (user.role === "admin") targetPath = "/admin";
          
          // 🚀 2. Navigate after a small sync buffer
          setTimeout(() => navigate(targetPath, { replace: true }), 800);
        } else {
          // 📝 Registration Success
          setSuccess("EMAIL_VALIDATED: Node Established.");
          setTimeout(() => navigate("/login", { replace: true }), 1500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "🛑 HANDSHAKE_DENIED: MFA Failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 AUTO_TRIGGER: Handshake when 6th digit is materialized
  useEffect(() => {
    if (otp.join("").length === 6 && !loading) {
      handleVerify();
    }
  }, [otp]);

  const handleResend = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      // 🔥 FIX 2: Prevent backend crash on login flow resend
      if (flowType === "login") {
        setError("Security Policy: Please re-enter password to generate a new key.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      await API.post("/auth/resend-email-otp", { email }); 
      setSuccess("NEW_MFA_KEY_BROADCASTED.");
      
      // Clear OTP boxes for UX
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
    } catch (err) {
      setError("🛑 BROADCAST_FAILURE: Network interference.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🔥 FIX: Adjusted global padding for small screens
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] md:w-[800px] h-[100%] md:h-[800px] bg-blue-600/5 blur-[100px] md:blur-[250px] rounded-full animate-pulse"></div>
      </div>

      <main className="w-full max-w-2xl z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* 🔥 FIX: Glass card paddings and border-radius scaled down for mobile */}
        <div className="glass rounded-[2rem] sm:rounded-[3.5rem] md:rounded-[5rem] p-6 sm:p-10 md:p-20 border-2 border-blue-500/10 shadow-2xl text-center backdrop-blur-3xl bg-slate-950/40 w-full">
          <header className="mb-8 sm:mb-12 space-y-4 sm:space-y-8 mt-4 sm:mt-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-slate-950 border-2 border-blue-500/20 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto">
               {flowType === "login" ? <Fingerprint className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" /> : <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />}
            </div>
            {/* Dynamic Typography via clamp */}
            <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black tracking-tighter uppercase italic leading-none">
              {flowType === "login" ? "MFA Check" : "Verify"}
            </h1>
            <p className="text-slate-500 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest sm:tracking-[0.4em] italic truncate px-2 sm:px-4">{email}</p>
          </header>

          <div className="h-10 mb-6 sm:mb-8 flex items-center justify-center">
            {success && <div className="text-emerald-500 font-black uppercase text-[9px] sm:text-[10px] tracking-widest sm:tracking-[0.3em] animate-bounce italic px-2">{success}</div>}
            {error && <div className="text-red-500 font-black uppercase text-[9px] sm:text-[10px] tracking-widest sm:tracking-[0.3em] italic px-2">{error}</div>}
          </div>

          <form onSubmit={handleVerify} className="space-y-8 sm:space-y-12">
            {/* 🔥 FIX: Mobile-friendly adaptive gap and sizing for OTP inputs */}
            <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={el => inputRefs.current[index] = el}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-10 h-14 sm:w-12 sm:h-16 md:w-16 md:h-24 bg-slate-950 border-2 border-slate-800 rounded-xl sm:rounded-2xl text-center text-2xl sm:text-3xl md:text-5xl font-black text-blue-500 focus:border-blue-600 outline-none transition-all italic"
                />
              ))}
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] font-black uppercase tracking-widest sm:tracking-[0.5em] text-[10px] sm:text-xs shadow-xl active:scale-95 disabled:opacity-50 transition-all italic mt-4 sm:mt-0"
            >
              {loading ? "Handshaking..." : "Authenticate Node"}
            </button>
          </form>

          <footer className="mt-8 sm:mt-12">
            <button type="button" onClick={handleResend} className="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-widest sm:tracking-[0.3em] hover:text-blue-500 flex items-center justify-center gap-2 sm:gap-3 mx-auto italic transition-colors">
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""}`} /> 
              <span>Request New <span className="hidden sm:inline">Encryption</span> Key</span>
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;