/**
 * ============================================================
 * 🛰️ TITAN JOIN NODE MODAL (v4.2 - Production)
 * Ref: Report Section 3.3.1 (Student Onboarding)
 * Purpose: Authorizing student access to classroom clusters.
 * ============================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Hash, GraduationCap, ShieldCheck, Zap } from 'lucide-react';

const JoinClassModal = ({ isOpen, onClose, onJoin }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // 🛰️ Neural Focus Protocol
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    } else {
      setCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 🔥 FIX: Error handling aur silent return ko fix kar diya
  const handleJoin = async () => {
    const sanitizedCode = code.trim();
    
    if (!sanitizedCode) {
      alert("⚠️ Node ID is required to establish link.");
      return;
    }
    
    try {
      setLoading(true);
      // 🛰️ Triggering Handshake with Parent Component
      await onJoin(sanitizedCode);
    } catch (error) {
      console.error("❌ Link Failure:", error);
      alert("Failed to connect to the node. Check console.");
    } finally {
      setLoading(false);
      // Optional: Agar tu chahe toh input clear na karein if error aata hai
      // Par success ke case mein Parent component is modal ko close kar dega
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleJoin();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020617]/95 backdrop-blur-2xl p-6 animate-in fade-in duration-500">
      
      <div className="glass w-full max-w-lg rounded-[4rem] border-2 border-white/5 shadow-[0_0_100px_rgba(37,99,235,0.15)] p-12 relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* 🌫️ Neural Aura Protocol */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/10 blur-[80px] -z-10"></div>

        {/* ❌ Terminate Button */}
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 text-slate-600 hover:text-white hover:rotate-90 transition-all duration-500 p-3 bg-slate-950/50 rounded-2xl border border-white/5"
        >
          <X size={20} />
        </button>

        {/* 🏗️ Header Interface */}
        <div className="text-center mb-12 space-y-5">
          <div className="w-20 h-20 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] group-hover:scale-105 transition-all">
            <GraduationCap size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Connect Node</h2>
            <p className="text-[10px] text-blue-500/60 font-black uppercase tracking-[0.4em] mt-4 italic flex items-center justify-center gap-3">
              <Zap size={12} className="animate-pulse fill-current"/> Establishing Neural Link
            </p>
          </div>
        </div>

        {/* 🏁 Input Injection Area */}
        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors">
              <Hash size={20} />
            </div>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Enter Protocol Node ID..." 
              value={code} 
              onKeyDown={handleKeyDown}
              onChange={(e) => setCode(e.target.value.toUpperCase())} // 🧠 Auto-caps for Node ID
              className="w-full pl-20 pr-8 py-7 bg-slate-950/80 border-2 border-slate-900 rounded-[2.5rem] outline-none focus:border-blue-500/50 text-white font-mono text-sm tracking-[0.3em] transition-all placeholder:text-slate-800 shadow-inner"
            />
          </div>

          {/* 🛡️ Handshake Verification Badge */}
          <div className="flex items-start gap-5 p-6 bg-slate-950/40 rounded-[2.5rem] border border-white/5">
            <ShieldCheck size={24} className="text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Access Handshake</p>
               <p className="text-[11px] text-slate-600 font-bold leading-relaxed italic uppercase tracking-tighter">
                 Provide the unique cluster ID to synchronize with your institutional node. Encryption active.
               </p>
            </div>
          </div>

          {/* 🚀 Action Handshake Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <button 
              onClick={onClose} 
              className="flex-1 py-6 text-slate-500 font-black text-[11px] uppercase tracking-[0.3em] hover:text-white transition-all rounded-[1.5rem] hover:bg-white/5"
            >
              Abort Link
            </button>
            <button 
              disabled={!code.trim() || loading}
              onClick={handleJoin} 
              className={`flex-[2] py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-3xl flex items-center justify-center gap-4 active:scale-95 ${
                !code.trim() 
                ? 'bg-slate-900 text-slate-700 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Syncing...
                </div>
              ) : (
                <><Search size={16} strokeWidth={3}/> Establish Handshake</>
              )}
            </button>
          </div>
        </div>

        {/* Branding Protocol */}
        <div className="mt-14 flex flex-col items-center gap-3">
           <div className="h-px w-24 bg-slate-800"></div>
           <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.6em]">
             TITAN_NODE_ACCESS_v4.2
           </p>
        </div>
      </div>
    </div>
  );
};

export default JoinClassModal;