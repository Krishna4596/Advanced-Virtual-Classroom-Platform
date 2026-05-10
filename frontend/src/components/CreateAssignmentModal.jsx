/**
 * ============================================================
 * 📝 TITAN TASK DEPLOYMENT MODAL (v4.2 - Production)
 * Ref: Report Section 3.4 (Functional Modules)
 * Purpose: Secure assignment distribution with time-normalized deadlines.
 * ============================================================
 */

import React, { useState } from "react";
import API from "../api/api";
import { X, Upload, Send, AlertTriangle, ShieldCheck } from "lucide-react";

const CreateAssignmentModal = ({ isOpen, onClose, classId, onCreated }) => {
  const [formData, setFormData] = useState({ title: "", description: "", deadline: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 🛡️ Get Today's Date for Min-Date Constraint
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deadline) return alert("❌ PROTOCOL_ERROR: Deadline node required.");
    
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("classId", classId);
    
    // ⏱️ TIME_NORMALIZATION: Setting deadline to 11:59:59 PM of the selected date
    const selectedDate = new Date(formData.deadline);
    selectedDate.setHours(23, 59, 59, 999); 
    
    const isoDate = selectedDate.toISOString();
    data.append("deadline", isoDate);
    data.append("dueDate", isoDate); // Legacy support for different DB schemas

    if (file) data.append("file", file);

    try {
      // 🛰️ Transmitting to TITAN Assignment Endpoint
      await API.post("/assignments/create", data);
      
      if (onCreated) onCreated();
      onClose();
      // Reset State after successful handshake
      setFormData({ title: "", description: "", deadline: "" });
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "❌ DEPLOYMENT_FAILURE: Neural Link Interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#020617] p-10 rounded-[3.5rem] border-2 border-emerald-500/20 max-w-xl w-full space-y-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] relative overflow-hidden animate-in zoom-in-95 duration-500"
      >
        
        {/* 🌫️ Neural Glow Protocol */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] -z-10"></div>

        {/* 🛠️ Header Node */}
        <div className="flex justify-between items-center border-b border-slate-800/50 pb-8 relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Task Deployment</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Protocol: Assignment_V4.2</p>
             </div>
          </div>
          <button onClick={onClose} type="button" className="text-slate-500 hover:text-white transition-all hover:rotate-90">
             <X size={28} />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Title Node */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 italic">Task Descriptor</p>
            <input 
              type="text" 
              placeholder="e.g., RESEARCH_PROTOCOL_01" 
              className="w-full bg-slate-950/80 border border-slate-800 p-6 rounded-3xl text-white font-bold outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          {/* Instructions Node */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 italic">Operational Parameters</p>
            <textarea 
              placeholder="Specify the mission objectives and deliverables..." 
              className="w-full bg-slate-950/80 border border-slate-800 p-6 rounded-3xl text-white font-bold outline-none focus:border-emerald-500/50 transition-all h-36 placeholder:text-slate-800 resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          {/* Date Node */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 italic">Handshake Deadline (Auto-Normalized: 23:59:59)</p>
            <input 
              type="date" 
              min={today} // 🛡️ Restricting past dates
              className="w-full bg-slate-950/80 border border-slate-800 p-6 rounded-3xl text-white font-black outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest cursor-pointer"
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              required
            />
          </div>
        </div>

        {/* 📄 Resource Attachment */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800/50 p-10 rounded-[2.5rem] cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group relative z-10">
          <Upload size={36} className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic text-center leading-relaxed">
            {file ? `PROTOCOL_ATTACHED: ${file.name}` : "Attach Neural Documentation (PDF)"}
          </span>
          <input type="file" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        {/* 🚀 Action Handshake */}
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-emerald-600 hover:bg-emerald-500 py-7 rounded-[2.5rem] font-black text-white uppercase tracking-[0.5em] text-xs transition-all shadow-[0_20px_50px_rgba(16,185,129,0.2)] active:scale-95 disabled:opacity-50 relative z-10 flex items-center justify-center gap-4"
        >
          {loading ? "BROADCASTING_SIGNAL..." : <><Send size={18} strokeWidth={3}/> Transmit Assignment</>}
        </button>
      </form>
    </div>
  );
};

export default CreateAssignmentModal;