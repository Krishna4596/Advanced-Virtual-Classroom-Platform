/**
 * ============================================================
 * 🛡️ TITAN NEURAL AUTH GATEWAY (v4.4 - Key Recovery Integration)
 * Ref: Report Section 3.3 (MFA & Security Protocols)
 * Fixed: Added "Lost Neural Key?" routing to Forgot Password.
 * ============================================================
 */

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Zap, Fingerprint, Activity } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🛰️ AUTO-SYNC: Redirecting if already authenticated
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleGetOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const res = await API.post("/auth/login", { 
        email: normalizedEmail, 
        password 
      });

      if (res.data.success) {
        navigate("/verify-otp", { 
          state: { 
            email: normalizedEmail, 
            flow: "login" 
          } 
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "AUTHENTICATION_FAILED: Node access denied.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden selection:bg-blue-600/40 font-sans">
      
      {/* 🌌 Atmospheric Neural Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[100%] md:w-[80%] h-[100%] md:h-[80%] bg-blue-600/5 blur-[80px] md:blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-15%] w-[100%] md:w-[80%] h-[100%] md:h-[80%] bg-indigo-600/5 blur-[80px] md:blur-[120px] rounded-full animate-pulse [animation-delay:4s]"></div>
      </div>

      <main className="w-full max-w-2xl z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="glass rounded-[2rem] sm:rounded-[3.5rem] md:rounded-[5rem] p-6 sm:p-10 md:p-20 border-2 border-blue-500/10 shadow-2xl relative overflow-hidden group bg-slate-950/40 backdrop-blur-3xl">
          
          {/* 📡 SIGNAL STATUS OVERLAY */}
          <div className="absolute top-4 right-5 sm:top-6 sm:right-8 md:top-8 md:right-10 flex items-center gap-2 sm:gap-3 opacity-40 md:opacity-30">
             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
             <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] italic">Neural_Link: Stable</span>
          </div>

          {/* 🏛️ HEADER */}
          <header className="text-center mb-8 sm:mb-12 md:mb-16 mt-6 sm:mt-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-slate-950 border-2 border-blue-500/20 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto mb-6 sm:mb-8 shadow-inner group-hover:scale-105 transition-all duration-700">
              <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12 md:w-[48px] md:h-[48px]" strokeWidth={2} />
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-white uppercase tracking-tighter leading-none italic">
              Access <span className="text-blue-600">Node</span>
            </h1>
            <p className="text-slate-500 text-[8px] sm:text-[9px] md:text-xs font-black uppercase tracking-widest sm:tracking-[0.5em] mt-4 sm:mt-6 italic px-2">Secure Neural Authentication Protocol</p>
          </header>

          {/* ⚠️ ERROR TELEMETRY */}
          {error && (
            <div className="bg-red-600/10 text-red-500 border border-red-500/20 p-4 sm:p-5 rounded-xl sm:rounded-[1.5rem] mb-6 sm:mb-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-3 sm:gap-4 animate-in slide-in-from-top-4 text-left">
               <Zap size={16} className="animate-pulse shrink-0 sm:w-[18px] sm:h-[18px]" />
               <span className="truncate break-words whitespace-normal">{error}</span>
            </div>
          )}

          <form onSubmit={handleGetOTP} className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* 🆔 ID CLUSTER */}
            <div className="relative group/field">
              <Mail className="absolute left-5 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/field:text-blue-500 transition-all w-5 h-5 md:w-6 md:h-6" />
              <input
                type="email"
                placeholder="INSTITUTIONAL_EMAIL_ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 sm:pl-16 md:pl-24 pr-4 sm:pr-6 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] bg-slate-950/60 border-2 border-slate-800 focus:border-blue-600 text-base sm:text-lg md:text-2xl font-black text-white placeholder:text-slate-800 placeholder:italic transition-all outline-none leading-none truncate"
              />
            </div>

            {/* 🔑 KEY CLUSTER */}
            <div className="relative group/field">
              <Lock className="absolute left-5 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/field:text-blue-500 transition-all w-5 h-5 md:w-6 md:h-6" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ACCESS_ENCRYPTION_KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 sm:pl-16 md:pl-24 pr-12 sm:pr-16 md:pr-24 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] bg-slate-950/60 border-2 border-slate-800 focus:border-blue-600 text-base sm:text-lg md:text-2xl font-black text-white placeholder:text-slate-800 placeholder:italic transition-all outline-none leading-none truncate"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors z-10 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            </div>

            {/* 🔥 NEW: LOST KEY ROUTING (Forgot Password) */}
            <div className="flex justify-end -mt-2">
              <Link to="/forgot-password" className="text-[9px] sm:text-[10px] font-black text-slate-500 hover:text-blue-500 uppercase tracking-widest italic transition-colors">
                Lost Neural Key?
              </Link>
            </div>

            {/* 🚀 LOGIN BUTTON */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest sm:tracking-[0.4em] text-[10px] md:text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-4 italic mt-4 sm:mt-6"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Syncing...</span>
                </div>
              ) : (
                <><Fingerprint className="w-5 h-5 md:w-[22px] md:h-[22px] animate-pulse"/> Initialize Identity Link</>
              )}
            </button>
          </form>

          {/* 🔗 FOOTER */}
          <footer className="mt-8 sm:mt-12 md:mt-16 text-center border-t border-slate-900 pt-6 sm:pt-8 md:pt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest">
              <span>Need a New Instance?</span>
              <Link to="/register" className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-2 group transition-all">
                Establish Identity <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </footer>
        </div>

        {/* 🛡️ SYSTEM BAR */}
        <div className="mt-8 sm:mt-12 opacity-20 flex flex-col items-center gap-3 sm:gap-4 px-4 text-center">
           <div className="flex items-center gap-2 sm:gap-3">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 animate-pulse shrink-0"/>
              <span className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:tracking-[1em] truncate">Node_Encryption_Active</span>
           </div>
           <p className="text-[6px] sm:text-[7px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest italic truncate max-w-full">
              PROTOCOL: AVCP_V4.4 | SECURITY: TRINITY_MFA
           </p>
        </div>
      </main>
    </div>
  );
};

export default Login;