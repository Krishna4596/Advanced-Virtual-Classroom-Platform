/**
 * ============================================================
 * 📝 TITAN STUDENT TASK HUB (v4.2 - Production Stabilized)
 * Fixed: Modal Integration, State Management, and Submission Handshake.
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import API from "../api/api";
import Loader from "./Loader";
import AssignmentCard from "./AssignmentCard";
import SubmissionModal from "./SubmissionModal"; // 🔥 Added Import
import { Zap, ShieldAlert, Activity } from "lucide-react";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null); // 🔥 To track current task
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/assignments/my-assignments");
      setAssignments(res.data?.assignments || res.data?.data || []);
    } catch (err) { 
      console.error("❌ NEURAL_SYNC_FAILURE: Task link interrupted."); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🛰️ OPEN SUBMISSION PROTOCOL
  const handleOpenSubmission = (asm) => {
    setSelectedTask(asm);
    setIsModalOpen(true);
  };

  // 📤 FINAL UPLINK HANDSHAKE
  const handleFinalSubmit = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // 📄 Attached documentation
    formData.append("assignmentId", selectedTask._id); // 🆔 Target node ID

    try {
      const res = await API.post("/assignments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" } // 🔥 Critical for file uploads
      });

      if (res.data.success) {
        alert("✅ VERIFIED: Submission Successful.");
        fetchTasks(); // Refresh to update UI
      }
    } catch (err) {
      console.error("❌ UPLOAD_FAILURE:", err.response?.data?.message);
      alert(err.response?.data?.message || "Uplink Failed: Check connection.");
    }
  };

  if (loading) return (
    <div className="py-32 flex flex-col items-center gap-6">
       <Loader />
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing Task Telemetry...</p>
    </div>
  );

  return (
    <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700 min-h-screen font-sans">
      
      {/* 🏛️ HEADER INTERFACE */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-950/40 p-10 rounded-[4rem] border-2 border-slate-900 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -z-10"></div>
        <div className="p-6 bg-yellow-500/10 text-yellow-500 rounded-[2rem] border border-yellow-500/20">
          <Zap size={40} className="animate-pulse" />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Academic Tasks</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Pending_Submissions: {assignments.length} Active</p>
        </div>
      </div>
      
      {/* 🏁 GRID CONTROL PROTOCOL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {assignments.length > 0 ? (
          assignments.map(asm => (
            <AssignmentCard 
              key={asm._id} 
              assignment={asm} 
              user={{role: 'student'}} 
              onAction={() => handleOpenSubmission(asm)} // 🔥 Linked to modal
            />
          ))
        ) : (
          <div className="col-span-full py-40 border-4 border-dashed border-slate-900 rounded-[5rem] flex flex-col items-center justify-center opacity-30 gap-8">
            <ShieldAlert size={80} className="text-slate-800" />
            <p className="text-2xl font-black uppercase tracking-[0.5em] text-slate-700 italic text-center">No Tasks Detected</p>
          </div>
        )}
      </div>

      {/* 📤 SUBMISSION MODAL NODE */}
      <SubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        assignmentTitle={selectedTask?.title}
        onSubmit={handleFinalSubmit} // 🔥 Triggers the uplink
      />

      <div className="mt-20 flex justify-between items-center opacity-30">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="px-10 text-[9px] font-black text-slate-700 uppercase tracking-[0.8em]">TITAN_TASK_CORE_V4.2</span>
          <div className="h-px flex-1 bg-slate-800"></div>
      </div>
    </div>
  );
};

export default StudentAssignments;