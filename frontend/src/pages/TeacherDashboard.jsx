/**
 * ============================================================
 * 🏛️ TITAN INSTRUCTOR COMMAND CENTER (v5.4 - Clean Header Patch)
 * Fix: Removed redundant "Task Hub" button from header.
 * Upgrade: Added "Terminal Override" (Delete Class) Button.
 * Auto-Fit Grid implemented for responsive card wrapping.
 * ============================================================
 */

import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Loader from "../components/Loader";
import CreateClassModal from "../components/CreateClassModal";
import { AuthContext } from "../context/AuthContext";
import { 
  Plus, Users, Layout, ShieldCheck, 
  RefreshCw, ChevronRight, Zap, Radio, Copy, Check,
  Activity, Video, Terminal, Heart, Globe, ClipboardList, Trash2
} from "lucide-react";

function TeacherDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const classRes = await API.get("/classes/my-classes");
      setClasses(classRes.data?.data || classRes.data?.classes || []);
    } catch (err) {
      console.error("❌ NEURAL_SYNC_FAILURE: Node cluster unreachable.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => { 
    if (user && !authLoading) loadData(); 
  }, [user, authLoading, loadData]);

  const handleCopyCode = (e, code) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 💥 NEW: TERMINATION PROTOCOL (Delete Class)
  const handleDeleteClass = async (classId) => {
    const confirmDelete = window.confirm(
      "🚨 TERMINAL OVERRIDE INITIATED\n\nAre you sure you want to permanently obliterate this Class Node? Related assignments will remain archived. This action cannot be reversed."
    );
    
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await API.delete(`/classes/${classId}`);
      if (res.data.success) {
        alert("✅ " + res.data.message);
        loadData(); // Sync the UI after deletion
      }
    } catch (err) {
      alert("🛑 TERMINATION_FAILED: " + (err.response?.data?.message || "Signal lost."));
      setLoading(false); 
    }
  };

  if (authLoading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
      <Loader />
      <p className="text-[10px] md:text-[12px] font-black text-blue-500 uppercase tracking-widest md:tracking-[0.6em] animate-pulse italic text-center px-4">Authenticating Command Node...</p>
    </div>
  );
  
  if (!user) return null;

  const totalStudents = classes.reduce((acc, curr) => acc + (curr.students?.length || 0), 0);

  return (
    <div className="animate-in fade-in duration-1000 p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-10 md:space-y-12 selection:bg-blue-600/30 max-w-[1600px] mx-auto min-h-screen pb-40 md:pb-32">
      
      {/* 🏛️ EXECUTIVE COMMAND HEADER */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 sm:gap-10 bg-slate-950/40 backdrop-blur-3xl p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] border-2 border-slate-900 relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 blur-[80px] md:blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-all duration-1000"></div>
        
        <div className="space-y-3 sm:space-y-5 relative z-10 w-full xl:w-auto flex-1 min-w-0 text-left">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-blue-600 w-2 md:w-2.5 h-10 sm:h-16 md:h-24 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.4)] shrink-0"></div>
            <div className="min-w-0 w-full">
              <h1 className="text-[clamp(2.5rem,5vw,6rem)] font-black tracking-tighter text-white uppercase italic leading-none break-words pr-2">
                Command Center
              </h1>
              <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                 <Terminal size={14} className="text-blue-500 animate-pulse shrink-0 md:w-[18px] md:h-[18px]"/>
                 <p className="text-slate-500 font-black text-[9px] sm:text-xs md:text-sm uppercase tracking-widest sm:tracking-[0.6em] italic leading-none break-words">
                   Admin: <span className="text-blue-400 ml-1">{user.name?.toUpperCase()}</span>
                 </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Header Buttons - Task Hub Removed! */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full xl:w-auto mt-4 xl:mt-0 z-10">
           <button onClick={loadData} disabled={loading} className="flex-1 sm:flex-none flex justify-center p-4 sm:p-5 md:p-6 bg-slate-900/50 border-2 border-slate-800 rounded-xl sm:rounded-2xl md:rounded-3xl text-slate-500 hover:text-blue-500 hover:border-blue-500/20 transition-all shadow-xl active:scale-90 min-w-[60px]">
             <RefreshCw size={20} className={`md:w-6 md:h-6 ${loading ? "animate-spin text-blue-500" : ""}`} />
           </button>

           <button 
             onClick={() => setIsModalOpen(true)} 
             className="w-full sm:w-auto flex-[3] sm:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl md:rounded-3xl font-black text-[10px] md:text-sm uppercase tracking-widest sm:tracking-[0.4em] transition-all active:scale-95 border-b-[4px] sm:border-b-[6px] md:border-b-[10px] border-blue-900 shadow-[0_15px_30px_rgba(37,99,235,0.3)] italic text-center min-w-[150px]"
           >
             + Initialize
           </button>
        </div>
      </header>

      {/* 📊 GLOBAL ANALYTICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 sm:gap-6 md:gap-8">
        <StatCard title="Active Clusters" value={classes.length} icon={<Layout className="w-5 h-5 md:w-7 md:h-7"/>} />
        <StatCard title="Bio Residents" value={totalStudents} icon={<Users className="w-5 h-5 md:w-7 md:h-7"/>} />
        <StatCard title="Guardian Sync" value="ONLINE" icon={<Heart className="w-5 h-5 md:w-7 md:h-7 animate-pulse" />} color="text-rose-500" subText="Neural Bridge" />
        <StatCard title="Signal Status" value="99.9%" icon={<Zap className="w-5 h-5 md:w-7 md:h-7"/>} color="text-emerald-400" />
      </div>

      {/* 🏫 CLASS CLUSTER STREAM */}
      <div className="space-y-8 sm:space-y-10">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 sm:pb-6">
            <div className="flex items-center gap-3 sm:gap-6">
              <Radio className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500 animate-pulse shrink-0" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Active Clusters</h2>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 shrink-0 ml-4">
               <span className="text-xs font-black text-blue-500 uppercase tracking-widest italic leading-none">Grid_Status</span>
               <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] leading-none">All Nodes Operational</span>
            </div>
        </div>

        {loading ? (
          <div className="py-20 sm:py-40 flex flex-col items-center gap-6 sm:gap-8">
             <Loader />
             <p className="text-[10px] sm:text-[12px] font-black uppercase text-blue-500 tracking-widest sm:tracking-[0.8em] animate-pulse italic text-center px-4">Synchronizing Neural Hub...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 sm:gap-10">
            {classes.length > 0 ? classes.map((cls) => (
              <div key={cls._id} className="group bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-900 hover:border-blue-500/40 transition-all duration-700 relative overflow-hidden shadow-2xl hover:-translate-y-2 flex flex-col h-full">
                
                {/* 💥 NEW: DELETE BUTTON OVERLAY */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls._id); }}
                  className="absolute top-4 right-4 z-20 p-3 sm:p-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 hover:border-red-600 rounded-xl sm:rounded-2xl backdrop-blur-md transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-90"
                  title="Terminate Class Node"
                >
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </button>

                <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-blue-600/5 blur-[80px] sm:blur-[100px] -z-10 group-hover:bg-blue-600/10 transition-all"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8 gap-6 sm:gap-0 flex-1 relative z-10">
                  <div className="space-y-4 w-full sm:w-[75%] order-2 sm:order-1">
                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase italic break-words tracking-tight leading-tight pr-12">
                      {cls.name}
                    </h3>
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <p className="text-blue-500 font-black text-[10px] sm:text-xs uppercase tracking-widest sm:tracking-[0.4em] italic truncate">{cls.subject || "GENERAL_NODE"}</p>
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-slate-800 rounded-full shrink-0 hidden sm:block"></div>
                      <p className="text-slate-500 font-black text-[10px] sm:text-xs uppercase italic">{cls.students?.length || 0} Agents Linked</p>
                    </div>
                    
                    <button 
                      onClick={(e) => handleCopyCode(e, cls.classCode)} 
                      className="mt-4 sm:mt-6 flex items-center justify-between sm:justify-start gap-4 bg-slate-900/80 px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl border border-slate-800 text-[10px] sm:text-xs font-mono text-blue-400 hover:border-blue-500/30 transition-all group/code shadow-inner w-full sm:w-auto"
                    >
                      <div className="flex items-center gap-2 sm:gap-4 truncate">
                        <span className="text-slate-600 font-black uppercase text-[9px] sm:text-[10px]">Access_ID:</span> 
                        <span className="truncate">{cls.classCode}</span>
                      </div>
                      {copiedId === cls.classCode ? <Check size={14} className="text-emerald-500 shrink-0" /> : <Copy size={14} className="group-hover/code:text-white shrink-0" />}
                    </button>
                  </div>
                  <div className="p-4 sm:p-5 bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-2xl group-hover:rotate-12 order-1 sm:order-2 shrink-0 self-start sm:self-auto">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 mt-4 sm:mt-8 shrink-0 relative z-10">
                  <button 
                    onClick={() => navigate(`/teacher/class/${cls._id}`)} 
                    className="flex-1 bg-white text-black py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest sm:tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all italic shadow-2xl active:scale-95 border-b-[3px] border-slate-300 hover:border-blue-800 flex justify-center items-center min-w-[100px]"
                  >
                    Enter Node
                  </button>

                  <button 
                    onClick={() => navigate(`/video-session/${cls._id}`)} 
                    className="w-full sm:w-auto px-6 sm:px-10 bg-rose-600 text-white py-4 rounded-xl sm:rounded-2xl hover:bg-rose-500 transition-all border-b-[3px] border-rose-900 flex items-center justify-center shadow-2xl active:scale-95 group/video shrink-0"
                  >
                    <Video className="w-5 h-5 sm:w-6 sm:h-6 group-hover/video:animate-bounce" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 sm:py-40 px-4 text-center border-4 border-dashed border-slate-900 rounded-[3rem] sm:rounded-[5rem] group hover:border-blue-500/10 transition-all duration-1000 flex flex-col items-center justify-center gap-8 sm:gap-10">
                  <div className="relative">
                    <Globe className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] text-slate-900 group-hover:rotate-180 transition-transform duration-[4000ms]" strokeWidth={0.5} />
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 absolute top-0 right-0 text-blue-500/20 animate-pulse" />
                  </div>
                  <div className="space-y-3 px-4">
                    <p className="text-slate-700 font-black uppercase tracking-[0.5em] sm:tracking-[1em] text-xl sm:text-2xl italic leading-none">Grid_Empty</p>
                    <p className="text-slate-800 font-bold uppercase text-[10px] sm:text-xs tracking-widest sm:tracking-[0.4em]">No node clusters detected. Initialize system to begin.</p>
                  </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onClassCreated={loadData} />
      
      {/* 📡 SYSTEM FOOTER STATUS */}
      <footer className="fixed bottom-4 sm:bottom-6 left-0 w-full flex justify-center pointer-events-none z-50 px-4">
        <div className="bg-slate-950/90 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/5 flex flex-wrap items-center justify-center gap-4 sm:gap-8 shadow-[0_20px_40px_rgba(0,0,0,0.8)] w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Security: ACTIVE</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 bg-slate-800 rounded-full shrink-0"></div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Sync: v5.4_STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ title, value, color = "text-blue-500", icon, subText }) {
  return (
    <div className="bg-slate-950/40 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-900 hover:border-blue-500/20 transition-all group relative overflow-hidden shadow-2xl flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div className="p-3 sm:p-4 bg-slate-900 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-inner shrink-0 self-start">
          {icon}
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto min-w-0">
          <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-widest sm:tracking-[0.3em] italic group-hover:text-slate-400 transition-colors leading-tight break-words pr-1">
            {title}
          </p>
          {subText && (
            <p className="text-[7px] sm:text-[8px] font-black text-blue-500/40 uppercase tracking-widest mt-1 italic hidden sm:block break-words">
              {subText}
            </p>
          )}
        </div>
      </div>
      <p className={`text-[clamp(2.5rem,5vw,4.5rem)] font-black ${color} tracking-tighter leading-none italic break-words mt-auto group-hover:translate-x-2 transition-transform duration-700`}>
        {value}
      </p>
    </div>
  );
}

export default TeacherDashboard;