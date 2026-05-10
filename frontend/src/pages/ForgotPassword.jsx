/**
 * ============================================================
 * 🔐 TITAN NEURAL KEY RECOVERY (Forgot Password)
 * ============================================================
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { Fingerprint, ArrowLeft, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import Loader from "../components/Loader";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required for node identification.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await API.post("/auth/forgot-password", { email });
      if (res.data.success) {
        setMessage(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signal lost. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden relative z-0">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>

      <div className="bg-slate-950/60 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] border-2 border-slate-900 shadow-[0_0_50px_rgba(37,99,235,0.1)] w-full max-w-lg relative animate-in zoom-in duration-700">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <Fingerprint className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter">Key Recovery</h1>
          <p className="text-[10px] sm:text-xs text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Identify Your Node</p>
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
            <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Linked Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@titan.com" 
              required
              className="w-full bg-[#020617] border-2 border-slate-800 focus:border-blue-500 rounded-xl px-4 py-4 text-white font-bold placeholder:text-slate-700 outline-none transition-all shadow-inner"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-blue-800 disabled:opacity-50 disabled:active:scale-100 italic"
          >
            {loading ? <Loader /> : <><Send size={16} /> Transmit Request</>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-500 font-black text-[10px] uppercase tracking-widest transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;