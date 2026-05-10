/**
 * ============================================================
 * 🏗️ TITAN MASTER DASHBOARD ENGINE (v5.2 - Navigation Patch)
 * Ref: Fully Responsive for 4K Monitors to iPhone SE.
 * Merged: Accessibility + Hamburger Navigation.
 * Added: Global "Node_Config" (Settings) route above Kill_Session.
 * Added: Teacher Tasks link to Navigation menu.
 * ============================================================
 */

import React, { useState, useEffect, useContext, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, LayoutDashboard, BookOpen, FileText, 
  Calendar, LogOut, ChevronRight, ShieldCheck, X, Zap, Activity, Eye, Settings
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { AccessibilityContext } from "../context/AccessibilityContext";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  
  // Accessibility Context
  const { highContrast, setHighContrast, fontSize, setFontSize } = useContext(AccessibilityContext) || { highContrast: false, fontSize: 100, setHighContrast: ()=>{}, setFontSize: ()=>{} };
  
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = useMemo(() => {
    const base = {
      teacher: [
        { name: "Console", path: "/teacher", icon: <LayoutDashboard size={20} /> },
        { name: "Nodes", path: "/teacher/classes", icon: <BookOpen size={20} /> },
        { name: "Attendance", path: "/teacher/attendance", icon: <Calendar size={20} /> }, 
        { name: "Grading", path: "/grading-center", icon: <FileText size={20} /> }, 
        // 🔥 NEW: Teacher ke liye GlobalAssignments wala Tasks link
        { name: "Tasks", path: "/teacher/assignments", icon: <Zap size={20} /> }, 
        { name: "Analytics", path: "/teacher/analytics", icon: <Activity size={20} /> },
      ],
      student: [
        { name: "Hub", path: "/student", icon: <LayoutDashboard size={20} /> },
        { name: "Streams", path: "/student/classes", icon: <BookOpen size={20} /> },
        { name: "Tasks", path: "/my-tasks", icon: <Zap size={20} /> },
      ],
      parent: [
        { name: "Overview", path: "/parent", icon: <LayoutDashboard size={20} /> },
        { name: "Attendance", path: "/parent/attendance", icon: <Calendar size={20} /> },
        { name: "Grading", path: "/parent/grades", icon: <FileText size={20} /> },
      ]
    };
    return base[user?.role] || [];
  }, [user?.role]);

  return (
    <div className={`flex h-[100dvh] w-full overflow-x-hidden selection:bg-blue-500/30 font-sans antialiased ${highContrast ? 'bg-black text-white' : 'bg-[#020617] text-slate-200'}`} style={{ fontSize: `${fontSize}%` }}>
      
      {/* 📱 MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🧭 SIDEBAR (Responsive) */}
      <aside 
        className={`fixed lg:relative top-0 left-0 z-[130] w-[280px] h-[100dvh] flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${highContrast ? 'bg-black border-r-2 border-yellow-500' : 'bg-[#01040a] border-r border-slate-900/50'}`}
      >
        
        {/* BRANDING */}
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/${user?.role}`)}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg transition-transform group-hover:rotate-12 ${highContrast ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'}`}>V</div>
            <div className="flex flex-col">
              <h2 className={`text-xl font-black tracking-tighter uppercase italic leading-none ${highContrast ? 'text-yellow-500' : 'text-white'}`}>AVCP</h2>
              <span className={`text-[9px] font-bold uppercase tracking-[0.3em] mt-1 ${highContrast ? 'text-yellow-500' : 'text-blue-500'}`}>Neural_Core</span>
            </div>
          </div>
          <button className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* PROFILE CHIP */}
        <div className="px-6 mb-4 shrink-0">
           <div className={`p-3 rounded-2xl border flex items-center gap-3 ${highContrast ? 'bg-black border-yellow-500/50' : 'bg-slate-900/30 border-slate-800/50'}`}>
              <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-black border ${highContrast ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-slate-950 text-blue-500 border-slate-800'}`}>
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate uppercase">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck size={10} className={highContrast ? 'text-yellow-500' : 'text-blue-500'}/>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{user?.role}_SYNC</span>
                </div>
              </div>
           </div>
        </div>

        {/* ACCESSIBILITY TOGGLE */}
        <div className="px-6 mb-4 shrink-0">
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 active:scale-95 ${highContrast ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-2">
               <Eye size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest italic">High Contrast</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${highContrast ? 'bg-black animate-pulse' : 'bg-slate-700'}`}></div>
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-6">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-4 mb-3 mt-2 opacity-60 italic">Protocols</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                  ? highContrast ? "bg-yellow-500 text-black shadow-lg" : "bg-blue-600/10 border border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                  : "text-slate-500 border border-transparent hover:bg-slate-900/50 hover:text-slate-300"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className={`shrink-0 transition-transform ${highContrast && 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="font-bold text-[10px] uppercase tracking-widest">{item.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* SYSTEM ACTIONS (Node Config + Kill Session) */}
        <div className={`p-5 shrink-0 border-t flex flex-col gap-3 ${highContrast ? 'border-yellow-500/30' : 'border-slate-900/50'}`}>
          
          {/* ⚙️ NODE CONFIG / SETTINGS BUTTON */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                ? highContrast ? "bg-yellow-500 text-black shadow-lg" : "bg-blue-600/10 border border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                : "text-slate-500 border border-transparent hover:bg-slate-900/50 hover:text-slate-300"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className={`shrink-0 transition-transform ${highContrast && 'group-hover:scale-110'}`}><Settings size={18} /></span>
              <span className="font-bold text-[10px] uppercase tracking-widest">Node_Config</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>

          {/* 🚪 LOGOUT BUTTON */}
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all font-black text-[9px] uppercase tracking-widest border border-red-500/20 active:scale-95">
            <LogOut size={16} /> Kill_Session
          </button>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] relative overflow-hidden">
        
        {/* TOP HEADER */}
        <header className={`h-16 md:h-20 backdrop-blur-xl px-4 sm:px-8 flex justify-between items-center sticky top-0 z-[90] shrink-0 ${highContrast ? 'bg-black/90 border-b border-yellow-500/50' : 'bg-[#020617]/80 border-b border-slate-900/50'}`}>
          <div className="flex items-center gap-4">
            <button className={`lg:hidden p-2.5 rounded-xl border transition-colors ${highContrast ? 'bg-black border-yellow-500 text-yellow-500' : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'}`} onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-black uppercase italic tracking-tighter ${highContrast ? 'text-yellow-500' : 'text-white'}`}>Terminal_View</h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest opacity-80">Link: Stable</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className={`text-[11px] font-black uppercase italic truncate max-w-[120px] ${highContrast ? 'text-yellow-500' : 'text-white'}`}>{user?.name}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Operator</p>
              </div>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black cursor-pointer hover:scale-105 transition-transform ${highContrast ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-slate-900 border-slate-800 text-blue-500'}`} onClick={() => navigate('/settings')}>
                {user?.name?.[0] || 'U'}
              </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar scroll-smooth">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none fixed"></div>
          
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full h-full">
             {/* Animations & Children Render */}
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out h-full">
               {children}
             </div>
          </div>
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;