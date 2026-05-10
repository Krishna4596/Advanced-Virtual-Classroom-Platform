/**
 * ============================================================
 * 🌌 TITAN NEURAL LANDING (v4.3 - Liquid Fluidity)
 * Ref: Report Section 3.7 (UI/UX Engineering & Branding)
 * Fixed: Fluid Typography (clamp), Adaptive Hero Sections,
 * Shrinkable Cards, and Mobile-First Footers.
 * ============================================================
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, BrainCircuit, Users, ArrowRight, Play, 
  Globe, Lock, Zap, Activity, Terminal
} from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-600/40 overflow-x-hidden font-sans scroll-smooth">
      
      {/* 🌌 NEURAL ATMOSPHERE: Dynamic Ambient Aura */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[100%] md:w-[70%] h-[70%] bg-blue-600/10 blur-[100px] md:blur-[200px] rounded-full animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] md:w-[70%] h-[70%] bg-indigo-600/10 blur-[100px] md:blur-[200px] rounded-full animate-pulse [animation-delay:3s] duration-[12s]"></div>
      </div>

      {/* 🏗️ INDUSTRIAL NAVIGATION PROTOCOL */}
      <nav className="relative z-50 flex justify-between items-center px-4 sm:px-6 md:px-12 py-6 md:py-12 max-w-[1800px] mx-auto backdrop-blur-md">
        <div className="flex items-center gap-3 md:gap-6 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-600 rounded-xl md:rounded-[1.8rem] flex items-center justify-center font-black text-xl md:text-4xl shadow-[0_0_30px_rgba(37,99,235,0.3)] md:shadow-[0_0_40px_rgba(37,99,235,0.3)] group-hover:rotate-12 transition-all duration-500 shrink-0">V</div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter uppercase italic leading-none truncate">AVCP</span>
            <span className="text-[7px] sm:text-[8px] md:text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-1 sm:mt-2 italic opacity-80 truncate">Neural_Core_v4.3</span>
          </div>
        </div>
        
        <div className="flex gap-4 sm:gap-6 md:gap-12 items-center shrink-0">
            <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
               <a href="#architecture" className="hover:text-blue-500 transition-all border-b-2 border-transparent hover:border-blue-500 pb-1">Architecture</a>
               <a href="#security" className="hover:text-blue-500 transition-all border-b-2 border-transparent hover:border-blue-500 pb-1">Protocols</a>
            </div>
            <Link 
              to="/login" 
              className="bg-white text-black px-5 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-3xl active:scale-95 italic"
            >
              Access <span className="hidden sm:inline">Portal</span>
            </Link>
        </div>
      </nav>

      {/* 🚀 TITAN HERO: The Neural Learning Framework */}
      {/* 🔥 FIX: Responsive top padding for mobile */}
      <section className="relative z-10 pt-12 sm:pt-20 md:pt-32 pb-24 sm:pb-32 md:pb-64 px-4 sm:px-6 flex flex-col items-center text-center max-w-[1600px] mx-auto">
        <div className="inline-flex items-center justify-center gap-2 sm:gap-4 bg-blue-600/10 border-2 border-blue-500/20 text-blue-500 px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-[8px] sm:text-[9px] md:text-xs font-black uppercase tracking-widest sm:tracking-[0.5em] mb-8 sm:mb-12 md:mb-16 animate-in fade-in slide-in-from-top-10 duration-1000 w-full sm:w-auto break-words">
           <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0"/> <span className="truncate">Node_Status: Link_Verified</span>
        </div>
        
        {/* 🔥 FIX: clamp() ensures text never breaks out of mobile screens, but stays massive on 4K */}
        <h1 className="text-[clamp(3rem,9vw,11rem)] font-black mb-6 sm:mb-12 md:mb-16 leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl px-2">
          Neural <span className="text-blue-600">Learning</span> <br className="hidden md:block"/> 
          Framework<span className="text-blue-600 animate-pulse">.</span>
        </h1>
        
        {/* 🔥 FIX: Text scales smoothly on mobile */}
        <p className="mb-10 sm:mb-16 md:mb-24 text-slate-500 text-[clamp(1rem,3vw,3rem)] max-w-6xl font-medium leading-[1.3] md:leading-[1.1] tracking-tight px-4 sm:px-6 italic">
          Architecting the MERN ecosystem with <span className="text-white font-black">Real-Time Telemetry</span>, Biometric Verification, and Autonomous Classroom Handshaking.
        </p>

        {/* 🔥 FIX: Buttons Stack perfectly on mobile, row on tablet/desktop */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 w-full sm:w-auto px-4 sm:px-6 relative">
          <Link 
            to="/register" 
            className="group w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 sm:px-12 md:px-20 py-5 sm:py-7 md:py-10 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] font-black uppercase tracking-widest sm:tracking-[0.4em] text-[10px] sm:text-xs md:text-sm transition-all shadow-[0_15px_40px_rgba(37,99,235,0.3)] md:shadow-[0_20px_80px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 sm:gap-5 active:scale-95 italic"
          >
            Deploy Node <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 sm:group-hover:translate-x-3 transition-transform duration-500 shrink-0" strokeWidth={3} />
          </Link>
          <Link 
            to="/login" 
            className="group w-full sm:w-auto bg-slate-900/40 backdrop-blur-3xl border-2 border-slate-800 hover:border-blue-500/40 text-white px-8 sm:px-12 md:px-20 py-5 sm:py-7 md:py-10 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] font-black uppercase tracking-widest sm:tracking-[0.4em] text-[10px] sm:text-xs md:text-sm transition-all flex items-center justify-center gap-3 sm:gap-5 active:scale-95 italic"
          >
            <Play fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:scale-110 transition-transform shrink-0"/> Terminal Sync
          </Link>
        </div>
      </section>

      {/* 📊 CORE ARCHITECTURE: System Modules */}
      {/* 🔥 FIX: Gap and padding reductions for mobile */}
      <section id="architecture" className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-16 pb-24 sm:pb-40 md:pb-72">
        <FeatureCard 
          icon={<Globe className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500"/>}
          title="Node Sync"
          desc="Low-latency WebRTC and Socket.io handshaking for real-time telemetry exchange across institutional clusters."
        />
        <FeatureCard 
          icon={<Activity className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500"/>}
          title="Deep Analytics"
          desc="Automated attendance monitoring and predictive engagement modeling via neural performance dossiers."
        />
        <FeatureCard 
          icon={<Lock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-emerald-500"/>}
          title="Secure Link"
          desc="Military-grade JWT verification and role-based guardrails ensuring 100% data integrity within the AVCP node."
        />
      </section>

      {/* 🏁 INDUSTRIAL FOOTER PROTOCOL */}
      <footer className="relative z-50 border-t-2 border-slate-900 py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#01040a]/80 backdrop-blur-3xl">
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 sm:gap-12 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-5 md:gap-8 opacity-60 md:opacity-40 group hover:opacity-100 transition-all duration-700 w-full lg:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center font-black border border-white/5 text-lg sm:text-xl shrink-0">V</div>
              <div className="flex flex-col text-left">
                <span className="font-black text-lg sm:text-xl md:text-2xl uppercase tracking-tighter italic text-white truncate">AVCP / Neural_Core</span>
                <span className="text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.5em] text-blue-500 mt-1 sm:mt-2 truncate">Node_Status: Online</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
               {/* Fixed padding inside the tag for smaller screens */}
               <div className="p-1 bg-slate-900 rounded-full flex items-center justify-between sm:justify-start gap-3 sm:gap-4 pr-3 sm:pr-6 border border-white/5 shadow-inner w-full sm:w-auto">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0"><Terminal className="w-3 h-3 sm:w-4 sm:h-4"/></div>
                  <p className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest sm:tracking-[0.4em] italic leading-none truncate flex-1 text-center sm:text-left">
                    © 2026 Krishna Prajapat
                  </p>
               </div>
               <div className="flex items-center gap-2 sm:gap-3 justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0"></div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest italic truncate">MERN_Stack_Architecture_Verified</span>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-14 text-[9px] sm:text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest sm:tracking-[0.3em] italic w-full lg:w-auto items-center">
              <span className="hover:text-blue-500 cursor-pointer transition-colors border-b border-transparent hover:border-blue-500 pb-1">Documentation</span>
              <span className="hover:text-blue-500 cursor-pointer transition-colors border-b border-transparent hover:border-blue-500 pb-1">Privacy_Vault</span>
            </div>
        </div>
      </footer>
    </div>
  );
}

// 🔥 FIX: Smooth scaling on the paddings and text sizes for mobile
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass p-8 sm:p-12 md:p-16 lg:p-20 rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] border-2 border-slate-900 hover:border-blue-500/30 transition-all duration-1000 group shadow-[0_0_40px_rgba(0,0,0,0.5)] lg:hover:-translate-y-6 relative overflow-hidden bg-slate-950/40 flex flex-col items-center md:items-start text-center md:text-left">
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-600/5 blur-2xl sm:blur-3xl -z-10 group-hover:bg-blue-600/10 transition-all duration-1000"></div>
      
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.8rem] flex items-center justify-center mb-6 sm:mb-10 md:mb-14 border-2 border-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-inner group-hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] shrink-0">
        {React.cloneElement(icon, { strokeWidth: 2 })}
      </div>
      <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6 md:mb-8 leading-none italic group-hover:text-blue-400 transition-colors duration-700 w-full truncate">{title}</h3>
      <p className="text-slate-600 text-sm sm:text-base md:text-xl font-medium leading-relaxed italic group-hover:text-slate-300 transition-colors duration-700 tracking-tight max-w-[280px] sm:max-w-none mx-auto md:mx-0">{desc}</p>
    </div>
  );
}

export default Landing;