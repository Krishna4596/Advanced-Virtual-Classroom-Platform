/**
 * ============================================================
 * 📊 TITAN NEURAL POLL HUB (v5.0 - Sync Fixed)
 * Fix: Added socket.emit("join_class") so students actually
 * receive the broadcasted polls in real-time.
 * ============================================================
 */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getSocket } from "../socket/socket";
import API from "../api/api";
import { 
  BarChart3, 
  CheckCircle2, 
  PlusCircle, 
  ShieldAlert, 
  Zap, 
  Loader2,
  Users
} from "lucide-react";

function PollSystem({ classId, user }) {
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const isTeacher = user?.role === 'teacher';

  // 🛰️ Neural State Sync
  const syncPollState = useCallback(async () => {
    if (!classId || !user?._id) return;
    try {
      setIsSyncing(true);
      const res = await API.get(`/polls/${classId}`); 
      const activePoll = res.data?.data || res.data;
      
      if (activePoll && activePoll._id) {
        setPoll(activePoll);
        const userHasVoted = activePoll.voters?.some(v => (v._id || v) === user._id);
        setHasVoted(userHasVoted);
      } else {
        setPoll(null);
        setHasVoted(false);
      }
    } catch (err) {
      console.warn("Poll Node Standby Mode Active.");
      setPoll(null);
    } finally {
      setIsSyncing(false);
    }
  }, [classId, user?._id]);

  useEffect(() => {
    syncPollState();

    const socket = getSocket();
    if (socket && classId) {
      
      // 🔥 FIX 1: VERY IMPORTANT! Student must join the socket room to receive polls!
      socket.emit("join_class", classId); 

      const handleVoteUpdate = (updatedPoll) => {
        if (updatedPoll.classId === classId || updatedPoll._id === poll?._id) {
          setPoll(updatedPoll);
          const voted = updatedPoll.voters?.some(v => (v._id || v) === user?._id);
          setHasVoted(voted);
        }
      };

      const handleNewPoll = (newPoll) => {
        if (newPoll.classId === classId || !newPoll.classId) {
          setPoll(newPoll);
          setHasVoted(false);
        }
      };

      // 🔥 FIX 2: Listening to multiple possible backend event names just to be 100% safe
      socket.on("poll_vote_registered", handleVoteUpdate);
      socket.on("poll_results_updated", handleVoteUpdate); 
      socket.on("new_poll_active", handleNewPoll);
      socket.on("receive_poll", handleNewPoll); 

      return () => {
        socket.off("poll_vote_registered", handleVoteUpdate);
        socket.off("poll_results_updated", handleVoteUpdate);
        socket.off("new_poll_active", handleNewPoll);
        socket.off("receive_poll", handleNewPoll);
      };
    }
  }, [classId, user?._id, syncPollState, poll?._id]);

  // 🚀 Vote Transmission Handshake
  const handleVote = async (index) => {
    if (hasVoted || isTeacher || !poll?._id) return;
    try {
      const res = await API.post("/polls/vote", { 
        pollId: poll._id, 
        optionIndex: index 
      });
      if (res.data.success) {
        setPoll(res.data.data);
        setHasVoted(true);
        
        const socket = getSocket();
        if (socket) {
          socket.emit("submit_vote", { ...res.data.data, classId, roomId: classId });
        }
      }
    } catch (err) {
      console.error("Transmission Failure: Node Sync Lost.");
    }
  };

  const handleCreatePoll = async () => {
    const question = prompt("Enter Research Question:");
    if (!question) return;
    const optionsInput = prompt("Enter options (comma separated):", "Yes, No");
    if (!optionsInput) return;
    
    const options = optionsInput.split(",").map(opt => opt.trim());
    
    try {
      const res = await API.post("/polls/create", { classId, question, options });
      if (res.data.success) {
        setPoll(res.data.data);
        setHasVoted(false);
        
        const socket = getSocket();
        if (socket) {
          // 🔥 FIX 3: Broadcast with both keys to avoid backend missing it
          socket.emit("launch_poll", { ...res.data.data, classId, roomId: classId });
        }
      }
    } catch (err) {
      alert("Broadcast Initialization Error");
    }
  };

  const totalVotes = useMemo(() => {
    return poll?.options.reduce((acc, opt) => acc + (opt.votes || 0), 0) || 0;
  }, [poll]);

  if (!user || !classId) return null;

  return (
    <div className="glass p-6 sm:p-10 rounded-[2rem] sm:rounded-[4rem] border-2 border-blue-500/10 shadow-3xl animate-in zoom-in-95 duration-500 relative overflow-hidden flex flex-col min-h-[480px] bg-slate-950/40 backdrop-blur-3xl h-full w-full">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/5 blur-[120px] -z-10 pointer-events-none"></div>

      {/* 📡 Header Node */}
      <header className="flex justify-between items-start mb-8 sm:mb-10">
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-500 shadow-lg shrink-0">
                {isSyncing ? <Loader2 size={22} className="animate-spin"/> : <BarChart3 size={22} className="animate-pulse" />}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500/60 leading-none truncate">Interaction Hub</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic flex items-center gap-2 truncate">
                    <Users size={10} className="shrink-0"/> Telemetry_Mode: {totalVotes} Active Signals
                </span>
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-tight italic break-words">
            {poll ? poll.question : "Awaiting Node Signal"}
          </h3>
        </div>
      </header>

      {/* 🌊 Option Grid */}
      <div className="space-y-4 sm:space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {poll ? poll.options.map((opt, idx) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <button 
              key={idx} 
              disabled={hasVoted || isTeacher}
              onClick={() => handleVote(idx)} 
              className={`w-full relative overflow-hidden py-5 sm:py-7 px-6 sm:px-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 transition-all duration-700 group flex items-center justify-between shadow-2xl ${
                hasVoted || isTeacher 
                ? 'bg-slate-950/60 border-slate-900 cursor-default shadow-none' 
                : 'bg-slate-900/40 border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 active:scale-95'
              }`}
            >
              {/* 📊 Progress Bar Node */}
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600/15 transition-all duration-[1500ms] ease-out -z-10" 
                style={{ width: `${percentage}%` }}
              ></div>

              <div className="flex items-center gap-4 sm:gap-5 relative z-10 min-w-0">
                {(hasVoted || isTeacher) ? (
                    <CheckCircle2 size={20} className={`shrink-0 ${percentage > 0 ? "text-blue-500" : "text-slate-700"}`} />
                ) : (
                    <Zap size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors shrink-0" />
                )}
                <span className={`text-base sm:text-lg font-black uppercase tracking-tight transition-colors break-words text-left ${hasVoted || isTeacher ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {opt.text}
                </span>
              </div>

              {(hasVoted || isTeacher) && (
                <div className="flex flex-col items-end relative z-10 pl-4 shrink-0">
                  <span className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tighter leading-none italic">{percentage}%</span>
                  <p className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Score</p>
                </div>
              )}
            </button>
          );
        }) : (
          <div className="py-16 sm:py-24 text-center border-4 border-dashed border-slate-900 rounded-[3rem] sm:rounded-[4rem] flex flex-col items-center justify-center opacity-30 gap-4 sm:gap-6">
              <ShieldAlert size={60} className="text-slate-700 w-12 h-12 sm:w-[60px] sm:h-[60px]" />
              <p className="text-slate-600 font-black uppercase text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] italic px-4">Node Standby: Broadcast Hub Offline</p>
          </div>
        )}
      </div>

      {/* 🚀 Admin Handshake Controls */}
      {isTeacher && (
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-900 flex justify-between items-center shrink-0">
             <button onClick={handleCreatePoll} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-5 sm:py-6 rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase text-[10px] sm:text-xs tracking-widest sm:tracking-[0.4em] flex items-center justify-center gap-3 sm:gap-4 shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all active:scale-95">
                <PlusCircle size={20} strokeWidth={2.5} className="sm:w-6 sm:h-6 shrink-0"/> <span className="truncate">Deploy Broadcast</span>
             </button>
        </div>
      )}
    </div>
  );
}

export default PollSystem;