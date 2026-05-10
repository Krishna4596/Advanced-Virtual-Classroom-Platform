/**
 * ============================================================
 * 🛰️ TITAN INVITE MODAL (v4.2 - Production)
 * Ref: Report Section 3.3.1 (Onboarding Protocols)
 * Purpose: Secure classroom authorization & agent onboarding.
 * ============================================================
 */

import React, { useState } from "react";
import { X, Copy, Check, Share2, Terminal, Zap } from "lucide-react";

const InviteModal = ({ isOpen, onClose, classCode }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    // 🛰️ Transmitting Node ID to local clipboard
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
      {/* 🌑 Backdrop Protocol */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500" 
        onClick={onClose}
      ></div>
      
      {/* 🏗️ Modal Core */}
      <div className="relative w-full max-w-xl bg-[#01040a] border-2 border-blue-500/20 p-10 md:p-14 rounded-[4rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] animate-in zoom-in-95 duration-500 overflow-hidden">
        
        {/* 🌫️ Background Neural Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>

        {/* 🛠️ Header Node */}
        <div className="flex justify-between items-center mb-12 relative z-10">
          <div className="flex items-center gap-5">
             <div className="p-4 bg-blue-600/10 rounded-[1.5rem] text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <Share2 size={26} strokeWidth={2.5} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Invite Agents</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2 italic">Protocol: Authorization_Handshake</p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-white/5 rounded-full text-slate-600 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={32} />
          </button>
        </div>

        <div className="space-y-10 relative z-10">
           <div className="flex items-center gap-3 ml-4 opacity-60">
              <Zap size={14} className="text-blue-500 fill-current" />
              <p className="text-slate-400 text-[11px] font-black leading-relaxed uppercase tracking-[0.2em]">
                Transmit Node ID to authorize Agent access:
              </p>
           </div>

           {/* 🏁 Node ID Display */}
           <div className="bg-slate-900/30 border-2 border-slate-800 p-10 rounded-[3rem] flex flex-col items-center gap-8 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] relative">
              <div className="flex items-center gap-3">
                 <Terminal size={14} className="text-slate-700" />
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">Protocol Cluster ID</span>
              </div>
              
              <h3 className="text-6xl md:text-8xl font-black text-white tracking-[0.15em] italic drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                {classCode || "------"}
              </h3>
              
              <button 
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-4 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] transition-all duration-500 shadow-3xl active:scale-95 ${
                  copied 
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                  : 'bg-white text-black hover:bg-blue-600 hover:text-white shadow-blue-600/10'
                }`}
              >
                {copied ? <Check size={22} strokeWidth={4}/> : <Copy size={22} strokeWidth={3}/>}
                {copied ? "ID Synced" : "Copy Node ID"}
              </button>
           </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-12 flex justify-between items-center opacity-30">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="px-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.8em]">TITAN_AUTH_v4.2</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;