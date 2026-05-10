/**
 * ============================================================
 * 📋 TITAN PROTOCOL AUDIT TERMINAL (v4.4 - Liquid Layout)
 * Upgraded: Solved Image Overlap Bug, Fluid Action Stack,
 * and Truncation Safeties for long student names.
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Loader from "../components/Loader";
import { 
  ArrowLeft, User, Clock, FileDown, ShieldCheck, 
  Calendar, Zap, Activity, Save, CheckCircle2 
} from "lucide-react";

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState(null);
  const [tempMarks, setTempMarks] = useState({});

  const formatDateTime = (dateString) => {
    if (!dateString) return { day: "NODE_ACTIVE", time: "SYNCING..." };
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/assignments/${assignmentId}/submissions`);
      const data = res.data?.data || res.data?.submissions || [];
      setSubmissions(data);
      
      const marksMap = {};
      data.forEach(sub => {
        marksMap[sub.student?._id] = sub.marks || sub.grade || "";
      });
      setTempMarks(marksMap);
    } catch (err) {
      console.error("❌ AUDIT_SYNC_ERROR: Telemetry node unreachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) fetchAuditData();
  }, [assignmentId]);

  const handleUpdateGrade = async (studentId) => {
    const marks = tempMarks[studentId];
    if (marks === undefined || marks === "" || isNaN(marks)) return;

    try {
      setGradingId(studentId);
      await API.post(`/assignments/give-marks`, { 
        assignmentId, 
        studentId, 
        marks: Number(marks), 
        feedback: "Neural Grade Synchronized" 
      });

      setSubmissions(prev => prev.map(sub => 
        sub.student?._id === studentId ? { ...sub, marks: Number(marks) } : sub
      ));
    } catch (err) {
      console.error("❌ SYNC_FAILED: Protocol collision.");
    } finally {
      setGradingId(null);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] gap-6">
      <Loader />
      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse px-4 text-center">Compiling Node Telemetry...</p>
    </div>
  );

  return (
    // 🔥 FIX: Scaled down global paddings for mobile
    <div className="p-4 sm:p-6 md:p-14 space-y-6 md:space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto min-h-screen bg-[#020617]/20 backdrop-blur-3xl font-sans pb-32">
      
      {/* 🏛️ AUDIT COMMAND HEADER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900/40 p-5 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border-2 border-slate-900 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-10 w-full md:w-auto">
          <button onClick={() => navigate(-1)} className="w-auto flex justify-center sm:block p-3 sm:p-4 md:p-5 bg-slate-950 rounded-[1rem] sm:rounded-2xl text-slate-500 hover:text-white transition-all border-2 border-slate-800 shadow-inner active:scale-90 group shrink-0">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
          </button>
          <div className="space-y-1.5 sm:space-y-3 text-left w-full min-w-0">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none truncate">Protocol Audit</h2>
            <div className="flex items-center justify-start gap-2 sm:gap-3">
              <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse shrink-0" />
              <p className="text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest sm:tracking-[0.4em] italic truncate">Verified Nodes: {submissions.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* 📑 SUBMISSION STREAM */}
      <main className="grid grid-cols-1 gap-6 md:gap-8">
        {submissions.length > 0 ? (
          submissions.map((sub, idx) => {
            const { day, time } = formatDateTime(sub.submittedAt);
            const studentId = sub.student?._id;
            const isProcessing = gradingId === studentId;
            const studentName = sub.student?.name || "AGENT_UNKNOWN";
            
            return (
              // 🔥 FIX: Card changes from Column (Mobile) to Row (Desktop) smoothly
              <div key={idx} className="group bg-slate-950/40 backdrop-blur-xl p-5 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] border-2 border-slate-900 hover:border-blue-500/30 transition-all duration-700 shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 md:gap-10 relative overflow-hidden">
                
                {/* User Identity Segment */}
                <div className="flex flex-row items-center gap-4 sm:gap-6 md:gap-8 relative z-10 w-full xl:w-auto min-w-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 shrink-0 bg-slate-900 rounded-[1.2rem] sm:rounded-[2rem] flex items-center justify-center font-black text-xl sm:text-3xl md:text-5xl text-blue-500 border border-slate-800 shadow-inner uppercase italic">
                    {studentName[0]}
                  </div>

                  <div className="space-y-2 md:space-y-4 w-full min-w-0">
                    {/* Scales cleanly and handles extremely long names without breaking out */}
                    <h4 className="text-xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none truncate pr-2" title={studentName}>
                       {studentName}
                    </h4>
                    {/* Date/Time Tags Wrap neatly */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest sm:tracking-[0.2em] italic">
                      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-2xl border border-white/5"><Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 shrink-0"/> <span className="truncate">{day}</span></div>
                      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-2xl border border-white/5"><Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0"/> <span className="truncate">{time}</span></div>
                    </div>
                  </div>
                </div>

                {/* 🚀 UPGRADED EVALUATION INTERFACE: Mobile Adaptive Stack */}
                {/* 🔥 FIX: Changed from flex-row to flex-col on very small screens, grid on medium, flex-row on desktop */}
                <div className="flex flex-col sm:flex-row xl:flex-row items-center gap-3 sm:gap-4 md:gap-6 w-full xl:w-auto relative z-10 pt-4 sm:pt-6 xl:pt-0 border-t border-slate-800 xl:border-0">
                  
                  {/* Grade Input Node */}
                  {/* 🔥 FIX: Exact constraints applied so it doesn't inflate on small devices */}
                  <div className={`flex items-center justify-between w-full sm:w-auto bg-slate-950 rounded-xl sm:rounded-[1.8rem] border-2 p-2 sm:p-3 transition-all ${isProcessing ? 'border-yellow-500 animate-pulse' : 'border-slate-800'}`}>
                    <Zap className={`ml-2 shrink-0 w-4 h-4 sm:w-5 sm:h-5 ${isProcessing ? "text-yellow-500 animate-spin" : "text-yellow-500"}`} />
                    <input 
                      type="number" 
                      value={tempMarks[studentId] || ""}
                      onChange={(e) => setTempMarks({...tempMarks, [studentId]: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateGrade(studentId)}
                      placeholder="00"
                      className="bg-transparent text-white font-black text-center w-full sm:w-20 outline-none text-lg sm:text-xl md:text-2xl italic px-2 min-w-0"
                    />
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-700 mr-2 sm:mr-4 tracking-tighter shrink-0">/ 100</span>
                  </div>

                  {/* Actions Grid for Mobile: Split Buttons evenly */}
                  <div className="grid grid-cols-2 sm:flex items-center gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto">
                    {/* 🔥 BIG SAVE HANDSHAKE BUTTON */}
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleUpdateGrade(studentId)}
                      className={`col-span-1 h-12 sm:h-[60px] md:h-[72px] px-2 sm:px-6 md:px-8 rounded-xl sm:rounded-[2rem] font-black text-[9px] sm:text-[10px] uppercase tracking-widest sm:tracking-[0.4em] transition-all flex items-center justify-center gap-1.5 sm:gap-3 italic border-2 w-full sm:w-auto ${
                        isProcessing 
                        ? 'bg-slate-900 text-slate-700 border-slate-800' 
                        : 'bg-blue-600/10 text-blue-500 border-blue-500/20 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 shadow-lg shadow-blue-600/10'
                      }`}
                    >
                      {isProcessing ? "Syncing" : <><Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0" /> <span className="truncate">Save</span></>}
                    </button>

                    {/* 🔥 FETCH BUTTON */}
                    <button 
                      onClick={() => window.open(`${import.meta.env.VITE_BACKEND_API || 'http://localhost:5000'}${sub.fileUrl}`, '_blank')}
                      className="col-span-1 h-12 sm:h-[60px] md:h-[72px] px-2 sm:px-6 md:px-10 bg-white text-black rounded-xl sm:rounded-[2rem] font-black text-[9px] sm:text-[10px] uppercase tracking-widest sm:tracking-[0.4em] hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-1.5 sm:gap-3 italic w-full sm:w-auto"
                    >
                      <span className="truncate">Fetch</span> <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 md:py-40 px-4 border-4 border-dashed border-slate-900 rounded-[3rem] md:rounded-[5rem] text-center opacity-30 flex flex-col items-center gap-6 md:gap-10">
             <User strokeWidth={1} className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] text-slate-800"/>
             <p className="text-lg sm:text-xl md:text-3xl font-black uppercase tracking-widest md:tracking-[0.5em] italic text-slate-700 px-4">Audit Signal Clear</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignmentSubmissions;