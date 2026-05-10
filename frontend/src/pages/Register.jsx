/**
 * ============================================================
 * 🛡️ TITAN NEURAL IDENTITY ENROLLMENT (v4.6 - Liquid UI)
 * Upgrade: Mobile-First Grid Adjustments, Fluid Paddings,
 * Responsive Action Buttons, and Typography Scaling.
 * ============================================================
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { 
  User, Mail, Lock, ShieldCheck, UserCircle, 
  Briefcase, Heart, ArrowRight, Zap, UserPlus, 
  Fingerprint, Eye, EyeOff 
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  
  const [childEmail, setChildEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedData = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
      name: formData.name.trim()
    };

    if (formData.role === "parent") {
      normalizedData.childEmail = childEmail.toLowerCase().trim();
    }

    try {
      const res = await API.post("/auth/register", normalizedData);
      if (res.data.success) {
        navigate("/verify-otp", { 
          state: { email: normalizedData.email, flow: "register" } 
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "🛑 Handshake Denied: Registration failed.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🔥 FIX: Global padding adjustments for mobile screens
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden selection:bg-blue-600/40 font-sans">
      
      {/* 🌌 Atmospheric Neural Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-25%] right-[-15%] w-[100%] md:w-[85%] h-[100%] md:h-[85%] bg-blue-600/5 blur-[80px] md:blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-25%] left-[-15%] w-[100%] md:w-[85%] h-[100%] md:h-[85%] bg-purple-600/5 blur-[80px] md:blur-[120px] rounded-full animate-pulse [animation-delay:3s]"></div>
      </div>

      <main className="w-full max-w-5xl z-10 animate-in fade-in zoom-in-95 duration-700 py-6 sm:py-10">
        {/* 🔥 FIX: Responsive paddings for the glass card */}
        <div className="glass rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] p-6 sm:p-10 md:p-20 border-2 border-blue-500/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:shadow-[0_50px_150px_rgba(0,0,0,0.7)] relative overflow-hidden group bg-slate-950/40 backdrop-blur-3xl">
          
          <header className="text-center mb-8 sm:mb-12 md:mb-20 mt-4 sm:mt-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-slate-950 border-2 border-blue-500/20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto mb-6 sm:mb-8 shadow-inner group-hover:scale-105 transition-all duration-700">
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" strokeWidth={2.5} />
            </div>
            {/* Fluid clamp for headline text */}
            <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-black text-white uppercase tracking-tighter leading-none italic">
              Initialize <span className="text-blue-600">Node</span>
            </h1>
            <p className="text-slate-500 text-[8px] sm:text-[9px] md:text-xs font-black uppercase tracking-widest sm:tracking-[0.5em] mt-4 sm:mt-6 italic">Secure Neural Identity Protocol</p>
          </header>

          {error && (
            <div className="bg-red-600/10 text-red-500 border border-red-500/20 p-4 sm:p-5 rounded-xl sm:rounded-[1.5rem] mb-6 sm:mb-10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-3 sm:gap-4 animate-in slide-in-from-top-4 text-left">
               <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0" />
               <span className="truncate break-words whitespace-normal">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8 md:space-y-12">
            
            {/* Input Grid adjusts automatically */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
              <div className="relative group/field">
                <User className="absolute left-5 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/field:text-blue-500 transition-all w-5 h-5 md:w-6 md:h-6" />
                <input
                  name="name"
                  type="text"
                  placeholder="FULL_LEGAL_NAME"
                  className="w-full pl-12 sm:pl-16 md:pl-28 pr-4 sm:pr-6 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] bg-slate-950/60 border-2 border-slate-800 focus:border-blue-600 text-base sm:text-lg md:text-xl font-black text-white placeholder:text-slate-900 placeholder:italic transition-all outline-none leading-none truncate"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative group/field">
                <Mail className="absolute left-5 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/field:text-blue-500 transition-all w-5 h-5 md:w-6 md:h-6" />
                <input
                  name="email"
                  type="email"
                  placeholder="INSTITUTIONAL_ID"
                  className="w-full pl-12 sm:pl-16 md:pl-28 pr-4 sm:pr-6 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] bg-slate-950/60 border-2 border-slate-800 focus:border-blue-600 text-base sm:text-lg md:text-xl font-black text-white placeholder:text-slate-900 placeholder:italic transition-all outline-none leading-none truncate"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 🔒 Password Field - Fixed Padding for icon */}
            <div className="relative group/field">
              <Lock className="absolute left-5 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/field:text-blue-500 transition-all w-5 h-5 md:w-6 md:h-6" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="SECURE_ACCESS_KEY"
                className="w-full pl-12 sm:pl-16 md:pl-28 pr-12 sm:pr-16 md:pr-24 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] bg-slate-950/60 border-2 border-slate-800 focus:border-blue-600 text-base sm:text-lg md:text-xl font-black text-white placeholder:text-slate-900 placeholder:italic transition-all outline-none leading-none truncate"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 sm:right-6 md:right-12 top-1/2 -translate-y-1/2 text-slate-700 hover:text-blue-500 transition-colors z-30 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5 md:w-6 md:h-6" /> : <Eye className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-slate-900">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.5em] text-slate-600 italic text-center md:text-left">Define Node Authority Level</p>
              
              {/* Role Selection Grid - 1 Col on small screens, 3 on larger */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { id: 'student', label: 'Agent', icon: <UserCircle className="w-6 h-6 sm:w-8 sm:h-8"/> },
                  { id: 'teacher', label: 'Instructor', icon: <Briefcase className="w-6 h-6 sm:w-8 sm:h-8"/> },
                  { id: 'parent', label: 'Guardian', icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8"/> }
                ].map((roleObj) => (
                  <button
                    key={roleObj.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: roleObj.id })}
                    className={`py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2.5rem] transition-all duration-500 border-2 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-4 ${
                      formData.role === roleObj.id 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-xl sm:scale-105' 
                      : 'bg-slate-950 border-slate-900 text-slate-700 hover:border-slate-800'
                    }`}
                  >
                    {roleObj.icon}
                    <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest italic">{roleObj.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.role === "parent" && (
              <div className="relative group/field animate-in slide-in-from-top-4 fade-in duration-500 pt-2 sm:pt-4">
                <Fingerprint className="absolute left-5 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 text-blue-500 transition-all w-5 h-5 md:w-6 md:h-6" />
                <input
                  name="childEmail"
                  type="email"
                  placeholder="LINKED_AGENT_ID"
                  className="w-full pl-12 sm:pl-16 md:pl-28 pr-4 sm:pr-6 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] bg-blue-900/10 border-2 border-blue-500/30 focus:border-blue-500 text-base sm:text-lg md:text-xl font-black text-white placeholder:text-blue-900 placeholder:italic transition-all outline-none leading-none shadow-[0_0_30px_rgba(37,99,235,0.1)] truncate"
                  value={childEmail}
                  onChange={(e) => setChildEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-widest sm:tracking-[0.6em] text-[10px] sm:text-xs shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-6 italic mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Initializing_Node...
                </div>
              ) : <><ShieldCheck className="w-5 h-5 md:w-7 md:h-7" /> Deploy Neural Profile</>}
            </button>
          </form>

          <footer className="mt-10 sm:mt-16 text-center border-t border-slate-900 pt-6 sm:pt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest sm:tracking-[0.4em]">
              <span>Synchronize Existing Identity?</span>
              <Link to="/login" className="text-blue-500 hover:text-blue-400 inline-flex items-center gap-2 group transition-all">
                Log In <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Register;