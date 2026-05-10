/**
 * ============================================================
 * 📤 TITAN TASK SUBMISSION NODE (v4.2 - Production Stabilized)
 * Ref: Report Section 3.4 (Academic Deliverables)
 * Fixed: Handshake Logic, File Validation, and Visual Feedback.
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, X, CheckCircle, Zap, ShieldCheck, AlertCircle } from 'lucide-react';

const SubmissionModal = ({ isOpen, onClose, onSubmit, assignmentTitle }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Reset state when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setLocalError("");
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setLocalError("");

    if (!selectedFile) return;

    // 🛡️ Payload Size Shield (10MB Limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setLocalError("PAYLOAD_OVERLOAD: File exceeds 10MB limit.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || isUploading) return;
    
    setIsUploading(true);
    setLocalError("");

    try {
      // 🛰️ Triggering parent uplink (StudentAssignments.jsx logic)
      await onSubmit(file);
      // Success logic is handled by parent, but we reset locally for safety
    } catch (err) {
      const msg = err.response?.data?.message || "TRANSMISSION_INTERRUPTED";
      setLocalError(msg);
      console.error("❌ UPLOAD_FAILURE:", msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6 animate-in fade-in duration-500 font-sans">
      
      <div className="glass w-full max-w-lg rounded-[4rem] border-2 border-slate-900 shadow-[0_0_100px_rgba(37,99,235,0.15)] p-10 md:p-12 relative overflow-hidden animate-in zoom-in-95 duration-500 bg-[#020617]/80">
        
        {/* 🌫️ Ambient Aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>

        {/* ❌ Close Handle */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-slate-700 hover:text-white transition-all hover:rotate-90 duration-300 z-20"
        >
          <X size={24} />
        </button>

        <header className="text-center mb-8 space-y-3">
          <div className="w-20 h-20 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto border border-blue-500/20 shadow-inner">
            <UploadCloud size={36} strokeWidth={2.5} className={isUploading ? "animate-bounce" : ""} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Submit Protocol</h2>
            <p className="text-[9px] text-blue-500/60 font-black uppercase tracking-[0.4em] mt-3 italic truncate px-4">
              Node_Target: <span className="text-white">{assignmentTitle || "GENERAL_TASK"}</span>
            </p>
          </div>
        </header>

        {/* ⚠️ Local Error Telemetry */}
        {localError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 flex items-center gap-3 animate-shake">
            <AlertCircle size={16} />
            <p className="text-[10px] font-black uppercase tracking-widest">{localError}</p>
          </div>
        )}

        {/* 📂 Transmission Zone */}
        <div className={`relative group border-2 border-dashed rounded-[2.5rem] p-10 text-center transition-all duration-500 ${
          file 
          ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
          : 'border-slate-800 hover:border-blue-500/40 bg-slate-950/40'
        }`}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="hidden" 
            id="fileUpload" 
            accept=".pdf,.doc,.docx,.jpg,.png,.zip"
          />
          
          <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
            {file ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-500">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
                  <CheckCircle size={28} strokeWidth={3} />
                </div>
                <div className="space-y-1">
                    <div className="text-white font-black text-sm truncate max-w-[240px] italic mx-auto">
                      {file.name}
                    </div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • READY
                    </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border border-slate-800 shadow-inner">
                  <FileText size={24} />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Select Neural Documentation</p>
                  <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.3em]">PDF, DOC, ZIP, IMG (Max 10MB)</p>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* 🛡️ Integrity Handshake */}
        <div className="mt-8 flex items-start gap-4 p-5 bg-slate-950/60 rounded-[2rem] border border-white/5 shadow-inner">
          <ShieldCheck size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
             <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">Academic Integrity Protocol</p>
             <p className="text-[9px] text-slate-600 leading-relaxed font-bold italic uppercase tracking-tight">
               Transmission confirms original research. Any data collision will trigger an audit.
             </p>
          </div>
        </div>

        {/* 🚀 Action Handshake */}
        <div className="flex gap-4 mt-8">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-5 text-slate-600 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all rounded-3xl hover:bg-white/5 active:scale-95"
          >
            Abort
          </button>
          <button 
            type="button"
            disabled={!file || isUploading}
            onClick={handleSubmit} 
            className={`flex-[2] py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
              !file 
              ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            {isUploading ? (
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Broadcasting...
                </div>
            ) : <><Zap size={14} fill="currentColor"/> Confirm Transmit</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;