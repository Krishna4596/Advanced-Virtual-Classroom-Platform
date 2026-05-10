/**
 * ============================================================
 * 🏛️ TITAN GUARDIAN PORTAL (v5.4 - Clean Minimal Build)
 * Fix: Removed unused 'Total Attendance' and 'Task Execution' 
 * blocks. UI adapted to look perfectly balanced with 
 * remaining elements.
 * ============================================================
 */

import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import AddChildModal from "../components/AddChildModal"; 
import { useNavigate } from "react-router-dom"; 
import { getSocket, connectSocket } from "../socket/socket"; 
import { 
  User, Activity, ShieldCheck, 
  Zap, TrendingUp, UserPlus, Video, Signal, LayoutGrid, ArrowRight
} from "lucide-react";

function ParentDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ptmSignal, setPtmSignal] = useState(null); 

  const fetchParentData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/parent/dashboard");
      setData(res.data?.data || res.data);
    } catch (err) {
      setError("❌ TELEMETRY_SYNC_FAILURE: Unable to reach student nodes.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    if (user) {
      fetchParentData();
      connectSocket();
      const socket = getSocket();

      if (socket) {
        socket.emit("join_parent_node", user._id || user.id);
        socket.on("ptm_invitation", (data) => {
          setPtmSignal({
            teacherName: data.teacherName,
            meetingId: data.classId,
            topic: data.topic
          });
        });
        socket.on("ptm_terminated", () => setPtmSignal(null));
      }
    }
    return () => {
      const socket = getSocket();
      if (socket) socket.off("ptm_invitation");
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="animate-in fade-in duration-1000 p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-10 md:space-y-12 max-w-[1900px] mx-auto min-h-screen selection:bg-yellow-500/30 pb-24 md:pb-32">
      
      {/* 🚨 ALERT: EMERGENCY HANDSHAKE */}
      {ptmSignal && (
        <div className="bg-red-600/10 border-2 sm:border-4 border-red-500 p-5 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-3xl relative overflow-hidden text-center lg:text-left">
          <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-red-600/10 blur-[80px] sm:blur-[100px] -z-10"></div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
            <div className="bg-red-600 p-3 sm:p-5 rounded-[1.5rem] sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-[#020617] shrink-0 animate-pulse">
              <Video className="text-white w-6 h-6 sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-1 min-w-0 w-full">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase italic leading-none truncate pr-2">Emergency Handshake</h2>
              <p className="text-red-400 font-black text-[9px] sm:text-xs md:text-sm uppercase tracking-widest italic truncate pr-2">Instructor_{ptmSignal.teacherName} is calling for a PTM</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/video-session/${ptmSignal.meetingId}?mode=ptm`)}
            className="w-full lg:w-auto bg-white text-black px-6 sm:px-12 py-3 sm:py-5 rounded-full font-black uppercase text-[10px] sm:text-xs tracking-widest sm:tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl italic border-2 sm:border-4 border-white active:scale-95 shrink-0"
          >
            Join <span className="hidden sm:inline">Conference</span>
          </button>
        </div>
      )}

      {/* 🏛️ EXECUTIVE COMMAND HEADER */}
      <header className="flex flex-wrap xl:flex-nowrap justify-between items-start xl:items-center gap-6 sm:gap-10 bg-slate-950/40 backdrop-blur-3xl p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] border-2 border-slate-900 shadow-[0_0_80px_rgba(234,179,8,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-500/5 blur-[100px] md:blur-[150px] -z-10"></div>
        <div className="space-y-3 sm:space-y-4 w-full flex-1 min-w-[250px] text-left relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-yellow-500 w-2 md:w-2.5 h-10 sm:h-16 md:h-24 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.3)] shrink-0"></div>
            <div className="min-w-0 w-full">
              <h1 className="text-[clamp(2.5rem,5vw,6rem)] font-black tracking-tighter text-white uppercase italic leading-none break-words pr-2">
                Guardian Portal
              </h1>
              <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                 <Signal size={14} className="text-yellow-500 animate-pulse shrink-0 md:w-[18px] md:h-[18px]"/>
                 <p className="text-slate-500 font-black text-[9px] sm:text-xs md:text-sm uppercase tracking-widest sm:tracking-[0.6em] italic leading-none break-words">
                   Auth_Node: <span className="text-yellow-500 ml-1">{user?.name?.toUpperCase()}</span>
                 </p>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full xl:w-auto flex items-center justify-center gap-3 sm:gap-6 bg-yellow-500 hover:bg-yellow-400 text-black px-6 sm:px-10 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase text-[10px] sm:text-xs tracking-widest sm:tracking-[0.4em] shadow-2xl transition-all active:scale-95 border-b-[4px] sm:border-b-[8px] border-yellow-700 italic shrink-0 relative z-10 min-w-[180px]"
        >
          <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3}/> Link New Node
        </button>
      </header>

      {/* 📊 SYSTEM ANALYTICS */}
      {/* 🔥 FIX: Removed Total Attendance, adjusted grid to accommodate exactly 2 cards beautifully */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <StatCard title="Sub-Nodes Linked" value={data?.children?.length || 0} icon={<LayoutGrid className="w-5 h-5 md:w-7 md:h-7 text-blue-500"/>} color="text-blue-500" />
        <StatCard title="Sync Status" value="SECURE" icon={<ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-emerald-500"/>} color="text-emerald-400" />
      </div>

      {/* 🚀 FAMILY GRID STREAM */}
      <main className="space-y-8 sm:space-y-10">
        <div className="flex items-center gap-3 sm:gap-6 border-b-2 border-slate-900 pb-4 sm:pb-6">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500 animate-pulse shrink-0" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Family Neural Grid</h2>
        </div>

        {loading ? (
          <div className="py-20 sm:py-40 flex flex-col items-center gap-6 sm:gap-8">
             <Loader />
             <p className="text-[10px] sm:text-xs font-black text-yellow-500 tracking-widest sm:tracking-[1em] animate-pulse uppercase text-center px-4">Syncing Bio-metric Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 sm:gap-10">
            {data?.children?.length > 0 ? data.children.map((child) => (
              <div key={child.childId} className="group bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-900 hover:border-yellow-500/30 transition-all duration-700 relative overflow-hidden shadow-2xl hover:-translate-y-2 flex flex-col h-full">
                <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-yellow-600/5 blur-[80px] sm:blur-[100px] -z-10 group-hover:bg-yellow-600/10 transition-all"></div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(234,179,8,0.3)] border-2 sm:border-4 border-[#020617] group-hover:rotate-6 transition-transform duration-500 shrink-0">
                    <User className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-center sm:text-left w-full min-w-0">
                    <h3 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black text-white uppercase italic tracking-tighter leading-tight break-words px-1">
                      {child.childName}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0"></div>
                       <p className="text-emerald-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest sm:tracking-[0.4em] italic truncate">Telemetry: ACTIVE</p>
                    </div>
                  </div>
                </div>

                {/* 🔥 FIX: Sub Stats Grid - MERIT INDEX ONLY (Takes full width cleanly) */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8 flex-1">
                   <div className="bg-slate-950/80 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-900 flex flex-col justify-center min-w-0 shadow-inner group-hover:border-blue-500/20 transition-colors">
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase mb-2 sm:mb-3 tracking-widest sm:tracking-[0.2em] italic leading-none break-words">Merit Index</p>
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500 shrink-0"><TrendingUp className="w-5 h-5 sm:w-6 sm:h-6"/></div>
                        <p className="text-2xl sm:text-4xl font-black text-white italic tracking-tighter break-words">{child.analytics?.avgPerformance || "N/A"}</p>
                      </div>
                   </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-auto flex flex-wrap gap-3 sm:gap-4 border-t border-slate-800/50 pt-4 sm:pt-6 shrink-0">
                  <button 
                    onClick={() => navigate(`/parent/grades`)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest italic transition-all group/btn border border-blue-500/20 hover:border-blue-500"
                  >
                    Gradecard <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform shrink-0"/>
                  </button>
                  <button 
                    onClick={() => navigate(`/parent/attendance`)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-slate-900 hover:bg-yellow-500 text-slate-400 hover:text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest italic transition-all group/btn border border-slate-800 hover:border-yellow-500"
                  >
                    Attendance <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform shrink-0"/>
                  </button>
                </div>

              </div>
            )) : (
              <div className="col-span-full py-20 sm:py-32 px-4 text-center border-4 border-dashed border-slate-900 rounded-[3rem] sm:rounded-[4rem] group hover:border-yellow-500/10 transition-all flex flex-col items-center justify-center gap-6 sm:gap-10">
                  <div className="relative">
                    <User className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] text-slate-900 group-hover:scale-110 transition-transform duration-1000" strokeWidth={0.5} />
                    <Activity className="w-6 h-6 sm:w-10 sm:h-10 absolute -top-2 -right-2 text-yellow-500/20 animate-pulse" />
                  </div>
                  <div className="space-y-2 px-4">
                    <p className="text-slate-700 font-black uppercase tracking-widest sm:tracking-[0.8em] text-lg sm:text-xl italic leading-tight">No Nodes Detected</p>
                    <p className="text-slate-800 font-bold uppercase text-[9px] sm:text-xs tracking-widest sm:tracking-[0.4em] max-w-lg mx-auto">Link a student node to begin monitoring.</p>
                  </div>
              </div>
            )}
          </div>
        )}
      </main>

      <AddChildModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onChildAdded={fetchParentData} 
      />
    </div>
  );
}

function StatCard({ title, value, color = "text-white", icon }) {
  return (
    <div className="bg-slate-950/40 backdrop-blur-md p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-900 hover:border-yellow-500/20 transition-all group overflow-hidden relative shadow-2xl flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="p-3 sm:p-4 bg-slate-900 rounded-xl sm:rounded-2xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black group-hover:scale-110 transition-all duration-500 shadow-inner shrink-0 self-start">
          {icon}
        </div>
        <p className="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase tracking-widest sm:tracking-[0.3em] italic leading-tight group-hover:text-slate-400 transition-colors text-left sm:text-right w-full sm:w-auto break-words pr-1">
          {title}
        </p>
      </div>
      <p className={`text-[clamp(2.5rem,5vw,4.5rem)] font-black ${color} tracking-tighter leading-none italic break-words group-hover:translate-x-2 transition-transform duration-700 mt-auto`}>
        {value}
      </p>
    </div>
  );
}

export default ParentDashboard;