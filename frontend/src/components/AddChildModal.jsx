/**
 * ============================================================
 * 🛡️ TITAN PARENT-STUDENT LINKAGE MODAL (v4.2)
 * Ref: Report Section 3.3.1 (Parent Dashboard)
 * Purpose: Secure institutional handshake for academic monitoring.
 * ============================================================
 */

import React, { useState } from "react";
import { X, UserPlus, Send, Mail, Check, AlertCircle } from "lucide-react";
import API from "../api/api";

const AddChildModal = ({ isOpen, onClose, onAdded }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLink = async () => {
    // 🛡️ Basic Validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid institutional email node.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // 🛰️ Triggering Backend Handshake Protocol
      const res = await API.post("/parent/link-child", { studentEmail: email });
      
      if (res.data.success) {
        setSuccess(true);
        // Syncing with local state and closing modal after visual confirmation
        setTimeout(() => {
          onAdded();
          onClose();
          resetModal();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signal lost: Handshake rejected.");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSuccess(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
      {/* 🌑 Backdrop with Blur Protocol */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in" 
        onClick={onClose}
      ></div>

      {/* 🏗️ Modal Core */}
      <div className="relative w-full max-w-lg bg-[#01040a] border-2 border-yellow-500/20 p-8 md:p-12 rounded-[3rem] shadow-[0_0_50px_-12px_rgba(234,179,8,0.15)] animate-scale-in">
        
        {/* 🛠️ Header Node */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <UserPlus className="text-yellow-500" /> Link Student
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Enter Institutional Email Node:</p>
          
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if(error) setError("");
              }}
              placeholder="id_node@university.edu"
              className="w-full bg-slate-900/50 border-2 border-slate-800 p-6 pl-16 rounded-2xl text-white outline-none focus:border-yellow-500/50 focus:bg-slate-900 transition-all font-medium"
            />
          </div>

          {/* 🚩 Error Telemetry */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase animate-shake">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* 🚀 Action Button */}
          <button 
            onClick={handleLink}
            disabled={loading || success}
            className={`w-full py-6 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-500 flex items-center justify-center gap-4 ${
              success 
                ? 'bg-emerald-600 text-white cursor-default' 
                : loading 
                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                : 'bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-500/10'
            }`}
          >
            {success ? (
              <><Check size={18} className="animate-bounce" /> Link Verified</>
            ) : loading ? (
              "Synchronizing..."
            ) : (
              <><Send size={18}/> Initiate Handshake</>
            )}
          </button>
        </div>

        {/* 💡 Note */}
        <p className="mt-8 text-center text-slate-600 text-[9px] font-bold uppercase tracking-widest">
          Secure encrypted handshake required for student access.
        </p>
      </div>
    </div>
  );
};

export default AddChildModal;