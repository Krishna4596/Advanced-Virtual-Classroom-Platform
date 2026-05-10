/**
 * ============================================================
 * 📋 TITAN GLOBAL ASSIGNMENT HUB (v4.4 - Task Termination)
 * Ref: Responsive Grid Scaling, Fluid Modal Containers.
 * Added: Teacher-Exclusive "Thanos Snap" (Delete) Protocol.
 * ============================================================
 */

import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  ClipboardList, CheckCircle2, AlertCircle, 
  Layers, Zap, X, Upload, Send, Activity, Trash2
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import Loader from "../components/Loader";
import AssignmentCard from "../components/AssignmentCard";

function GlobalAssignments() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState(null); 
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const isTeacher = user?.role === 'teacher';

  // 🛰️ NEURAL SYNC: Fetching global academic data nodes
  const fetchGlobalData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/assignments/my-assignments");
      const data = res.data?.assignments || res.data?.data || [];
      setAssignments(data);
    } catch (err) {
      console.error("❌ NEURAL_LINK_FAILURE: Data node sync failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  // 📤 TRANSMISSION PROTOCOL: Pushing documentation
  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!file) return alert("Security Protocol: Select a valid dossier (PDF/ZIP).");
    
    setUploading(true);
    const data = new FormData();
    data.append("assignmentId", submitModal._id);
    data.append("file", file);

    try {
      await API.post("/assignments/submit", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ TRANSMISSION_VERIFIED: Neural link established successfully.");
      setSubmitModal(null);
      setFile(null);
      fetchGlobalData(); 
    } catch (err) {
      alert("🛑 HANDSHAKE_FAILED: Protocol interference during upload.");
    } finally {
      setUploading(false);
    }
  };

  // 💥 TERMINATION PROTOCOL: Deleting an Assignment
  const handleDeleteAssignment = async (assignmentId) => {
    const confirmDelete = window.confirm(
      "🚨 TERMINAL OVERRIDE INITIATED\n\nAre you sure you want to permanently obliterate this task and all student submissions? This action cannot be reversed."
    );
    
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await API.delete(`/assignments/${assignmentId}`);
      if (res.data.success) {
        fetchGlobalData(); // Sync the UI after deletion
      }
    } catch (err) {
      alert("🛑 TERMINATION_FAILED: " + (err.response?.data?.message || "Signal lost."));
      setLoading(false); // Only set false here, if success, fetchGlobalData will handle it
    }
  };

  // 📊 TELEMETRY CALCULATIONS
  const totalSubmissions = assignments.reduce((acc, curr) => acc + (curr.submissions?.length || 0), 0);
  
  const pendingCount = assignments.filter(asm => {
    const isSubmitted = asm.submissions?.some(s => 
      (s.student === user?._id || s.student?._id === user?._id)
    );
    return !isSubmitted;
  }).length;

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center bg-[#020617] gap-6">
      <Loader />
      <p className="text-[10px] sm:text-xs font-black text-blue-500 uppercase tracking-widest sm:tracking-[0.6em] animate-pulse px-4 text-center">Syncing Academic Clusters...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 p-4 sm:p-8 md:p-14 space-y-8 sm:space-y-12 md:space-y-20 selection:bg-blue-600/30 max-w-[1700px] mx-auto min-h-screen pb-32">
      
      {/* 🏛️ EXECUTIVE HUB HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-8 bg-slate-950/40 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-slate-900 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-blue-600/5 blur-[80px] sm:blur-[100px] -z-10"></div>
        <div className="space-y-3 sm:space-y-4 w-full">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 shrink-0 ${isTeacher ? 'bg-purple-600/10 text-purple-500' : 'bg-blue-600/10 text-blue-500'} rounded-2xl sm:rounded-[1.8rem] flex items-center justify-center shadow-2xl border border-white/5`}>
              <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none truncate pr-2">
              {isTeacher ? "Grading Hub" : "Task Portal"}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2">
             <Activity size={14} className="text-blue-500 animate-pulse shrink-0" />
             <p className="text-slate-500 font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest sm:tracking-[0.5em] italic truncate">
               {isTeacher ? "Protocol_Monitor: ACTIVE" : "Node_Cluster: SYNCED"}
             </p>
          </div>
        </div>
      </header>

      {/* 📊 NODE TELEMETRY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        <TaskStatCard title={isTeacher ? "Assigned_Nodes" : "Linked_Tasks"} value={assignments.length} icon={<Layers className={`w-6 h-6 sm:w-7 sm:h-7 ${isTeacher ? "text-purple-500" : "text-blue-500"}`}/>} />
        <TaskStatCard title={isTeacher ? "Global_Dossiers" : "Protocols_Ready"} value={isTeacher ? totalSubmissions : (assignments.length - pendingCount)} icon={<CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500"/>} />
        <TaskStatCard title="Sync_Stability" value={assignments.length > 0 ? "STABLE" : "IDLE"} icon={<AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500"/>} />
      </div>

      {/* 📡 LIVE DATA STREAM */}
      <div className="space-y-6 sm:space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-900 pb-4 sm:pb-8 gap-2 sm:gap-0">
           <div className="flex items-center gap-3 sm:gap-5">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 animate-pulse shrink-0"/>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Transmission Feed</h2>
           </div>
           <span className="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-widest italic bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800 self-start sm:self-auto">Real_Time_Sync_v4.4</span>
        </div>

        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            {assignments.map((asm) => (
              // 🔥 NEW: Wrapper to hold the card and the absolute delete button
              <div key={asm._id} className="relative group w-full">
                <AssignmentCard 
                  assignment={asm} 
                  user={user} 
                  onAction={(a) => isTeacher 
                    ? navigate(`/teacher/assignment/${a._id}/submissions`) 
                    : setSubmitModal(a)
                  } 
                />
                
                {/* 💥 DELETE BUTTON OVERLAY (Teacher Only) */}
                {isTeacher && (
                  <button
                    onClick={() => handleDeleteAssignment(asm._id)}
                    className="absolute top-4 right-4 z-10 p-3 sm:p-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 hover:border-red-600 rounded-xl sm:rounded-2xl backdrop-blur-md transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-90"
                    title="Terminate Task"
                  >
                    <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 sm:py-40 px-4 border-4 border-dashed border-slate-900 rounded-[3rem] sm:rounded-[5rem] flex flex-col items-center justify-center opacity-30 gap-6 sm:gap-10 text-center">
             <ClipboardList className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] text-slate-800" strokeWidth={1} />
             <div className="space-y-3 sm:space-y-4">
                <p className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-widest sm:tracking-[0.5em] text-slate-700 italic leading-tight">No Node Signals Detected</p>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-800">Buffer clear: Awaiting academic protocol initiation.</p>
             </div>
          </div>
        )}
      </div>

      {/* 📤 SUBMISSION HANDSHAKE MODAL */}
      {submitModal && !isTeacher && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500 overflow-y-auto">
          <form onSubmit={handleSubmission} className="bg-[#020617] p-6 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] border-2 border-blue-500/20 max-w-2xl w-full space-y-8 sm:space-y-12 shadow-[0_0_100px_rgba(37,99,235,0.15)] relative overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-blue-600/5 blur-[80px] sm:blur-[100px] -z-10"></div>
            
            <div className="flex justify-between items-start sm:items-center border-b-2 border-slate-900 pb-6 sm:pb-10 gap-4">
              <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-blue-500 uppercase italic tracking-tighter leading-none truncate">Broadcasting</h3>
                <p className="text-[9px] sm:text-[10px] text-slate-600 font-black uppercase tracking-widest sm:tracking-[0.4em] truncate">Target_Instance: {submitModal.title}</p>
              </div>
              <button type="button" onClick={() => {setSubmitModal(null); setFile(null);}} className="p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl text-slate-600 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-inner active:scale-90 shrink-0">
                <X className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
            </div>
            
            <label className="flex flex-col items-center justify-center border-4 border-dashed border-slate-900 p-8 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] cursor-pointer hover:border-blue-500/40 transition-all group bg-slate-950/20 shadow-inner text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-600/10 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-4 sm:mb-8 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-widest sm:tracking-[0.3em] italic group-hover:text-slate-400 transition-colors px-2 break-words max-w-full">
                {file ? file.name : "Select Neural Dossier (PDF/ZIP)"}
              </span>
              <input type="file" className="hidden" accept=".pdf,.zip,.rar" onChange={(e) => setFile(e.target.files[0])} />
            </label>

            <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-500 py-5 sm:py-6 md:py-10 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] font-black text-white uppercase tracking-widest sm:tracking-[0.6em] text-[9px] sm:text-[10px] md:text-[11px] transition-all shadow-3xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-6 italic">
              {uploading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Transmitting...
                </>
              ) : <><Send className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3}/> Push Signal Node</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function TaskStatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] border-2 border-slate-900 hover:border-blue-500/20 transition-all duration-700 group shadow-3xl flex flex-col justify-between">
      <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-12">
        <div className="p-4 sm:p-5 md:p-6 bg-slate-900 rounded-2xl sm:rounded-[1.8rem] border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500 shrink-0 self-start">{icon}</div>
        <div className="relative shrink-0 mt-2 sm:mt-0">
           <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0 opacity-20"></div>
           <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full relative"></div>
        </div>
      </div>
      <div className="space-y-1 sm:space-y-2 mt-auto">
        <h4 className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-widest sm:tracking-[0.5em] italic truncate pr-2">{title}</h4>
        <p className="text-4xl sm:text-5xl md:text-[clamp(3rem,5vw,6rem)] font-black text-white tracking-tighter italic leading-none group-hover:text-blue-500 transition-colors duration-500 truncate">{value}</p>
      </div>
    </div>
  );
}

export default GlobalAssignments;