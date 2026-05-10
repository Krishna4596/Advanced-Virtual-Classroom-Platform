/**
 * ============================================================
 * 🔄 TITAN SYNC LOADER (v4.2 - Production)
 * Ref: Report Section 3.5 (User Experience & Telemetry)
 * Purpose: Visual feedback node during asynchronous handshakes.
 * ============================================================
 */

import React from "react";
import { Zap } from "lucide-react";

const Loader = ({ sm = false }) => {
  // ⚡ SM (Small) Mode for Buttons or Mini-Cards
  if (sm) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <span className="text-[10px] font-black uppercase tracking-widest">Syncing</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative">
        {/* 🌫️ Outer Neural Glow */}
        <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full animate-pulse"></div>
        
        {/* 🔄 Core Spinner Node */}
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-[6px] border-slate-900 rounded-full shadow-inner"></div>
          <div className="absolute top-0 left-0 w-full h-full border-[6px] border-blue-600 rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
        </div>
      </div>

      {/* 📡 Telemetry Status */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-blue-500 animate-pulse" />
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] italic">
            Synchronizing Neural Data
          </p>
        </div>
        <div className="w-24 h-0.5 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-loading-bar w-1/2 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;