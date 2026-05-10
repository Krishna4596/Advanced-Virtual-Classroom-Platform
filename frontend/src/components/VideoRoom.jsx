/**
 * ============================================================
 * 📹 TITAN VIDEO STAGE (v11.0 - The "Zoom-Killer" Build)
 * Features: Spotlight (Pin/Zoom Video), Instructor Kick Power,
 * Global Hand Raise Sync, and Thumbnail Strip for Pinned mode.
 * ============================================================
 */

import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Peer from "peerjs"; 
import { getSocket, connectSocket } from "../socket/socket";
import { AuthContext } from "../context/AuthContext";
import Chat from "./Chat"; 
import Whiteboard from "./Whiteboard"; 
import PollSystem from "./PollSystem"; 
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, Users, 
  MessageSquare, ShieldAlert, Activity, Crown, Zap,
  ArrowRight, PenTool, BarChart2, X, Hand, Maximize, Minimize, UserX
} from "lucide-react";

// 🎬 SUB-COMPONENT: Reusable Video Node (with Hover Actions)
const VideoNode = ({ stream, isLocal, name, isCamOn, isHandRaised, isTeacherView, onPin, isPinned, onKick }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative w-full h-full bg-[#0a0f1c] ${isPinned ? 'rounded-2xl sm:rounded-[3rem]' : 'rounded-[1.5rem] sm:rounded-[2rem]'} overflow-hidden border-2 border-slate-800 shadow-2xl group flex items-center justify-center transition-all duration-500`}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted={isLocal} 
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLocal ? 'scale-x-[-1]' : ''} ${(!isCamOn && isLocal) ? 'opacity-0' : 'opacity-100'}`} 
      />
      
      {/* Fallback Avatar */}
      {(!isCamOn && isLocal) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
           <div className={`bg-blue-600 flex items-center justify-center font-black text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] uppercase italic ${isPinned ? 'w-32 h-32 text-6xl rounded-[3rem]' : 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl rounded-2xl sm:rounded-3xl'}`}>
             {name?.[0] || "?"}
           </div>
        </div>
      )}

      {/* 🔥 HOVER CONTROLS: Pin (Zoom) & Kick */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
         <button onClick={onPin} className="p-2 sm:p-2.5 bg-black/70 backdrop-blur-md rounded-xl text-white hover:bg-blue-600 hover:scale-110 transition-all border border-white/10" title={isPinned ? "Unpin Video" : "Spotlight Video"}>
           {isPinned ? <Minimize size={18} /> : <Maximize size={18} />}
         </button>
         
         {/* Instructor Kick Button */}
         {isTeacherView && !isLocal && (
           <button onClick={onKick} className="p-2 sm:p-2.5 bg-black/70 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-600 hover:text-white hover:scale-110 transition-all border border-white/10" title="Remove from Session">
             <UserX size={18} />
           </button>
         )}
      </div>

      {/* ✋ Hand Raise Indicator */}
      {isHandRaised && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-blue-600 text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-bounce z-20 border border-blue-400">
          <Hand className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}

      {/* 📛 Identity Badge */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/10 flex items-center gap-2 z-10">
        {!isLocal && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>}
        <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[100px] sm:max-w-[150px] italic">
          {name} {isLocal && "(You)"}
        </span>
      </div>
    </div>
  );
};

function VideoRoom() {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const location = useLocation();
  const peerInstance = useRef(null);
  
  const isPTMMode = new URLSearchParams(location.search).get("mode") === "ptm";
  const myId = user?._id || user?.id;
  
  // 🎥 STREAMS & LAYOUT STATE
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]); 
  const [pinnedStreamId, setPinnedStreamId] = useState(null); // 🔥 For Zoom/Spotlight feature
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  
  // ✋ HAND RAISE STATE
  const [raisedHands, setRaisedHands] = useState({}); 
  const isMyHandRaised = !!raisedHands[myId];

  // HUD State Toggles
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isPollsOpen, setIsPollsOpen] = useState(false);
  
  const [peerError, setPeerError] = useState("");
  const [permissions, setPermissions] = useState({ allowDraw: false });

  const isTeacher = user?.role === 'teacher';

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !isCamOn;
      setIsCamOn(!isCamOn);
    }
  };

  const toggleHandRaise = () => {
    const newState = !isMyHandRaised;
    setRaisedHands(prev => ({ ...prev, [myId]: newState }));
    const socket = getSocket();
    if (socket) {
      // 🔥 Emit Global Hand Raise
      socket.emit("toggle_hand_raise", { roomId, userId: myId, isRaised: newState });
    }
  };

  const handleTerminateSession = () => {
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (peerInstance.current) peerInstance.current.destroy();
    navigate(isTeacher ? '/teacher' : '/student');
  };

  const handleKickUser = (userId) => {
    const confirmKick = window.confirm("⚠️ SECURITY OVERRIDE: Remove this node from the session?");
    if (!confirmKick) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("kick_user", { roomId, userId }); // Trigger kick
    }
    // Remove locally immediately for snappy UI
    setRemoteStreams(prev => prev.filter(p => p.id !== userId));
    if (pinnedStreamId === userId) setPinnedStreamId(null);
  };

  const togglePin = (id) => {
    if (pinnedStreamId === id) setPinnedStreamId(null);
    else setPinnedStreamId(id);
  };

  // 📡 ADD OR REMOVE REMOTE STREAMS EFFICIENTLY
  const addRemoteStream = (peerId, stream, name) => {
    setRemoteStreams(prev => {
      if (prev.find(p => p.id === peerId)) return prev; 
      return [...prev, { id: peerId, stream, name }];
    });
  };

  const removeRemoteStream = (peerId) => {
    setRemoteStreams(prev => prev.filter(p => p.id !== peerId));
    if (pinnedStreamId === peerId) setPinnedStreamId(null);
  };

  // --- Logic: WebRTC & Socket Sequence ---
  useEffect(() => {
    if (!user) return;
    let myStream = null;

    const initializeRoom = async () => {
      try {
        myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(myStream);

        if (peerInstance.current) peerInstance.current.destroy();

        const peer = new Peer(myId, {
          config: { 
            'iceServers': [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] 
          }
        });
        peerInstance.current = peer;

        peer.on('open', (id) => {
          setPeerError("");
          connectSocket();
          const socket = getSocket();
          
          if (socket) {
            socket.emit("join_video_room", { roomId, user: { id: myId, name: user.name, role: user.role } });

            // 👢 Listen for Kick Event
            socket.on("user_kicked", ({ userId }) => {
              if (userId === myId) {
                alert("🛑 You have been removed from the session by the Instructor.");
                handleTerminateSession();
              } else {
                removeRemoteStream(userId);
              }
            });

            // ✋ Listen for Global Hand Raises
            socket.on("hand_raise_updated", ({ userId, isRaised }) => {
              setRaisedHands(prev => ({ ...prev, [userId]: isRaised }));
            });

            // 📊 Auto-open polls for students
            const handleIncomingPoll = () => {
              if (!isTeacher) {
                setIsBoardOpen(false);
                setIsPollsOpen(true);
              }
            };
            socket.on("receive_poll", handleIncomingPoll);
            socket.on("new_poll_active", handleIncomingPoll);

            socket.on("new_participant", (newUser) => {
              const call = peer.call(newUser.id, myStream, { metadata: { name: user.name } });
              if (call) {
                call.on("stream", (remoteS) => addRemoteStream(newUser.id, remoteS, newUser.name));
                call.on("close", () => removeRemoteStream(newUser.id));
              }
            });

            socket.on("participant_left", (leftUserId) => {
              removeRemoteStream(leftUserId);
              setRaisedHands(prev => { const updated = {...prev}; delete updated[leftUserId]; return updated; });
            });
          }
        });

        peer.on("call", (call) => {
          const callerName = call.metadata?.name || "Agent Node";
          call.answer(myStream);
          call.on("stream", (remoteS) => addRemoteStream(call.peer, remoteS, callerName));
          call.on("close", () => removeRemoteStream(call.peer));
        });

      } catch (err) {
        setPeerError("Camera/Microphone permissions denied.");
      }
    };

    initializeRoom();

    return () => {
      if (myStream) myStream.getTracks().forEach(t => t.stop());
      if (peerInstance.current) peerInstance.current.destroy();
      const socket = getSocket();
      if (socket) {
          socket.off("new_participant"); socket.off("participant_left"); socket.off("user_kicked");
          socket.off("receive_poll"); socket.off("new_poll_active"); socket.off("hand_raise_updated");
      }
    };
  }, [roomId, user, myId, isTeacher]);

  // 📐 COMBINE ALL NODES FOR EASY RENDERING
  const allNodes = [
    { id: myId, stream: localStream, isLocal: true, name: user?.name, isCamOn, isHandRaised: isMyHandRaised },
    ...remoteStreams.map(r => ({ ...r, isLocal: false, isCamOn: true, isHandRaised: raisedHands[r.id] }))
  ];

  const totalNodes = allNodes.length;
  let gridLayoutClass = "grid-cols-1 max-w-4xl"; 
  if (totalNodes === 2) gridLayoutClass = "grid-cols-1 md:grid-cols-2 max-w-6xl";
  else if (totalNodes === 3 || totalNodes === 4) gridLayoutClass = "grid-cols-2 max-w-5xl";
  else if (totalNodes > 4 && totalNodes <= 6) gridLayoutClass = "grid-cols-2 lg:grid-cols-3 max-w-6xl";
  else if (totalNodes > 6) gridLayoutClass = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl";

  const pinnedNodeObj = pinnedStreamId ? allNodes.find(n => n.id === pinnedStreamId) : null;

  return (
    <div className="h-[100dvh] w-screen bg-[#020617] flex relative overflow-hidden font-sans text-slate-200">
      
      {/* HUD MAIN WRAPPER (Video Area) */}
      <div className={`flex flex-col transition-all duration-700 h-full relative z-10 ${isChatOpen ? 'lg:mr-[400px]' : ''} ${(isBoardOpen || isPollsOpen) ? 'hidden lg:flex lg:w-1/2' : 'w-full'}`}>
        
        {/* HUD HEADER */}
        <header className="p-4 flex justify-between items-center z-50 shrink-0 absolute top-0 left-0 w-full pointer-events-none">
          <div className="flex items-center gap-3 min-w-0 bg-black/50 p-2 pr-4 rounded-2xl backdrop-blur-md border border-white/10 pointer-events-auto shadow-xl">
            <div className={`p-2 rounded-xl shrink-0 ${isPTMMode ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'}`}>
              {isPTMMode ? <ShieldAlert size={16} /> : isTeacher ? <Crown size={16} /> : <Activity size={16} />}
            </div>
            <div className="min-w-0">
              <h2 className="font-black uppercase italic tracking-tighter text-[10px] sm:text-xs truncate">
                {isPTMMode ? "Guardian Link" : isTeacher ? "Instructor Console" : "Agent Node"}
              </h2>
            </div>
          </div>
          
          <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-3 rounded-xl transition-all shrink-0 border border-white/10 pointer-events-auto ${isChatOpen ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'bg-black/50 backdrop-blur-md hover:bg-slate-800'}`}>
            <MessageSquare size={18} />
          </button>
        </header>

        {peerError && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 bg-red-600/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl text-center text-xs font-black uppercase tracking-widest shadow-2xl border border-red-400">
            {peerError}
          </div>
        )}

        {/* 🚀 DYNAMIC MULTI-SCREEN STAGE (Gallery vs Spotlight) */}
        <main className="flex-1 w-full h-full bg-[#020617] relative flex flex-col justify-center items-center overflow-hidden pt-20 pb-28">
          
          {pinnedNodeObj ? (
            /* 🔍 SPOTLIGHT VIEW (Pinned) */
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-6">
              {/* Main Large Video */}
              <div className="flex-1 w-full max-w-6xl max-h-[70vh] flex justify-center">
                 <VideoNode 
                   {...pinnedNodeObj} 
                   isTeacherView={isTeacher} 
                   onPin={() => togglePin(pinnedNodeObj.id)} 
                   isPinned={true} 
                   onKick={() => handleKickUser(pinnedNodeObj.id)} 
                 />
              </div>
              
              {/* Thumbnail Strip (Bottom) */}
              <div className="w-full max-w-6xl overflow-x-auto custom-scrollbar flex gap-4 pb-4 px-2 shrink-0 h-32 sm:h-40">
                {allNodes.filter(n => n.id !== pinnedStreamId).map((node) => (
                  <div key={node.id} className="h-full aspect-video shrink-0">
                    <VideoNode 
                      {...node} 
                      isTeacherView={isTeacher} 
                      onPin={() => togglePin(node.id)} 
                      isPinned={false} 
                      onKick={() => handleKickUser(node.id)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 🔲 GALLERY VIEW (Grid) */
            <div className={`w-full max-w-7xl h-full p-4 sm:p-6 md:p-10 grid gap-4 sm:gap-6 place-content-center items-center overflow-y-auto custom-scrollbar ${gridLayoutClass}`}>
              {allNodes.map((node) => (
                <div key={node.id} className={`${totalNodes === 1 ? 'max-w-4xl mx-auto w-full' : ''}`}>
                  <VideoNode 
                    {...node} 
                    isTeacherView={isTeacher} 
                    onPin={() => togglePin(node.id)} 
                    isPinned={false} 
                    onKick={() => handleKickUser(node.id)} 
                  />
                </div>
              ))}

              {/* Syncing Fallback (If strictly alone) */}
              {totalNodes === 1 && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none rounded-[3rem] z-0">
                   <Users size={60} className="text-slate-300 mb-4 animate-bounce" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white bg-black/60 px-6 py-2 rounded-full border border-white/10 text-center">Waiting for nodes...</p>
                 </div>
              )}
            </div>
          )}
        </main>

        {/* 🎛️ COMMAND DECK: Floating Controls */}
        <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto">
          <div className="bg-slate-950/80 backdrop-blur-2xl px-4 sm:px-6 py-3 rounded-3xl border border-white/10 flex items-center justify-center gap-3 sm:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            
            {/* ✋ Hand Raise Toggle */}
            {!isPTMMode && (
              <button onClick={toggleHandRaise} className={`p-3 sm:p-4 rounded-2xl transition-all active:scale-90 ${isMyHandRaised ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`} title="Raise Hand">
                <Hand size={20} />
              </button>
            )}

            {/* Whiteboard Toggle */}
            <button onClick={() => setIsBoardOpen(!isBoardOpen)} className={`p-3 sm:p-4 rounded-2xl transition-all active:scale-90 ${isBoardOpen ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`} title="Neural Board">
              <PenTool size={20} />
            </button>
            
            {/* Polls Toggle */}
            {!isPTMMode && (
              <button onClick={() => setIsPollsOpen(!isPollsOpen)} className={`p-3 sm:p-4 rounded-2xl transition-all active:scale-90 ${isPollsOpen ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-white'}`} title="Intel Polls">
                <BarChart2 size={20} />
              </button>
            )}

            <div className="w-[1px] h-8 bg-white/10 mx-1 hidden xs:block"></div>

            {/* AV Controls */}
            <button onClick={toggleMic} className={`p-3 sm:p-4 rounded-2xl transition-all active:scale-90 ${isMicOn ? 'bg-slate-800 text-white' : 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'}`}>
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button onClick={toggleCam} className={`p-3 sm:p-4 rounded-2xl transition-all active:scale-90 ${isCamOn ? 'bg-slate-800 text-white' : 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'}`}>
              {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            
            <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
            
            <button onClick={handleTerminateSession} className="bg-red-600 hover:bg-red-500 p-3 sm:p-4 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-red-600/20" title="End Link">
              <PhoneOff size={20} className="text-white" />
            </button>
          </div>
        </footer>
      </div>

      {/* 🚀 OVERLAYS: Whiteboard & Polls */}
      {(isBoardOpen || isPollsOpen) && (
        <div className={`absolute inset-0 z-[60] lg:relative lg:flex-1 w-full h-full bg-[#020617] lg:border-l border-white/5 transition-all duration-500 ${isChatOpen ? 'lg:mr-[400px]' : ''}`}>
           <div className="h-full w-full p-4 md:p-8 pt-20 lg:pt-8 overflow-y-auto relative">
             <button onClick={() => { setIsBoardOpen(false); setIsPollsOpen(false); }} className="absolute top-6 right-6 lg:hidden bg-red-600 hover:bg-red-500 p-3 rounded-2xl z-[100] shadow-2xl text-white transition-transform active:scale-90 border border-red-400/50">
                <X size={24} />
             </button>
             {isBoardOpen && <Whiteboard roomId={roomId} permissions={permissions} user={user} />}
             {isPollsOpen && <PollSystem classId={roomId} user={user} />}
           </div>
        </div>
      )}

      {/* RIGHT SIDEBAR: CHAT */}
      <aside className={`fixed right-0 top-0 h-full w-full sm:w-[350px] lg:w-[400px] bg-slate-950 border-l border-white/5 z-[100] transition-transform duration-500 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsChatOpen(false)} className="absolute top-4 left-[-48px] bg-blue-600 p-3 rounded-l-xl shadow-[-10px_0_20px_rgba(0,0,0,0.5)] lg:hidden flex items-center justify-center">
          <ArrowRight className="text-white w-5 h-5" />
        </button>
        <Chat classId={roomId} />
      </aside>

    </div>
  );
}

export default VideoRoom;