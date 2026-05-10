/**
 * ============================================================
 * ⚙️ TITAN NODE CONFIGURATION (v5.6 - Eye Toggle Patch)
 * Feature: Profile Update & Internal Password Override.
 * Upgrade: Added Neural Eye (Show/Hide Password) Toggle.
 * Theme: Sci-Fi Glassmorphism with adaptive telemetry.
 * ============================================================
 */

import React, { useState, useContext, useEffect } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { 
  User, ShieldCheck, Key, Save, AlertTriangle, 
  CheckCircle2, Activity, Mail, Lock, Zap, Eye, EyeOff 
} from "lucide-react";

function Profile() {
  const { user, setUser } = useContext(AuthContext);

  // Profile State
  const [name, setName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [msgProfile, setMsgProfile] = useState("");
  const [errProfile, setErrProfile] = useState("");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);
  const [msgPass, setMsgPass] = useState("");
  const [errPass, setErrPass] = useState("");

  // 🔥 NEW: Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync state with Context when component loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  // --------------------------------------------------------
  // ⚙️ UPDATE PROFILE HANDLER
  // --------------------------------------------------------
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setErrProfile("");
    setMsgProfile("");

    try {
      const res = await API.put("/auth/profile", { name });
      if (res.data.success) {
        setMsgProfile(res.data.message);
        // Sync AuthContext with new name so UI updates globally
        setUser((prev) => ({ ...prev, name: res.data.data.name }));
      }
    } catch (err) {
      setErrProfile(err.response?.data?.message || "Sync Failed. Try again.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // --------------------------------------------------------
  // 🔐 UPDATE PASSWORD HANDLER
  // --------------------------------------------------------
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoadingPass(true);
    setErrPass("");
    setMsgPass("");

    if (newPassword !== confirmPassword) {
      setErrPass("Security Mismatch: New keys do not align.");
      setLoadingPass(false);
      return;
    }

    try {
      const res = await API.put("/auth/update-password", { currentPassword, newPassword });
      if (res.data.success) {
        setMsgPass(res.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Optional: Reset visibility after successful change
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (err) {
      setErrPass(err.response?.data?.message || "Key Override Failed.");
    } finally {
      setLoadingPass(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-in fade-in duration-1000 p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-10 md:space-y-12 max-w-[1900px] mx-auto min-h-screen selection:bg-blue-500/30 pb-24 md:pb-32">
      
      {/* 🏛️ EXECUTIVE COMMAND HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-950/40 backdrop-blur-3xl p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-900 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 blur-[100px] md:blur-[150px] -z-10"></div>
        
        <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full">
          <div className="bg-blue-600 w-2 md:w-2.5 h-12 sm:h-16 md:h-20 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.4)] shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-[clamp(2rem,4vw,5rem)] font-black tracking-tighter text-white uppercase italic leading-none break-words">
              Node Config
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
               <Activity size={12} className="text-blue-500 animate-pulse shrink-0"/>
               <p className="text-slate-500 font-black text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest sm:tracking-[0.4em] italic leading-none truncate">
                 Clearance: <span className="text-blue-500">{user.role}</span>
               </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border-2 border-slate-800 px-6 py-4 rounded-2xl shrink-0 z-10">
           <ShieldCheck className="w-5 h-5 text-emerald-500" />
           <span className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Encrypted</span>
        </div>
      </header>

      {/* 🚀 SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* ========================================== */}
        {/* 🧬 PANEL 1: IDENTITY DOSSIER (PROFILE)      */}
        {/* ========================================== */}
        <div className="bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-900 shadow-2xl relative overflow-hidden flex flex-col group hover:border-blue-500/30 transition-colors duration-700">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/5 blur-[80px] -z-10 rounded-full"></div>
          
          <div className="flex items-center gap-4 mb-8 sm:mb-10 border-b-2 border-slate-900 pb-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-blue-500 border border-white/5 shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500">
              <User className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tighter">Identity Dossier</h2>
              <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest italic mt-1">Operator Details</p>
            </div>
          </div>

          {/* Alerts */}
          {errProfile && <AlertBox type="error" msg={errProfile} />}
          {msgProfile && <AlertBox type="success" msg={msgProfile} />}

          <form onSubmit={handleProfileUpdate} className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Operator Designation</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[#020617] border-2 border-slate-800 focus:border-blue-500 text-white font-bold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Field (Locked) */}
              <div className="space-y-2 opacity-60 cursor-not-allowed">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center justify-between">
                  Network Identity <Lock size={10} className="text-slate-500"/>
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[#020617] border-2 border-slate-800 text-slate-400 font-bold outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loadingProfile}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2 italic border-b-4 border-blue-800"
            >
              {loadingProfile ? <Loader /> : <><Save size={16}/> Sync Identity</>}
            </button>
          </form>
        </div>

        {/* ========================================== */}
        {/* 🔑 PANEL 2: NEURAL KEY OVERRIDE (PASSWORD)  */}
        {/* ========================================== */}
        <div className="bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-900 shadow-2xl relative overflow-hidden flex flex-col group hover:border-emerald-500/30 transition-colors duration-700">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600/5 blur-[80px] -z-10 rounded-full"></div>

          <div className="flex items-center gap-4 mb-8 sm:mb-10 border-b-2 border-slate-900 pb-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-emerald-500 border border-white/5 shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500">
              <Key className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tighter">Key Override</h2>
              <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest italic mt-1">Security Protocol</p>
            </div>
          </div>

          {/* Alerts */}
          {errPass && <AlertBox type="error" msg={errPass} />}
          {msgPass && <AlertBox type="success" msg={msgPass} />}

          <form onSubmit={handlePasswordUpdate} className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4 sm:space-y-5">
              
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Current Neural Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-12 py-4 rounded-2xl bg-[#020617] border-2 border-slate-800 focus:border-emerald-500 text-white font-bold outline-none transition-all placeholder:text-slate-800"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-emerald-500/70 uppercase tracking-widest pl-1">New Neural Key</label>
                <div className="relative">
                  <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-12 py-4 rounded-2xl bg-[#020617] border-2 border-slate-800 focus:border-emerald-500 text-white font-bold outline-none transition-all placeholder:text-slate-800"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Verify New Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-12 py-4 rounded-2xl bg-[#020617] border-2 border-slate-800 focus:border-emerald-500 text-white font-bold outline-none transition-all placeholder:text-slate-800"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loadingPass}
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2 italic border-b-4 border-emerald-800"
            >
              {loadingPass ? <Loader /> : <><ShieldCheck size={16}/> Execute Override</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

// --------------------------------------------------------
// 🧩 MINI COMPONENT: Alert Box
// --------------------------------------------------------
function AlertBox({ type, msg }) {
  const isErr = type === "error";
  return (
    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest animate-in slide-in-from-top-2 border ${
      isErr 
      ? "bg-red-500/10 border-red-500/50 text-red-500" 
      : "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
    }`}>
      {isErr ? <AlertTriangle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      {msg}
    </div>
  );
}

export default Profile;