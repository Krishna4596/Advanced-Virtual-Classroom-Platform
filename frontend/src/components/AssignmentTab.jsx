/**
 * ============================================================
 * 📋 TITAN ASSIGNMENT HUB (v4.2 - Production)
 * Ref: Report Section 3.4 (Functional Modules)
 * Purpose: Centralized Task Broadcast & Neural Submission Audit.
 * ============================================================
 */

import React, { useState, useEffect, useContext, useCallback } from "react";
import API from "../api/api";
import Loader from "./Loader";
import AssignmentCard from "./AssignmentCard"; 
import { AuthContext } from "../context/AuthContext";
import { Plus, X, ClipboardList, FileUp, Zap, ArrowLeft, ShieldAlert } from "lucide-react";

const AssignmentTab = ({ classId }) => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", deadline: "" });

  // 🛰️ Internal Navigation Protocols
  const [viewMode, setViewMode] = useState("list"); // "list" | "audit" | "submit"
  const [selectedAsm, setSelectedAsm] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // 🔄 Neural Fetch Protocol
  const fetchAssignments = useCallback(async () => {
    if (!classId) return;
    try {
      setFetchLoading(true);
      const res = await API.get(`/assignments/class/${classId}`);
      const rawData = res.data?.data?.assignments || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setAssignments(rawData);
    } catch (err) { 
      setAssignments([]); 
    } finally {
      setFetchLoading(false);
    }
  }, [classId]);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  // 📝 Task Creation Logic (Teacher Node)
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("deadline", formData.deadline);
    data.append("classId", classId);
    if (file) data.append("file", file);

    try {
      await API.post("/assignments/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowForm(false);
      setFormData({ title: "", description: "", deadline: "" });
      setFile(null);
      fetchAssignments();
      alert("Broadcast Protocol Successful: Task Synchronized! 🚀");
    } catch (err) { 
      alert("Neural Sync Failed: Check connectivity."); 
    } finally { 
      setLoading(false); 
    }
  };

  // 🚀 Integrated Action Handler (Direct Audit Mode)
  const handleAction = async (assignment) => {
    if (user?.role === 'teacher') {
      setSelectedAsm(assignment);
      setViewMode("audit");
      try {
        const res = await API.get(`/assignments/submissions/${assignment._id}`);
        setSubmissions(res.data?.data || []);
      } catch (err) { 
        console.error("Audit Fetch Error"); 
      }
    } else {
      // Student logic to trigger local submission modal or view
      setSelectedAsm(assignment);
      setViewMode("submit");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {viewMode === "list" ? (
        <>
          {/* 📋 Header Interface */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-10 rounded-[3.5rem] border border-slate-800 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20">
                <ClipboardList size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Work Protocols</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Classroom Node Task-Cluster</p>
              </div>
            </div>

            {user?.role === 'teacher' && (
              <button 
                onClick={() => setShowForm(!showForm)} 
                className={`mt-6 md:mt-0 flex items-center gap-4 px-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${
                  showForm 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_20px_50px_rgba(59,130,246,0.3)]'
                }`}
              >
                {showForm ? <X size={20} /> : <><Plus size={20} strokeWidth={4} /> Inject New Protocol</>}
              </button>
            )}
          </div>

          {/* 📝 Task Injection Form (Teacher Node) */}
          {showForm && (
            <form onSubmit={handleCreate} className="glass p-12 rounded-[4rem] border-2 border-blue-500/10 space-y-10 animate-in slide-in-from-top-10 duration-700 bg-slate-950/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Task Descriptor</p>
                    <input type="text" placeholder="Protocol Title" className="w-full bg-slate-950 border-2 border-slate-900 p-6 rounded-[2rem] text-white font-bold outline-none focus:border-blue-500/50 transition-all" onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Node Deadline</p>
                    <input type="date" className="w-full bg-slate-950 border-2 border-slate-900 p-6 rounded-[2rem] text-white font-bold outline-none focus:border-blue-500/50 transition-all" onChange={e => setFormData({...formData, deadline: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Instructions</p>
                  <textarea placeholder="Specify operational parameters..." className="w-full bg-slate-950 border-2 border-slate-900 p-8 rounded-[2.5rem] text-white font-bold h-48 outline-none focus:border-blue-500/50 transition-all resize-none" onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="flex items-center gap-6">
                 <input type="file" id="pdf-upload" className="hidden" accept=".pdf,.zip,.rar" onChange={(e) => setFile(e.target.files[0])} />
                 <label htmlFor="pdf-upload" className="flex-1 flex items-center justify-center gap-5 bg-slate-950/40 px-10 py-8 rounded-[2.5rem] border-2 border-dashed border-slate-800 hover:border-blue-500/40 cursor-pointer text-slate-600 hover:text-blue-400 transition-all font-black text-[10px] uppercase tracking-widest">
                   <FileUp size={28}/> {file ? file.name : "Inject Task Resources (PDF/ZIP)"}
                 </label>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 py-8 rounded-[3rem] font-black text-xs uppercase tracking-[0.5em] text-white shadow-lg hover:shadow-blue-600/20 active:scale-95 transition-all">
                {loading ? "Synchronizing..." : "Initiate Broadcast"}
              </button>
            </form>
          )}

          {/* 📚 Assignment Cluster List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {fetchLoading ? (
              <div className="col-span-full py-40 flex flex-col items-center gap-6">
                <Loader />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Syncing with Node Clusters...</p>
              </div>
            ) : assignments.length > 0 ? (
              assignments.map((asm) => (
                <AssignmentCard key={asm._id} assignment={asm} user={user} onAction={handleAction} />
              ))
            ) : (
              <div className="col-span-full py-40 border-4 border-dashed border-slate-900/50 rounded-[5rem] flex flex-col items-center justify-center opacity-30 gap-8">
                <ShieldAlert size={60} className="text-slate-800" />
                <span className="text-slate-700 font-black uppercase text-2xl tracking-[0.5em] text-center">No Protocols Active</span>
              </div>
            )}
          </div>
        </>
      ) : viewMode === "audit" ? (
        /* 📊 Audit Telemetry Interface (Teacher Node) */
        <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
          <button onClick={() => setViewMode("list")} className="flex items-center gap-4 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Task Nodes
          </button>
          
          <div className="glass p-12 rounded-[4rem] border-2 border-blue-500/10 bg-slate-950/20">
            <div className="mb-12">
                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">{selectedAsm?.title}</h2>
                <p className="text-blue-500 font-black text-[11px] uppercase tracking-[0.4em] flex items-center gap-3">
                  <Zap size={14} fill="currentColor" /> Neural Transmission Count: {submissions.length}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {submissions.length > 0 ? submissions.map((sub, i) => (
                <div key={i} className="bg-slate-950/60 p-8 rounded-[2.5rem] border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row justify-between items-center transition-all">
                  <div className="flex items-center gap-8 mb-6 md:mb-0">
                    <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 font-black text-2xl shadow-inner">
                      {sub.student?.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="text-xl font-black text-white uppercase italic leading-none mb-2">{sub.student?.name}</p>
                      <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Signal: Verified</p>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={`${import.meta.env.VITE_BACKEND_API || "http://localhost:5000"}${sub.fileUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-lg active:scale-95"
                  >
                    Audit Node Resource
                  </a>
                </div>
              )) : (
                <div className="py-32 text-center flex flex-col items-center gap-6 opacity-40">
                    <ClipboardList size={40} className="text-slate-800" />
                    <p className="text-slate-700 font-black uppercase tracking-[0.3em] text-xs">No Signal Detected from Student Clusters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
          /* 🚀 Submission Protocol Interface (Student Node - Placeholder) */
          <div className="p-12 glass rounded-[4rem] border-2 border-emerald-500/10 text-center animate-fade-in">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Submission Handshake</h2>
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mb-10">Upload Protocol Node for: {selectedAsm?.title}</p>
              <button onClick={() => setViewMode("list")} className="bg-slate-900 text-slate-400 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort Handshake</button>
          </div>
      )}
    </div>
  );
};

export default AssignmentTab;