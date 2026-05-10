/**
 * ============================================================
 * 🔑 TITAN NEURAL KEY OVERRIDE (Reset Password - v2)
 * Upgrade: Added Neural Eye (Show/Hide Password) Toggle.
 * ============================================================
 */

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { Lock, ShieldAlert, CheckCircle2, KeyRound, Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";

function ResetPassword() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // 🔥 NEW STATES: To track password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Security mismatch: Keys do not align.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        setMessage("Neural Key overridden successfully.");
        setTimeout(() => navigate("/login"), 3000); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or Expired Token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-emerald-500/30 overflow-hidden relative z-0">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/10 blur-[150px] -z-10 rounded-full"></div>

      <div className="bg-slate-950/60 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] border-2 border-slate-900 shadow-[0_0_50px_rgba(16,185,129,0.1)] w-full max-w-lg relative animate-in zoom-in duration-700">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600/10 border-2 border-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <KeyRound className="w-8 h-8 text-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter">Key Override</h1>
          <p className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Establish New Access Code</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500 font-bold text-xs uppercase tracking-widest animate-in slide-in-from-top-2">
            <ShieldAlert size={16} className="shrink-0" /> {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-500 font-bold text-xs uppercase tracking-widest animate-in slide-in-from-top-2">
            <CheckCircle2 size={16} className="shrink-0" /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">New Neural Key</label>
            {/* 🔥 FIX: Wrapped in relative div and added Eye Button */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                minLength={6}
                className="w-full bg-[#020617] border-2 border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-4 text-white font-bold placeholder:text-slate-700 outline-none transition-all shadow-inner pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm Key</label>
            {/* 🔥 FIX: Wrapped in relative div and added Eye Button */}
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                required
                minLength={6}
                className="w-full bg-[#020617] border-2 border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-4 text-white font-bold placeholder:text-slate-700 outline-none transition-all shadow-inner pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-emerald-800 disabled:opacity-50 disabled:active:scale-100 italic"
          >
            {loading ? <Loader /> : <><Lock size={16} /> Execute Override</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;