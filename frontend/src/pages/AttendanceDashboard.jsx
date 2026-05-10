/**
 * ============================================================
 * 📡 TITAN ATTENDANCE TELEMETRY HUB (v4.6 - Liquid UI)
 * Ref: Fully Fluid Grid, Mobile-Adaptive Overlays,
 * Truncated Text Handlers, and Shrinkable Paddings.
 * ============================================================
 */

import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import { getSocket, connectSocket } from "../socket/socket";
import StudentReport from "../components/StudentReport";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { 
  Users, 
  FileSpreadsheet, 
  Clock, 
  Activity,
  ShieldCheck,
  Zap,
  ChevronRight,
  Database,
  Heart
} from "lucide-react";

function AttendanceDashboard({ classId }) {
  const [attendance, setAttendance] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = useCallback(async () => {
    if (!classId) return;
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/attendance/class/${classId}`);
      const allRegisters = res.data?.data || [];
      
      const latestRegister = allRegisters.length > 0 ? allRegisters[0].records : [];
      setAttendance(latestRegister);

    } catch (err) {
      console.error("❌ TELEMETRY_SYNC_FAILURE:", err);
      setError("Bio-metric node failed to sync live records.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (!classId) return;

    fetchAttendance();
    connectSocket();
    const socket = getSocket();

    if (socket) {
      socket.emit("join_class", classId);
      socket.on("attendance_updated", fetchAttendance);
    }

    return () => {
      if (socket) socket.off("attendance_updated", fetchAttendance);
    };
  }, [classId, fetchAttendance]);

  const handleExport = () => {
    const exportUrl = `${import.meta.env.VITE_BACKEND_API || 'http://localhost:5000'}/api/export/attendance/${classId}`;
    window.open(exportUrl, "_blank");
  };

  if (!classId) return null;

  return (
    // 🔥 FIX: Scaled down spacing and padding for mobile
    <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-700 selection:bg-emerald-500/30 text-slate-200 pb-16 sm:pb-20 max-w-[1900px] mx-auto px-4 sm:px-6 md:px-0">
      
      {/* 🏛️ COMMAND CENTER HEADER */}
      {/* 🔥 FIX: Padding responsive handling and Stacked flex for button */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center glass p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3.5rem] md:rounded-[4.5rem] border-2 border-slate-900 relative overflow-hidden group shadow-[0_0_80px_rgba(37,99,235,0.05)] bg-[#020617]/40 backdrop-blur-3xl">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-blue-600/5 blur-[80px] sm:blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-all duration-1000"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-6 sm:mb-8 xl:mb-0 w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600/10 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-blue-500 shadow-3xl border-2 border-blue-500/20 group-hover:scale-110 transition-transform duration-500 shrink-0">
            <Users className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2.5} />
          </div>
          <div className="space-y-2 sm:space-y-3 min-w-0">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none truncate">Live Roster</h2>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="relative shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full relative"></div>
                </div>
                <p className="text-[9px] md:text-xs text-slate-500 font-black uppercase tracking-widest sm:tracking-[0.4em] italic leading-none">Node_Sync_Status: ONLINE</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full xl:w-auto group bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-10 md:px-14 py-4 sm:py-6 md:py-7 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] font-black text-[9px] sm:text-xs uppercase tracking-widest sm:tracking-[0.3em] transition-all shadow-3xl flex items-center justify-center gap-3 sm:gap-5 active:scale-95 border-2 border-emerald-400/20 italic"
        >
          <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform shrink-0" /> <span className="truncate">Fetch Intelligence Dossier</span>
        </button>
      </div>

      {/* 📊 ROSTER STREAM GRID */}
      {loading ? (
        <div className="py-20 sm:py-40 flex flex-col items-center gap-6 sm:gap-8">
          <Loader />
          <p className="text-[9px] sm:text-[11px] font-black uppercase text-blue-500 tracking-widest sm:tracking-[0.8em] animate-pulse text-center">Scanning Bio-metric Neural Grid...</p>
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        // 🔥 FIX: 1 Col on Mobile, 2 on Tablet, 3 on Desktop
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
          {attendance.length > 0 ? (
            attendance.map((a, idx) => {
              if (!a.student) return null; 
              
              const isPresent = a.status === 'Present';
              const syncDuration = isPresent ? 45 : 0; 
              const consistency = isPresent ? 100 : 0;

              return (
                // 🔥 FIX: Dynamic scaling of card paddings
                <div 
                  key={a.student._id || idx} 
                  className="group bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3.5rem] md:rounded-[4.5rem] border-2 border-slate-900 hover:border-blue-500/30 transition-all duration-700 relative overflow-hidden shadow-2xl hover:-translate-y-2 sm:hover:-translate-y-3 flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-blue-600/5 blur-[60px] sm:blur-[80px] -z-10 group-hover:bg-blue-600/10 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-6 sm:mb-10 gap-4">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-900 rounded-[1.2rem] sm:rounded-[1.8rem] md:rounded-[2.2rem] flex items-center justify-center font-black text-xl sm:text-2xl md:text-4xl text-blue-500 border-2 border-slate-800 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 italic uppercase shrink-0">
                        {a.student.name?.charAt(0) || "S"}
                      </div>
                      <div className="space-y-1 sm:space-y-2 min-w-0">
                        <h4 
                          className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-2 sm:gap-3 italic leading-none truncate"
                          onClick={() => setSelectedStudent(a.student._id)}
                          title={a.student.name || "Member_Undef"}
                        >
                          {a.student.name || "Member_Undef"}
                        </h4>
                        <p className="text-[7px] sm:text-[8px] md:text-[10px] font-black text-slate-700 uppercase tracking-widest sm:tracking-[0.4em] italic truncate">INSTANCE_ID: {a.student._id?.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest shadow-2xl transition-all duration-500 shrink-0 ${
                      isPresent 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20 opacity-40'
                    }`}>
                      {a.status}
                    </div>
                  </div>

                  {/* 🔥 TITAN GUARDIAN PROTOCOL (The Parent Info Block) */}
                  <div className="mt-2 p-4 sm:p-5 bg-blue-600/5 rounded-[1.5rem] sm:rounded-[2.5rem] border border-blue-500/10 group-hover:bg-blue-600/10 transition-all duration-500">
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 fill-blue-500/20 shrink-0" />
                        <p className="text-[7px] sm:text-[8px] font-black text-blue-500 uppercase tracking-widest sm:tracking-[0.4em] italic leading-none truncate">Linked Guardian</p>
                      </div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse shrink-0"></div>
                    </div>
                    
                    <h5 className="text-xs sm:text-sm font-black text-white uppercase italic truncate tracking-tight" title={a.parentInfo?.name || "No Guardian Linked"}>
                      {a.parentInfo?.name || "No Guardian Linked"}
                    </h5>
                    
                    <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold truncate lowercase mt-1 opacity-70 italic group-hover:opacity-100 transition-opacity" title={a.parentInfo?.email || "awaiting_sync@node.sys"}>
                      {a.parentInfo?.email || "awaiting_sync@node.sys"}
                    </p>
                  </div>

                  {/* 🔥 FIX: Adaptive Grid for metrics */}
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                     <div className="bg-slate-950 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-900 group-hover:border-blue-500/10 transition-colors shadow-inner flex flex-col justify-center">
                        <p className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-slate-600 uppercase mb-2 sm:mb-3 tracking-widest sm:tracking-widest italic leading-none truncate">Node_Entry</p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0"/>
                          <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-200 italic truncate">
                            {isPresent ? "SYNCED" : "OFFLINE"}
                          </p>
                        </div>
                     </div>
                     <div className="bg-slate-950 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-900 group-hover:border-yellow-500/10 transition-colors shadow-inner flex flex-col justify-center">
                        <p className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-slate-600 uppercase mb-2 sm:mb-3 tracking-widest sm:tracking-widest italic leading-none truncate">Sync_Time</p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 shrink-0"/>
                          <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-200 italic truncate">{syncDuration} <span className="text-[8px] sm:text-[10px] text-slate-700 font-black">MIN</span></p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center px-1 sm:px-2">
                       <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest sm:tracking-[0.4em] italic truncate">Consistency_Matrix</span>
                       <span className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-blue-500 uppercase tracking-widest ml-2">{consistency}%</span>
                    </div>
                    {/* Thinner progress bar on mobile */}
                    <div className="w-full bg-slate-900 h-2 sm:h-3 md:h-4 rounded-full overflow-hidden p-0.5 sm:p-1 border border-white/5 shadow-2xl">
                      <div 
                        className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${isPresent ? 'bg-gradient-to-r from-emerald-600 to-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-slate-800'}`}
                        style={{ width: `${consistency}%` }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedStudent(a.student._id)}
                    className="w-full mt-auto pt-6 sm:pt-10 py-5 sm:py-6 md:py-7 bg-slate-900/50 hover:bg-blue-600 hover:text-white border-2 border-slate-900 hover:border-blue-400 rounded-2xl sm:rounded-[2.5rem] text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-widest sm:tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-3 sm:gap-4 group/btn shadow-3xl italic"
                  >
                    Access Bio-Dossier <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 sm:group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-24 sm:py-48 px-4 text-center border-4 border-dashed border-slate-900 rounded-[3rem] sm:rounded-[4rem] md:rounded-[6rem] group hover:border-blue-500/10 transition-all flex flex-col items-center justify-center gap-8 sm:gap-10">
              <div className="relative">
                <Database className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] text-slate-900 group-hover:scale-110 transition-transform duration-1000" strokeWidth={1} />
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 absolute -top-2 sm:-top-4 -right-2 sm:-right-4 text-blue-500/20 animate-pulse" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-slate-700 font-black uppercase tracking-[0.5em] sm:tracking-[0.8em] text-xs sm:text-sm md:text-lg italic">Awaiting Neural Link</p>
                <p className="text-slate-800 font-bold uppercase text-[8px] sm:text-[10px] md:text-xs tracking-widest sm:tracking-[0.4em] max-w-md px-6">Student telemetry will materialize here upon node authentication.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📑 SUB-ROUTINE: Detailed Intelligence Overlay */}
      {selectedStudent && (
        // 🔥 FIX: Modal overflow safety and padding
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-10 bg-[#020617]/98 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto">
          <div className="max-w-6xl w-full relative animate-in zoom-in-95 duration-500 shadow-[0_0_150px_rgba(0,0,0,0.9)] rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] border-2 border-white/5 bg-[#020617] my-auto">
            <StudentReport
              classId={classId}
              studentId={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          </div>
        </div>
      )}

      {/* 📡 AUDIT FOOTER */}
      <div className="pt-10 sm:pt-20 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 opacity-30 border-t border-slate-900 pb-10 sm:pb-20 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 w-full md:w-auto">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0"/>
            <span className="text-[8px] sm:text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest sm:tracking-[0.5em] truncate">Neural Encryption Key: VERIFIED_V4.6</span>
          </div>
          <span className="text-[8px] sm:text-[9px] md:text-[11px] font-black text-slate-700 uppercase tracking-widest sm:tracking-[1em] italic">TITAN ATTENDANCE PROTOCOL</span>
      </div>
    </div>
  );
}

export default AttendanceDashboard;