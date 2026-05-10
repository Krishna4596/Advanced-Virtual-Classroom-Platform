/**
 * ============================================================
 * 🛰️ TITAN STUDENT HUB (v4.7 - Live Radar Build)
 * Feature: Added dynamic "🔴 LIVE" badges on Class Cards.
 * Ref: Listens to global socket 'class_live_status' events.
 * ============================================================
 */

import React, { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Loader from "../components/Loader";
import JoinClassModal from "../components/JoinClassModal"; 
import { AuthContext } from "../context/AuthContext";
import { getSocket, connectSocket } from "../socket/socket";
import { 
  BookOpen, GraduationCap, Search, 
  Bell, Star, Zap, ChevronRight, 
  Target, Sparkles, Video, UserCheck, Activity, ShieldCheck, Radio
} from "lucide-react";

function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [assignmentCount, setAssignmentCount] = useState(0); 
  const [presenceIndex, setPresenceIndex] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [ptmSignal, setPtmSignal] = useState(null); 
  
  // 🔥 NEW STATE: Track which classes are currently live
  const [liveClasses, setLiveClasses] = useState({}); // Stores { classId: true/false }

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const classRes = await API.get("/classes/my-classes");
      const fetchedClasses = classRes.data?.data || classRes.data?.classes || [];
      setClasses(fetchedClasses);
      
      // Load initial live status from DB (if your API supports it)
      const initialLiveStatus = {};
      fetchedClasses.forEach(cls => {
        if (cls.isLive) initialLiveStatus[cls._id] = true;
      });
      setLiveClasses(initialLiveStatus);
      
      try {
        const assignRes = await API.get("/assignments/my-assignments");
        const tasks = assignRes.data?.assignments || assignRes.data?.data || [];
        setAssignmentCount(tasks.length);
      } catch (err) {
        setAssignmentCount(0);
      }

      try {
        const presenceRes = await API.get("/attendance/my-presence");
        if (presenceRes.data.success) {
          setPresenceIndex(presenceRes.data.presenceIndex);
        }
      } catch (err) {
        setPresenceIndex(65.5); 
      }

    } catch (err) {
      console.error("❌ NEURAL_LINK_FAILURE: Dashboard sync denied.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      connectSocket();
      const socket = getSocket();

      if (socket) {
        socket.on("ptm_invitation", (data) => {
          setPtmSignal({
            teacherName: data.teacherName,
            meetingId: data.classId,
            topic: data.topic
          });
        });
        socket.on("ptm_terminated", () => setPtmSignal(null));

        // 🔥 FIX: Global Live Status Radar!
        socket.on("class_live_status", (status) => {
           setLiveClasses(prev => ({ ...prev, [status.classId]: status.isLive }));
        });
      }
    }
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off("ptm_invitation");
        socket.off("class_live_status");
      }
    };
  }, [user, fetchDashboardData]);

  const onJoin = async (classCode) => {
    try {
      const res = await API.post("/classes/join", { classCode });
      if (res.data.success) {
        setIsJoinModalOpen(false); 
        fetchDashboardData(); 
      }
    } catch (err) {
      alert(`🛑 HANDSHAKE_DENIED: ${err.response?.data?.message || "Invalid Node Identifier"}`);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-in fade-in duration-700 p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8 md:space-y-12 selection:bg-emerald-500/30 max-w-[1900px] mx-auto min-h-screen">
      
      {/* 🚨 ALERT: TRINITY HANDSHAKE */}
      {ptmSignal && (
        <div className="bg-blue-600/10 border-2 border-blue-500 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-2xl text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
            <div className="bg-blue-600 p-3 sm:p-4 rounded-[1.5rem] shadow-lg border-2 border-[#020617] shrink-0">
              <Video className="text-white animate-pulse w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1 min-w-0 w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase italic leading-none truncate">PTM Handshake</h2>
              <p className="text-blue-400 font-black text-[9px] md:text-xs uppercase tracking-widest italic truncate pr-2">{ptmSignal.teacherName} requesting session</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/video-session/${ptmSignal.meetingId}?mode=ptm`)}
            className="w-full sm:w-auto bg-white text-black px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl italic border-b-4 border-slate-300 active:border-b-0 shrink-0"
          >
            Join <span className="hidden sm:inline">Conference</span>
          </button>
        </div>
      )}

      {/* 🏛️ EXECUTIVE HUB HEADER */}
      <header className="flex flex-wrap justify-between items-center gap-6 bg-slate-950/40 backdrop-blur-3xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] border-2 border-slate-900 shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000"></div>
        
        <div className="space-y-2 w-full xl:w-auto flex-1 min-w-[250px] text-left relative z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-emerald-500 w-1.5 md:w-2 h-10 sm:h-12 md:h-16 rounded-full shadow-lg shrink-0"></div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none truncate pr-2">Learning Hub</h1>
          </div>
          <p className="text-slate-500 font-black text-[8px] sm:text-[9px] md:text-xs uppercase tracking-widest sm:tracking-[0.4em] italic truncate">
            Node_Identity: <span className="text-emerald-500 ml-1 sm:ml-2">{user?.name?.toUpperCase()}</span>
          </p>
        </div>
        
        <button onClick={() => setIsJoinModalOpen(true)} className="w-full xl:w-auto flex-[2] xl:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-2xl md:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 border-b-4 border-blue-800 italic shrink-0 relative z-10 min-w-[150px]">
          + Join Node
        </button>
      </header>

      {/* 📊 TELEMETRY STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 sm:gap-6">
        <StatCard title="Active Streams" value={classes.length} icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"/>} />
        <StatCard title="Stability" value="98%" icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500"/>} />
        <StatCard title="Protocols" value={assignmentCount} icon={<Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500"/>} />
        <StatCard title="Neural Creds" value="1.2K" icon={<Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500"/>} color="text-yellow-500" />
      </div>

      {/* 🏫 MAIN CONTENT CLUSTER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        
        {/* ENROLLED STREAMS SECTION */}
        <div className="xl:col-span-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-900 pb-4 gap-2 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">Enrolled Streams</h2>
            <span className="text-[8px] sm:text-[9px] font-black text-slate-700 uppercase tracking-widest italic bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800 shrink-0">Live_Sync_v4.2</span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4"><Loader /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 sm:gap-6">
              {classes.map((cls) => {
                
                // 🔥 CHECK LIVE STATUS HERE
                const isLive = !!liveClasses[cls._id];

                return (
                  <div key={cls._id} className={`group flex flex-col h-full bg-slate-950/40 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all relative overflow-hidden shadow-2xl hover:-translate-y-2 ${isLive ? 'border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'border-slate-900 hover:border-emerald-500/30'}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 transition-all duration-700 ${isLive ? 'bg-red-500/15' : 'bg-emerald-500/5 group-hover:bg-emerald-500/10'}`}></div>
                    
                    {/* 🔥 🔴 LIVE BADGE */}
                    {isLive && (
                       <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse border border-red-400">
                         <Radio size={12} className="animate-spin" />
                         <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest italic">Live Now</span>
                       </div>
                    )}

                    <div className="flex-1 min-w-0 pt-2">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase italic truncate pr-2 sm:pr-4 mb-2">{cls.name}</h3>
                      <p className={`font-black text-[9px] sm:text-[10px] uppercase tracking-widest mb-6 sm:mb-8 italic truncate pr-2 ${isLive ? 'text-red-400' : 'text-emerald-500'}`}>{cls.subject}</p>
                    </div>
                    
                    <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-3 sm:gap-4 shrink-0 mt-auto border-t border-slate-800/50 pt-4 sm:pt-6">
                      <button onClick={() => navigate(`/student/class/${cls._id}`)} className="flex-[3] bg-white text-black py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all italic active:scale-95 flex items-center justify-center border-b-[3px] border-slate-300 hover:border-emerald-800 min-w-[120px]">
                        Enter Node
                      </button>
                      <button onClick={() => navigate(`/video-session/${cls._id}`)} className={`flex-1 w-full sm:w-auto px-4 sm:px-6 text-white rounded-xl sm:rounded-2xl border-b-[3px] sm:border-b-4 active:border-b-0 transition-all active:translate-y-1 flex items-center justify-center shrink-0 min-w-[60px] group/video ${isLive ? 'bg-red-600 border-red-800 animate-bounce' : 'bg-slate-800 border-slate-900 hover:bg-red-600 hover:border-red-800'}`}>
                        <Video className="w-5 h-5 sm:w-6 sm:h-6 group-hover/video:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 📊 SIDEBAR ANALYTICS */}
        <div className="xl:col-span-4 space-y-6 sm:space-y-8">
          
          <div className="bg-slate-950/40 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-2 border-emerald-500/10 text-center space-y-4 sm:space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/10 transition-all duration-700"></div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest sm:tracking-[0.4em] italic relative z-10">Presence_Index</p>
            <h3 className="text-6xl sm:text-7xl md:text-8xl font-black text-emerald-500 tracking-tighter italic leading-none relative z-10 break-words">
              {presenceIndex}%
            </h3>
            <div className="w-full bg-slate-900 h-2 sm:h-3 rounded-full overflow-hidden border border-white/5 relative z-10">
              <div 
                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${presenceIndex}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-950/40 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-900 shadow-2xl">
             <h3 className="text-base sm:text-lg font-black text-white uppercase italic flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 leading-none">
                <Bell size={18} className="text-blue-500 sm:w-5 sm:h-5" /> Node_Alerts
             </h3>
             <div className="space-y-4 sm:space-y-6">
                <ActivityItem text="Neural Stream Active" class="PROTOCOL_ALPHA" time="LIVE" status="active" />
                <ActivityItem text="System Link Verified" class="GLOBAL_NODE" time="SYNCED" status="stable" />
             </div>
          </div>
        </div>

      </div>

      <JoinClassModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        onJoin={onJoin} 
      />
    </div>
  );
}

function StatCard({ title, value, color = "text-emerald-500", icon }) {
  return (
    <div className="bg-slate-950/40 p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-slate-900 hover:border-emerald-500/20 transition-all group flex flex-col justify-between h-full shadow-xl">
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="p-2 sm:p-3 bg-slate-900 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform shrink-0 shadow-inner">{icon}</div>
        <p className="text-[8px] sm:text-[9px] font-black text-slate-700 uppercase tracking-widest italic text-right break-words">{title}</p>
      </div>
      <p className={`text-3xl sm:text-4xl lg:text-5xl font-black ${color} tracking-tighter leading-none italic break-words mt-auto group-hover:translate-x-1 transition-transform`}>
        {value}
      </p>
    </div>
  );
}

function ActivityItem({ text, class: className, time, status }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 group border-l-2 border-slate-900 hover:border-blue-500 pl-3 sm:pl-4 transition-all py-1">
      <div className="space-y-1 w-full min-w-0">
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`}></div>
           <p className="text-xs sm:text-sm md:text-base font-black text-slate-400 uppercase tracking-tight group-hover:text-white transition-colors italic truncate">{text}</p>
        </div>
        <p className="text-[7px] sm:text-[8px] font-bold text-slate-700 uppercase tracking-widest italic truncate">{className} • {time}</p>
      </div>
    </div>
  );
}

export default StudentDashboard;