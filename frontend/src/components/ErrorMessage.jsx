/**
 * ============================================================
 * 🛡️ TITAN ERROR FEEDBACK NODE (v4.2 - Production)
 * Ref: Report Section 3.5 (Error Handling & UX)
 * Purpose: Displaying high-fidelity error telemetry to the user.
 * ============================================================
 */

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-500/5 border-2 border-red-500/20 p-8 rounded-[2.5rem] text-center my-8 animate-shake relative overflow-hidden group">
    
    {/* 🌫️ Ambient Error Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/5 blur-[50px] -z-10"></div>

    <div className="flex flex-col items-center gap-4">
      {/* ⚠️ Warning Icon Node */}
      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-[inset_0_0_15px_rgba(239,68,68,0.1)] border border-red-500/20 group-hover:scale-110 transition-transform duration-500">
        <AlertTriangle size={32} strokeWidth={2.5} />
      </div>

      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.4em]">System_Alert</h4>
        <p className="text-red-500 font-black text-sm tracking-tight leading-relaxed max-w-xs mx-auto italic">
          {message || "NEURAL_LINK_FAILURE: An unexpected error occurred. Please recalibrate."}
        </p>
      </div>

      {/* 🔄 Optional Retry Action */}
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-400 transition-all active:scale-95 shadow-lg shadow-red-500/20"
        >
          <RefreshCw size={14} /> Re-establish Link
        </button>
      )}
    </div>

    {/* Footer Metadata */}
    <div className="mt-6 pt-4 border-t border-red-500/10 flex justify-center">
       <span className="text-[8px] font-black text-red-500/30 uppercase tracking-[0.6em]">Protocol: Error_Capture_V4.2</span>
    </div>
  </div>
);

export default ErrorMessage;