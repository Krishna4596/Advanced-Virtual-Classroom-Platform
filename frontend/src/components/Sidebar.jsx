/**
 * ============================================================
 * 📑 TITAN NEURAL SIDEBAR (v4.4 - Teacher Task Link Patch)
 * Ref: Report Section 3.7 (Accessibility & Routing)
 * Purpose: Global navigation hub with real-time UI scaling.
 * Added: Teacher Tasks (Grading Hub) route to menuMap.
 * ============================================================
 */

import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  BrainCircuit, 
  Users, 
  Calendar, 
  LogOut, 
  ChevronRight,
  Zap,
  Settings,
  Eye,
  Activity
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { highContrast, setHighContrast, fontSize, setFontSize } = useContext(AccessibilityContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  // 🛰️ Navigation Matrix Scoping
  const menuMap = {
    teacher: [
      { name: "Console", path: "/teacher", icon: <LayoutDashboard size={22}/> },
      { name: "Grades", path: "/grading-center", icon: <ClipboardList size={22}/> },
      // 🔥 NEW: Added Tasks for Teacher
      { name: "Tasks", path: "/teacher/assignments", icon: <Zap size={22}/> },
      { name: "AI Stats", path: "/teacher/analytics", icon: <BrainCircuit size={22}/> },
    ],
    student: [
      { name: "Hub", path: "/student", icon: <LayoutDashboard size={22}/> },
      { name: "Courses", path: "/student/courses", icon: <BookOpen size={22}/> },
      { name: "Tasks", path: "/my-tasks", icon: <Zap size={22}/> },
    ],
    parent: [
      { name: "Home", path: "/parent", icon: <Users size={22}/> },
      { name: "Logs", path: "/parent/attendance", icon: <Calendar size={22}/> },
    ]
  };

  const menuItems = menuMap[user.role] || [];

  return (
    <>
      {/* 💻 DESKTOP NEURAL INTERFACE */}
      <aside 
        className={`hidden lg:flex w-80 h-screen fixed left-0 top-0 flex-col z-[100] transition-all duration-500 shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${
          highContrast ? 'bg-black border-r-4 border-yellow-500' : 'bg-[#020617] border-r-2 border-slate-800'
        }`}
      >
        <div className={`absolute top-0 left-0 w-full h-64 opacity-20 blur-[100px] -z-10 ${highContrast ? 'bg-yellow-500/10' : 'bg-blue-600/10'}`}></div>

        {/* 🏢 Brand Identity Handshake */}
        <div className="p-10 pb-6">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => navigate("/")}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all shadow-2xl ${highContrast ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white shadow-blue-600/30 group-hover:rotate-12'}`}>V</div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tighter uppercase italic leading-none ${highContrast ? 'text-yellow-500' : 'text-white'}`}>AVCP</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.4em] mt-2 italic ${highContrast ? 'text-yellow-500' : 'text-blue-500'}`}>Institutional Node</span>
            </div>
          </div>
        </div>

        {/* 👤 Identity Cluster */}
        <div className="px-8 mb-6">
          <div className={`p-4 rounded-[1.8rem] border-2 flex items-center gap-4 transition-colors ${highContrast ? 'bg-black border-yellow-500' : 'bg-slate-900/60 border-slate-800/50'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 shadow-inner uppercase ${highContrast ? 'bg-yellow-500 text-black border-black' : 'bg-slate-800 text-blue-500 border-slate-700'}`}>
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-black truncate uppercase tracking-tight ${highContrast ? 'text-yellow-500' : 'text-white'}`}>{user.name}</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{user.role} Instance</p>
            </div>
          </div>
        </div>

        {/* 🛠️ ACCESSIBILITY PARAMETERS */}
        <div className={`px-8 mb-4 space-y-4 border-y py-6 ${highContrast ? 'bg-yellow-500/5 border-yellow-500/50' : 'bg-slate-900/20 border-slate-800/50'}`}>
          <p className={`text-[8px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2 ${highContrast ? 'text-yellow-500' : 'text-slate-500'}`}>
            <Settings size={12} className={highContrast ? 'animate-spin-slow' : ''}/> User Accessibility
          </p>
          
          {/* Contrast Handshake */}
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-300 active:scale-95 ${highContrast ? 'bg-yellow-500 text-black border-white' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
               <Eye size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest italic">Contrast</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${highContrast ? 'bg-black animate-pulse shadow-[0_0_8px_black]' : 'bg-slate-700'}`}></div>
          </button>

          {/* Neural Scaling (Font) */}
          <div className="flex items-center gap-4 px-1 mt-3">
            <button onClick={() => setFontSize(Math.max(100, fontSize - 10))} className={`p-2.5 rounded-xl text-xs font-black transition-all border ${highContrast ? 'bg-black border-yellow-500 text-yellow-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>-A</button>
            <div className="flex-1 h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${highContrast ? 'bg-yellow-500' : 'bg-blue-600'}`} style={{ width: `${((fontSize - 100) / 25) * 100}%` }}></div>
            </div>
            <button onClick={() => setFontSize(Math.min(125, fontSize + 10))} className={`p-2.5 rounded-xl text-xs font-black transition-all border ${highContrast ? 'bg-black border-yellow-500 text-yellow-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>+A</button>
          </div>
        </div>

        {/* 📑 NAVIGATION STREAM */}
        <nav className="flex-1 px-8 space-y-3 overflow-y-auto custom-scrollbar pt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group ${
                  isActive 
                  ? highContrast ? "bg-yellow-500 text-black scale-105" : "bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-2" 
                  : "text-slate-500 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className={`transition-transform duration-500 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-blue-400"}`}>{item.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                </div>
                {isActive && <Activity size={14} className="animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* 🏁 SYSTEM ACTIONS (Config & Terminate) */}
        <div className="p-8 mt-auto border-t-2 border-slate-800/50 flex flex-col gap-3">
          
          {/* 🔥 NEW: NODE CONFIG BUTTON */}
          <Link 
            to="/settings" 
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border active:scale-95 ${
              location.pathname === "/settings"
              ? highContrast ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
              : highContrast ? 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Settings size={18} /> Node Config
          </Link>

          {/* TERMINATE BUTTON */}
          <button 
            onClick={() => { logout(); navigate("/login"); }} 
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border active:scale-95 ${
              highContrast ? 'bg-yellow-500 text-black border-white' : 'bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600 hover:text-white shadow-lg shadow-red-600/10'
            }`}
          >
            <LogOut size={18} strokeWidth={3} /> Terminate
          </button>
        </div>
      </aside>

      {/* 📱 MOBILE NAVIGATION CLUSTER */}
      <nav className={`lg:hidden fixed bottom-0 left-0 w-full z-[150] px-2 py-3 flex justify-around items-center backdrop-blur-3xl border-t-2 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transition-colors duration-500 ${
        highContrast ? 'bg-black border-yellow-500' : 'bg-[#020617]/95 border-white/5'
      }`}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
                isActive ? highContrast ? "text-yellow-500 scale-110" : "text-blue-500 scale-110 bg-blue-600/10" : "text-slate-600"
              }`}
            >
              {item.icon}
              <span className="text-[8px] font-black uppercase tracking-widest italic hidden sm:block">{item.name}</span>
            </Link>
          );
        })}
        
        {/* 🔥 NEW: MOBILE NODE CONFIG */}
        <Link 
          to="/settings" 
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
            location.pathname === "/settings" ? highContrast ? "text-yellow-500 scale-110" : "text-blue-500 scale-110 bg-blue-600/10" : "text-slate-600"
          }`}
        >
          <Settings size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest italic hidden sm:block">Config</span>
        </Link>

        {/* TERMINATE MOBILE */}
        <button 
          onClick={() => { logout(); navigate("/login"); }} 
          className="flex flex-col items-center gap-1 p-2 text-red-600/60 hover:text-red-500 transition-colors"
        >
          <LogOut size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest italic hidden sm:block">Exit</span>
        </button>
      </nav>
    </>
  );
}

export default Sidebar;