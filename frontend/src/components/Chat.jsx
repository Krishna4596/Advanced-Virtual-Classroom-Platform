/**
 * ============================================================
 * 📡 TITAN NEURAL CHAT (v4.2 - Production Final)
 * Upgrade: Hybrid Hydration (API + Socket) & Optimistic UI.
 * ============================================================
 */

import React, { useEffect, useState, useRef, useContext } from "react";
import { getSocket, connectSocket } from "../socket/socket";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api"; 
import { Send, MessageSquare, Zap, ShieldCheck, User, Loader2 } from "lucide-react";

function Chat({ classId }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  // --- 1. HYBRID HYDRATION (API Fetch + Socket Listen) ---
  useEffect(() => {
    if (!classId) return;

    const loadInitialChat = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/messages/class/${classId}`);
        if (res.data.success) {
          const formatted = res.data.data.map(msg => ({
            _id: msg._id,
            sender: msg.user?.name || "Neural_Node",
            senderId: msg.user?._id || msg.user,
            text: msg.message || msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error("❌ CHAT_HYDRATION_ERROR: Telemetry node unreachable.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialChat();

    // --- 2. SOCKET PROTOCOL SETUP (FIXED) ---
    connectSocket(); // Make sure connection is initiated
    const socket = getSocket();

    if (!socket) return; // Guard clause

    const setupSocket = () => {
      setIsConnected(true); // Force true when connected
      socket.emit("join_class", classId);
    };

    if (socket.connected) setupSocket();
    
    socket.on("connect", setupSocket);
    socket.on("disconnect", () => setIsConnected(false));

    // 📩 LIVE Signal Processor
    const handleReceiveMessage = (msg) => {
      if (msg.classId === classId) {
        setMessages((prev) => {
          if (prev.some(m => m._id === msg._id)) return prev;
          
          const newMsgObj = {
            _id: msg._id,
            senderId: msg.user?._id || msg.senderId || msg.user,
            sender: msg.user?.name || msg.senderName || msg.sender || "ID_NODE",
            text: msg.message || msg.text,
            time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return [...prev, newMsgObj];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("connect", setupSocket);
      socket.off("disconnect");
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [classId]);

  // --- 3. AUTO-SCROLL PROTOCOL ---
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 4. SIGNAL TRANSMISSION (FIXED) ---
  const sendMessage = async (e) => {
    e.preventDefault();
    
    // 🔥 FIX: Check both _id and id safely
    const currentUserId = user?._id || user?.id; 
    
    if (!newMessage.trim() || !currentUserId || !isConnected) {
      console.warn("⚠️ Cannot send: Check connection or text.", { isConnected, hasUserId: !!currentUserId });
      return;
    }

    const messageData = {
      classId,
      senderName: user.name,
      senderId: currentUserId,
      text: newMessage.trim()
    };

    const socket = getSocket();
    if (socket) {
      socket.emit("send_message", messageData);
      setNewMessage(""); // Clear input immediately
    }
  };

  if (!user) return null;

  return (
    <div className="glass rounded-[3rem] border-2 border-slate-800 flex flex-col h-full overflow-hidden shadow-3xl bg-slate-950/20 backdrop-blur-3xl">
      {/* 📡 HEADER NODES */}
      <header className="p-6 border-b-2 border-slate-800 bg-slate-950/60 flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isConnected ? 'bg-blue-600/10 text-blue-500' : 'bg-red-600/10 text-red-500'} transition-all duration-500`}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Neural Stream</h3>
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
               <p className="text-[8px] font-black text-slate-500 tracking-[0.2em] uppercase">
                 {isConnected ? 'Link_Active' : 'Link_Offline'}
               </p>
            </div>
          </div>
        </div>
      </header>

      {/* 📥 MESSAGE STREAM */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-transparent to-blue-900/5">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Syncing_Telemetry...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = String(msg.senderId) === String(user._id || user.id);
            return (
              <div key={msg._id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <span className="text-[8px] font-black text-slate-600 uppercase mb-1 px-2 italic tracking-widest">
                  {isMe ? "MASTER_NODE" : msg.sender} • {msg.time}
                </span>
                <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm font-bold border-2 shadow-lg ${
                  isMe 
                  ? "bg-blue-600 border-blue-400/30 text-white rounded-tr-none shadow-blue-900/20" 
                  : "bg-slate-900 border-slate-800 text-slate-200 rounded-tl-none shadow-black/40"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center opacity-10">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">No_Signals_Detected</p>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 📤 TRANSMIT CONSOLE */}
      <form onSubmit={sendMessage} className="p-4 bg-slate-950/80 border-t-2 border-slate-800 backdrop-blur-md">
        <div className="relative group">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected}
            placeholder={isConnected ? "Transmit signal..." : "Reconnecting to Node..."}
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] pl-6 pr-16 py-4 text-white font-bold outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800/50 disabled:opacity-50 italic placeholder:text-slate-700"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || !isConnected}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 p-3 rounded-xl text-white transition-all active:scale-90 shadow-lg shadow-blue-900/40"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;