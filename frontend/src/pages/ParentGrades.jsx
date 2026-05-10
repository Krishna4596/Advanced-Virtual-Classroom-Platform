/**
 * ============================================================
 * 👨‍👩‍👦 TITAN GUARDIAN: Grade Viewer (v5.1 - Liquid Responsive)
 * Upgrades: Fluid Card Paddings, Dynamic Text Scaling, 
 * Mobile-First Grid Adjustments, Anti-Overflow.
 * ============================================================
 */

import React, { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { Award, BookOpen, User, ChevronRight, AlertTriangle } from "lucide-react";

function ParentGrades() {
  const { user } = useContext(AuthContext);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenList, setChildrenList] = useState([]);

  // Fetch children linked to parent, then fetch grades for the first child
  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentRes = await API.get("/parent/dashboard");
        // Supporting different backend API structures
        const kids = parentRes.data?.data?.children || parentRes.data?.children || [];
        setChildrenList(kids);

        if (kids.length > 0) {
          const firstChildId = kids[0].childId || kids[0]._id;
          setSelectedChild(firstChildId);
          fetchChildGrades(firstChildId);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchChildGrades = async (childId) => {
    try {
      const gradesRes = await API.get(`/grades/${childId}`);
      setGrades(gradesRes.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch grades", err);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChildChange = (e) => {
    const childId = e.target.value;
    setSelectedChild(childId);
    setLoading(true);
    fetchChildGrades(childId);
  };

  // 🔥 Helper: Selected child ka naam dhoondhne ke liye
  const getActiveChildName = () => {
    const activeChild = childrenList.find(c => c.childId === selectedChild || c._id === selectedChild);
    return activeChild?.childName || activeChild?.name || "Student Node";
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    // 🔥 FIX: Adjusted spacing for mobile (space-y-6 instead of 10)
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700">
      
      {/* 📱 HEADER: Stack perfectly on mobile, side-by-side on desktop */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-b border-slate-800 pb-4 sm:pb-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-xl sm:rounded-2xl border border-yellow-500/30 text-yellow-500 shrink-0">
            <Award size={28} className="sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-white">Merit Index</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">Academic Telemetry Sync</p>
          </div>
        </div>

        {/* Child Selector (If parent has multiple kids) */}
        {childrenList.length > 0 && (
          <select 
            onChange={handleChildChange} 
            value={selectedChild || ""}
            className="input-neural text-xs w-full sm:max-w-xs !py-3 !rounded-xl border-yellow-500/30 focus:border-yellow-500 bg-slate-900 text-white mt-2 sm:mt-0"
          >
            {childrenList.map(c => (
              <option key={c.childId || c._id} value={c.childId || c._id}>
                {c.childName || c.name || "Unknown"} Node
              </option>
            ))}
          </select>
        )}
      </header>

      {grades.length === 0 ? (
        <div className="text-center py-12 sm:py-20 border-2 border-dashed border-slate-800 rounded-[2rem] sm:rounded-3xl bg-slate-900/20 px-4">
          <AlertTriangle size={40} className="mx-auto text-slate-600 mb-4 sm:w-12 sm:h-12" />
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">No telemetry data found for this node.</p>
        </div>
      ) : (
        // 🔥 FIX: Responsive Grid Gap
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {grades.map((grade) => {
            const percentage = ((grade.score / grade.totalMarks) * 100).toFixed(1);
            const isExcellent = percentage >= 80;
            const displayStudentName = grade.studentName || grade.student?.name || getActiveChildName();

            return (
              // 🔥 FIX: Dynamic Padding (p-6 on mobile, p-8 on desktop) and Border Radius
              <div key={grade._id} className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-800 hover:border-yellow-500/30 transition-all group shadow-xl flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                  <div className="p-2.5 sm:p-3 bg-blue-600/10 rounded-xl text-blue-500"><User size={18} className="sm:w-5 sm:h-5"/></div>
                  <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border ${isExcellent ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                    {grade.examType}
                  </div>
                </div>

                {/* 🔥 STUDENT NAME AND SUBJECT SECTION */}
                <div className="mb-5 sm:mb-6 flex-1">
                  {/* Text scales down on mobile to prevent overflow */}
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic truncate" title={displayStudentName}>
                    {displayStudentName}
                  </h2>
                  <p className="text-[9px] sm:text-[10px] text-blue-400 uppercase tracking-widest font-bold mt-1">MODULE: {grade.subject}</p>
                </div>

                <div className="flex items-end gap-2 mb-5 sm:mb-6 shrink-0">
                  {/* Percentage text scaling (4xl on mobile, 5xl on desktop) */}
                  <span className={`text-4xl sm:text-5xl font-black tracking-tighter leading-none ${isExcellent ? 'text-yellow-500' : 'text-white'}`}>
                    {percentage}%
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">({grade.score}/{grade.totalMarks})</span>
                </div>

                <div className="bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 shrink-0">
                  <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Instructor Notes:</p>
                  <p className="text-[11px] sm:text-xs text-slate-300 italic line-clamp-3">"{grade.remarks}"</p>
                  <p className="text-[7px] sm:text-[8px] text-slate-600 uppercase tracking-widest font-bold mt-2 text-right">- {grade.teacher?.name || "Verified Auth"}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ParentGrades;