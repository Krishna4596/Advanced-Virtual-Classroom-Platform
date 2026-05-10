/**
 * ============================================================
 * 🏛️ TITAN CLASSROOM COMMAND CENTER (v4.6 - Live Signal Build)
 * Feature: Real-time "🔴 LIVE NOW" status indicator.
 * Upgrade: Pulsing "Launch Stream" button when class is active.
 * Ref: Synchronized with Socket.io Room Telemetry.
 * ============================================================
 */

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Chat from "../components/Chat";
import Loader from "../components/Loader";
import CreateAssignmentModal from "../components/CreateAssignmentModal"; 
import Roster from "../components/Roster"; 
import InviteModal from "../components/InviteModal"; 
import { AuthContext } from "../context/AuthContext";
import { getSocket, connectSocket } from "../socket/socket"; 
import { 
  PlayCircle, ArrowLeft, Send, Terminal, Hand, Users, UserPlus, Activity, Radio
} from "lucide-react";

const ClassroomDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stream");
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); 
  const [handRaiseAlert, setHandRaiseAlert] = useState(null);
  
  // 🔥 NEW STATE: Track if the Instructor is currently live
  const [isClassLive, setIsLive] = useState(false);

  const isTeacher = user?.role === "teacher";

  // 🛰️ Attendance Mark
  useEffect(() => {
    const markPresence = async () => {
      if (user?.role === "student" && id) {
        try { await API.post(`/attendance/auto/${id}`); } 
        catch (err) { console.error("❌ SYNC_FAILURE"); }
      }
    };
    if (user && id) markPresence();
  }, [id, user]);

  // 📡 NEURAL HANDSHAKE: Socket & Data Fetch
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/classes/${id}`);
        const data = res.data?.class || res.data?.data || res.data;
        setClassInfo(data);
        
        // Initial Live Check (Backend gives 'isLive' field)
        setIsLive(!!data.isLive);
        setAnnouncements(data.announcements ? [...data.announcements].reverse() : []);

        connectSocket();
        const socket = getSocket();
        if (socket) {
          socket.emit("join_class", id);
          
          // 🔥 FIX: Listen for Real-time Live Signal
          socket.on("class_live_status", (status) => {
            // status expects: { classId: "...", isLive: true/false }
            if (status.classId === id) {
              setIsLive(status.isLive);
            }
          });

          socket.on("new_announcement_broadcast", (newAnn) => {
            setAnnouncements(prev => {
              if (prev.find(a => a._id === newAnn._id)) return prev;
              return [newAnn, ...prev];
            });
          });

          socket.on("you_are_kicked", (data) => {
            if (data.targetId === (user?._id || user?.id)) {
              alert("🛑 SECURITY: Access restricted.");
              navigate("/dashboard", { replace: true });
            }
          });

          socket.on("hand_raised_ui", (data) => {
            if (isTeacher) {
              setHandRaiseAlert(data.userName);
              setTimeout(() => setHandRaiseAlert(null), 6000);
            }
          });
        }
      } catch (err) { 
        console.error("❌ NEURAL_FETCH_ERROR"); 
      } finally { setLoading(false); }
    };

    if (id) fetchDetails();

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off("new_announcement_broadcast");
        socket.off("you_are_kicked");
        socket.off("hand_raised_ui");
        socket.off("class_live_status");
      }
    };
  }, [id, user, navigate, isTeacher]);

  const handlePostAnnouncement = async () => {
    if (!postText.trim()) return;
    try {
      const res = await API.post(`/classes/${id}/announcements`, { text: postText.trim() });
      if (res.data.success) {
        setAnnouncements(prev => [res.data.data, ...prev]);
        setPostText("");
      }
    } catch (err) { alert("❌ Transmit Error"); }
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="p-3 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 md:space-y-8 max-w-[1800px] mx-auto min-h-screen text-slate-200">
      
      {/* 📡 ALERT OVERLAY */}
      {handRaiseAlert && (
        <div className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto z-[200] bg-yellow-500 text-black px-4 sm:px-8 py-3 sm:py-4 rounded-full font-black uppercase text-[9px] sm:text-10px tracking-widest shadow-2xl flex items-center justify-center gap-2 animate-bounce border-2 border-black italic">
           <Hand size={18} /> <span>{handRaiseAlert} Signal Detected!</span>
        </div>
      )}

      {/* 🔙 NAVIGATION HUB */}
      <header className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between items-start sm:items-center bg-slate-950/40 backdrop-blur-2xl p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-900 shadow-xl w-full">
        <button onClick={() => navigate(-1)} className="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-3 text-slate-500 hover:text-white font-black text-[9px] sm:text-[10px] tracking-widest uppercase transition-all italic group">
          <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-blue-600 transition-all border border-white/5">
            <ArrowLeft size={18} strokeWidth={3} />
          </div>
          <span>Return to Dashboard</span>
        </button>
        <div className="w-full sm:w-auto justify-center sm:justify-start bg-slate-900 border border-slate-800 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2 shadow-inner">
           <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
           <span className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase italic">ID: {classInfo?.classCode}</span>
        </div>
      </header>

      {/* 🏛️ BANNER DISPLAY */}
      <div className={`p-5 sm:p-8 md:p-12 rounded-[1.5rem] sm:rounded-[3rem] md:rounded-[4rem] border relative overflow-hidden transition-all duration-700 bg-[#020617]/60 shadow-3xl ${isClassLive ? 'border-red-500/50 ring-4 ring-red-500/10' : 'border-blue-500/20'}`}>
        
        {/* 🔥 LIVE RADAR OVERLAY */}
        {isClassLive && (
          <div className="absolute top-0 right-0 p-4 sm:p-8 md:p-12 z-20">
             <div className="bg-red-600 text-white px-3 sm:px-6 py-1.5 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-pulse border-2 border-white/20">
                <Radio className="w-3 h-3 sm:w-5 sm:h-5 animate-spin" />
                <span className="font-black uppercase text-[10px] sm:text-sm tracking-[0.2em] italic">🔴 Live Now</span>
             </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 sm:gap-8 relative z-10">
          <div className="text-left space-y-3 sm:space-y-4 w-full">
            <div className={`inline-flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border transition-colors ${isClassLive ? 'bg-red-600/10 border-red-500/20' : 'bg-blue-600/10 border-blue-500/20'}`}>
                <Terminal className={`w-3 h-3 sm:w-[14px] sm:h-[14px] shrink-0 ${isClassLive ? 'text-red-500' : 'text-blue-500'}`}/>
                <p className={`font-black text-[7px] sm:text-[9px] uppercase tracking-widest italic truncate ${isClassLive ? 'text-red-500' : 'text-blue-500'}`}>
                  {isClassLive ? "Broadcasting Sequence Active" : "Classroom Node Static"}
                </p>
            </div>
            <h1 className="text-[clamp(1.8rem,6vw,5rem)] font-black tracking-tighter uppercase leading-none text-white italic break-words w-full pr-2">
              {classInfo?.name}
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-auto mt-2 xl:mt-0 shrink-0">
            {/* 🔥 UPGRADED ACTION BUTTON: Changes behavior based on live status */}
            <button 
              onClick={() => navigate(`/video-session/${id}`)} 
              className={`w-full px-5 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-[2rem] font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-4 border-b-[4px] italic
                ${isClassLive 
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-800 animate-in zoom-in duration-500' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-800'
                }`}
            >
              <PlayCircle className={`w-4 h-4 sm:w-6 sm:h-6 shrink-0 ${isClassLive ? 'animate-bounce' : ''}`} /> 
              <span className="truncate">{isClassLive ? "Join Live Stream" : "Launch Stream"}</span>
            </button>

            {isTeacher && (
               <div className="flex gap-2 sm:gap-3 w-full">
                 <button onClick={() => setIsAssignmentModalOpen(true)} className="flex-1 bg-slate-950 hover:bg-slate-900 text-white px-3 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-[8px] sm:text-[9px] uppercase tracking-widest border border-white/5 italic">+ Deploy Task</button>
                 <button onClick={() => setIsInviteModalOpen(true)} className="px-4 sm:px-5 bg-emerald-600 text-white rounded-xl sm:rounded-[1.5rem] hover:bg-emerald-500 shadow-lg flex items-center justify-center shrink-0">
                    <UserPlus size={18} />
                 </button>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* 🎭 NAVIGATION TABS */}
      <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-2 bg-slate-950/80 rounded-[1.2rem] sm:rounded-[2rem] border border-slate-900 w-full xl:w-fit">
        {[{id:"stream", label:"Feed"}, {id:"students", label:"Roster"}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-4 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black uppercase text-[8px] sm:text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-black shadow-lg" : "text-slate-600 hover:text-slate-300"}`}>{tab.label}</button>
        ))}
      </div>

      {/* 🎭 VIEWPORT SWITCHER */}
      <main className="min-h-[400px]">
        {activeTab === "stream" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
            <div className="lg:col-span-8 space-y-5 sm:space-y-8">
               {isTeacher && (
                 <div className="bg-slate-950/20 backdrop-blur-xl p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-900 shadow-2xl">
                   <div className="flex gap-3 sm:gap-6">
                      <div className="shrink-0 w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg border-2 border-[#020617] uppercase">{user?.name?.[0]}</div>
                      <textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="Enter Broadcast Signal..." className="w-full bg-transparent border-none outline-none text-white font-black text-base sm:text-xl md:text-2xl resize-none min-h-[60px] sm:min-h-[100px] pt-1 placeholder:text-slate-800 italic" />
                   </div>
                   <div className="flex justify-end mt-3 sm:mt-6">
                      <button onClick={handlePostAnnouncement} className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-500 text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest italic shadow-xl flex items-center gap-2"><Send size={14}/> <span>Transmit</span></button>
                   </div>
                 </div>
               )}

               <div className="space-y-4 sm:space-y-6">
                 {announcements.map((ann, i) => (
                   <div key={`${ann._id}-${i}`} className="bg-slate-950/40 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-900 space-y-3 sm:space-y-6 hover:border-blue-500/20 transition-all shadow-xl group">
                      <div className="flex items-center gap-3 sm:gap-6">
                         <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-900 rounded-lg flex items-center justify-center text-blue-500 font-black border border-slate-800 italic uppercase">{ann.user?.name?.[0] || "U"}</div>
                         <div className="min-w-0 flex-1">
                            <p className="text-base sm:text-xl font-black text-white uppercase italic truncate">{ann.user?.name || "System"}</p>
                            <p className="text-[6px] sm:text-[8px] text-slate-700 font-black uppercase tracking-widest italic flex items-center gap-1 mt-0.5"><Activity size={10}/> <span>{new Date(ann.createdAt).toLocaleString()}</span></p>
                         </div>
                      </div>
                      <p className="text-sm sm:text-lg md:text-2xl font-black text-slate-300 italic border-l-2 border-slate-800 pl-3 sm:pl-6 group-hover:border-blue-500/50 transition-all break-words leading-snug">"{ann.text}"</p>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="lg:col-span-4 lg:sticky lg:top-24">
                <div className="h-[400px] sm:h-[500px] lg:h-[650px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-slate-900 shadow-3xl bg-slate-950/40 flex flex-col">
                    <Chat classId={id} />
                </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-slate-950/40 p-3 sm:p-8 rounded-[1.5rem] sm:rounded-[3.5rem] border border-slate-900 shadow-3xl overflow-x-hidden">
            <Roster students={classInfo?.students} isTeacher={isTeacher} classId={id} currentUser={user} />
          </div>
        )}
      </main>

      <CreateAssignmentModal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} classId={id} />
      <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} classCode={classInfo?.classCode} />
    </div>
  );
};

export default ClassroomDetail;