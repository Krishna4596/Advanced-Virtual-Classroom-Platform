/**
 * ============================================================
 * 🛡️ TITAN RESTRICTED ACCESS TERMINAL (v4.3 - Liquid UI)
 * Ref: Report Section 3.3 (RBAC & Access Control Fallbacks)
 * Fixed: Fluid Typography, Adaptive Firewall Aura, Shrinkable
 * Protocol Logs, and Mobile-First Recovery Buttons.
 * ============================================================
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Lock, RefreshCw, Zap, Activity } from "lucide-react";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    // 🔥 FIX: Adjusted min-height for mobile browsers (100dvh) and global padding
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#020617] text-white text-center px-4 sm:px-6 relative overflow-hidden selection:bg-red-600/40 font-sans">
      
      {/* 🌌 NEURAL FIREWALL AURA: High-intensity security alert glow */}
      {/* 🔥 FIX: Aura scales down smoothly for smaller screens to avoid horizontal overflow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[350px] md:w-[600px] h-[250px] sm:h-[350px] md:h-[600px] bg-red-600/5 blur-[80px] sm:blur-[100px] md:blur-[150px] rounded-full animate-pulse -z-10"></div>

      <main className="max-w-xl w-full animate-in fade-in zoom-in-95 duration-700 relative z-10 py-8 sm:py-12">
        
        {/* 🛡️ WARNING NODE INTERFACE */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-8 sm:mb-10 md:mb-14 group">
          <div className="absolute inset-0 bg-red-600/10 blur-2xl sm:blur-3xl rounded-full group-hover:bg-red-600/20 transition-all duration-1000"></div>
          <div className="relative z-10 w-full h-full bg-slate-950 border-2 border-red-500/30 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center shadow-3xl shadow-red-950/20 group-hover:border-red-500 transition-all duration-700">
             <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-red-500 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
          </div>
          {/* Security Lock Pulsar */}
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 md:-bottom-3 md:-right-3 bg-red-600 p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl animate-bounce border-2 sm:border-4 border-[#020617] group-hover:rotate-12 transition-transform">
             <Lock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* 📝 PROTOCOL LOGS */}
        <div className="space-y-4 md:space-y-6 mb-10 sm:mb-12 md:mb-16">
          <div className="space-y-2">
            {/* 🔥 FIX: clamp() forces the massive error code to fit within mobile constraints */}
            <h1 className="text-[clamp(3.5rem,15vw,6rem)] font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl px-2">
              Protocol <span className="text-red-600">403</span>
            </h1>
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-[7px] sm:text-[9px] md:text-[11px] font-black text-red-500 tracking-widest sm:tracking-[0.4em] md:tracking-[0.6em] italic break-words px-2 text-center">
              <Zap size={14} className="animate-pulse shrink-0" /> <span className="truncate">Access_Denied: Restricted_Directory</span>
            </div>
          </div>
          
          <div className="bg-slate-950/60 backdrop-blur-2xl border-2 border-slate-900 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
            <p className="text-slate-500 text-xs sm:text-sm md:text-lg font-medium leading-relaxed italic group-hover:text-slate-400 transition-colors">
              Your current neural profile possesses insufficient clearance to interface with this institutional node. 
              <span className="block mt-3 sm:mt-4 text-red-600 font-black text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest leading-normal sm:leading-none">
                ⚠️ SECURITY_ALERT: Entry attempt logged in Global_Audit_Buffer.
              </span>
            </p>
          </div>
        </div>

        {/* 🔗 RECOVERY COMMANDS */}
        {/* 🔥 FIX: Stack buttons vertically on mobile to preserve touch-target size */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-6 px-2 sm:px-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex-1 bg-white text-black py-4 sm:py-6 md:py-8 rounded-[1.5rem] sm:rounded-[1.8rem] md:rounded-[2.5rem] font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest sm:tracking-[0.3em] shadow-3xl hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 sm:gap-4 italic"
          >
            <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] hover:-translate-x-1 transition-transform" strokeWidth={3} /> Revert_Node
          </button>
          
          <button 
            onClick={() => navigate("/")} 
            className="flex-1 bg-slate-900/60 border-2 border-slate-800 text-slate-500 py-4 sm:py-6 md:py-8 rounded-[1.5rem] sm:rounded-[1.8rem] md:rounded-[2.5rem] font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest sm:tracking-[0.3em] hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-3 sm:gap-4 shadow-xl active:scale-95 italic group"
          >
            <RefreshCw className="w-4 h-4 sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px] group-hover:rotate-180 transition-transform duration-700" strokeWidth={3} /> Reset_Session
          </button>
        </div>

        {/* 📋 SYSTEM TELEMETRY FOOTER */}
        <div className="mt-16 sm:mt-20 md:mt-28 flex flex-col items-center gap-3 sm:gap-4 opacity-30 px-2">
           <div className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-12">
              <div className="h-px flex-1 bg-slate-900"></div>
              <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 animate-pulse shrink-0" />
              <div className="h-px flex-1 bg-slate-900"></div>
           </div>
           <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
              <p className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-slate-700 uppercase tracking-widest sm:tracking-[0.8em] italic truncate">TITAN_FIREWALL_PROTOCOL_V4.3</p>
              {/* Flex-wrap ensures tags don't break horizontal flow on tiny screens */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-6 text-[6px] sm:text-[7px] font-bold text-slate-800 uppercase tracking-widest">
                 <span>Instance: SECURE</span>
                 <span className="hidden sm:inline">Encryption: ACTIVE</span>
                 <span>Log_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}

export default Unauthorized;