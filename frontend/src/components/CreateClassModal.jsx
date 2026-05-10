/**
 * ============================================================
 * 🛡️ TITAN NODE INITIALIZER (v4.2 - Production)
 * Ref: Report Section 3.3.1 (Teacher Dashboard)
 * Purpose: Generating secure classroom clusters (Nodes).
 * ============================================================
 */

import React, { useState } from "react";
import API from "../api/api";
import Loader from "./Loader";
import { ShieldPlus, Zap, XCircle } from "lucide-react";

const CreateClassModal = ({ isOpen, onClose, onClassCreated }) => {
  const [formData, setFormData] = useState({ name: "", subject: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 🛡️ Anti-Spam Handshake

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/classes/create", formData);
      
      if (res.data.success) {
        // Dashboard synchronization protocol
        const newClass = res.data.data || res.data.class; 
        
        if (onClassCreated) onClassCreated(newClass); 
        
        onClose(); 
        setFormData({ name: "", subject: "", description: "" }); // Reset Node State
      }
    } catch (err) {
     const errorMsg = err.response?.data?.message || "INTERNAL_LINK_FAILURE";
    setError(errorMsg);
    console.error("❌ NODE_FAIL:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#020617] border-2 border-blue-500/10 w-full max-w-lg rounded-[3.5rem] p-10 md:p-12 shadow-[0_0_80px_-20px_rgba(37,99,235,0.2)] relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* 🌫️ Background Neural Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>

        <header className="mb-10 text-center relative z-10">
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-6 shadow-[0_0_15px_rgba(37,99,235,1)]"></div>
          <div className="flex items-center justify-center gap-3 mb-2">
             <ShieldPlus size={24} className="text-blue-500" />
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Create Node</h2>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Protocol: Virtual_Workspace_v4.2</p>
        </header>

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-8 flex items-center gap-4 animate-shake">
            <XCircle size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-[0.2em] italic">Node Descriptor (Name)</label>
            <input
              type="text"
              placeholder="e.g. ADVANCED_MERN_STACK"
              className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-900 shadow-inner"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-[0.2em] italic">Instruction Protocol (Subject)</label>
            <input
              type="text"
              placeholder="e.g. FULL_STACK_ENGINEERING"
              className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-900 shadow-inner"
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-[0.2em] italic">Node Brief (Summary)</label>
            <textarea
              placeholder="Establishing connection parameters..."
              className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-all font-bold h-28 resize-none placeholder:text-slate-900 shadow-inner"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-6 pt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-6 rounded-[1.5rem] bg-slate-950 text-slate-600 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all border border-slate-900 active:scale-95"
            >
              Abort
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-[2] py-6 rounded-[1.5rem] bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-blue-500 shadow-[0_20px_50px_rgba(37,99,235,0.2)] transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader sm /> : <><Zap size={16} fill="currentColor"/> Initialize Node</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;