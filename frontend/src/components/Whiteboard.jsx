/**
 * ============================================================
 * 🖍️ TITAN NEURAL WHITEBOARD (v5.0 - Enterprise Liquid Build)
 * Upgrade: Advanced Segment-Based Drawing Engine for ZERO lag.
 * Fix: Canvas drawing preservation on window resize/rotate.
 * UI: Kept your beautiful Dot-Grid Neural Slate intact!
 * ============================================================
 */

import React, { useRef, useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import { 
  Eraser, Pencil, Trash2, Download, 
  Palette, Settings2, Lock, Unlock
} from "lucide-react";

function Whiteboard({ roomId, permissions, user }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#38bdf8"); // Default Neon Cyan
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  // Ref to track previous cursor position for smooth segment drawing
  const currentPos = useRef({ x: 0, y: 0 });

  // The new slate background color
  const SLATE_BG = "#0f172a"; 
  const isTeacher = user?.role === "teacher";
  const canDraw = isTeacher || permissions?.allowDraw;

  // 📐 RESPONSIVE ENGINE: Dynamic Parent Fitting & Preservation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const context = canvas.getContext("2d");

    const resizeCanvas = () => {
      if (!container || !canvas) return;
      
      // 🔥 FIX 1: Save current drawing to temp canvas to prevent clearing on resize/rotate
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width || 1;
      tempCanvas.height = canvas.height || 1;
      tempCtx.drawImage(canvas, 0, 0);

      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Restore drawing seamlessly
      context.drawImage(tempCanvas, 0, 0);
      
      // Reset context styles
      context.lineCap = "round";
      context.lineJoin = "round";
    };

    setTimeout(resizeCanvas, 50); 
    window.addEventListener('resize', resizeCanvas);

    const socket = getSocket();
    
    // 📡 Synchronizing Inbound Streams (Segment Based)
    const onDrawing = ({ x0, y0, x1, y1, strokeColor, width }) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      
      const absX0 = x0 * canvas.width;
      const absY0 = y0 * canvas.height;
      const absX1 = x1 * canvas.width;
      const absY1 = y1 * canvas.height;

      ctx.beginPath();
      ctx.moveTo(absX0, absY0);
      ctx.lineTo(absX1, absY1);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.closePath();
    };

    socket.on("drawing", onDrawing);

    socket.on("board_cleared", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      socket.off("drawing", onDrawing);
      socket.off("board_cleared");
    };
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    };
  };

  const startDrawing = (e) => {
    if (!canDraw) return;
    const coords = getCoordinates(e.nativeEvent || e);
    currentPos.current = coords;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canDraw) return;
    
    const newPos = getCoordinates(e.nativeEvent || e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const absX0 = currentPos.current.x * canvas.width;
    const absY0 = currentPos.current.y * canvas.height;
    const absX1 = newPos.x * canvas.width;
    const absY1 = newPos.y * canvas.height;

    // 🔥 FIX 2: Draw perfect segments locally
    ctx.beginPath();
    ctx.moveTo(absX0, absY0);
    ctx.lineTo(absX1, absY1);
    ctx.strokeStyle = isEraser ? SLATE_BG : color;
    ctx.lineWidth = isEraser ? 40 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.closePath();

    // Broadcast Segment to all nodes
    getSocket().emit("draw", { 
      roomId, 
      x0: currentPos.current.x, 
      y0: currentPos.current.y, 
      x1: newPos.x, 
      y1: newPos.y,
      strokeColor: isEraser ? SLATE_BG : color, 
      width: isEraser ? 40 : lineWidth
    });

    currentPos.current = newPos; // Update position for next frame
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  const clearBoard = () => {
    if (!isTeacher) return;
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    getSocket().emit("clear_board", roomId);
  };

  const downloadBoard = () => {
    const link = document.createElement("a");
    link.download = `TITAN-Dossier-${Date.now()}.png`;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = SLATE_BG;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvasRef.current, 0, 0);
    
    link.href = tempCanvas.toDataURL();
    link.click();
  };

  return (
    <div className="glass p-3 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-900 shadow-2xl flex flex-col h-full w-full bg-[#020617]/80 backdrop-blur-3xl animate-in fade-in duration-700">
      
      {/* 🚀 Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner shrink-0">
            <Palette className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic leading-none truncate pr-2">Neural Board</h2>
            <p className="text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] truncate">Protocol: V5.0_STABLE</p>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 shrink-0">
          <button onClick={downloadBoard} className="p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl hover:border-blue-500/30">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {isTeacher && (
            <button onClick={clearBoard} className="p-3 sm:p-4 bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white rounded-xl sm:rounded-2xl transition-all shadow-xl">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 🎨 Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 bg-slate-950/80 p-3 sm:p-4 rounded-2xl sm:rounded-[2rem] border border-white/5 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full md:w-auto justify-between md:justify-start">
          <div className="flex bg-[#020617] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl gap-1.5 sm:gap-2 border border-slate-900 shrink-0">
            <ToolBtn icon={<Pencil className="w-4 h-4 sm:w-[18px] sm:h-[18px]"/>} active={!isEraser} onClick={() => setIsEraser(false)} />
            <ToolBtn icon={<Eraser className="w-4 h-4 sm:w-[18px] sm:h-[18px]"/>} active={isEraser} onClick={() => setIsEraser(true)} />
          </div>

          <div className="flex gap-2 sm:gap-3 justify-center">
            {["#38bdf8", "#fbbf24", "#34d399", "#ffffff", "#f87171"].map(c => (
              <button 
                key={c} 
                onClick={() => { setColor(c); setIsEraser(false); }}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all hover:scale-125 ${color === c && !isEraser ? 'ring-2 sm:ring-4 ring-offset-2 ring-offset-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'ring-2 ring-transparent opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: c, borderColor: c === '#ffffff' ? '#cbd5e1' : 'transparent' }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 bg-[#020617] px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-900 flex-1 md:flex-none w-full md:w-auto">
          <Settings2 className="w-4 h-4 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
          <input 
            type="range" min="2" max="20" value={lineWidth} 
            onChange={(e) => setLineWidth(e.target.value)}
            className="w-full md:w-24 accent-blue-500 h-1 sm:h-1.5 bg-slate-800 rounded-full cursor-pointer appearance-none"
          />
        </div>
      </div>

      {/* 🖍️ Interactive Neural Canvas */}
      <div 
        ref={containerRef} 
        className="relative flex-1 w-full rounded-2xl sm:rounded-[2rem] overflow-hidden border-2 border-slate-800 shadow-inner group"
      >
        {/* The beautiful Dot-Grid Background */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{ 
               backgroundColor: SLATE_BG,
               backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>

        <canvas 
          ref={canvasRef} 
          onMouseDown={startDrawing} 
          onMouseUp={stopDrawing} 
          onMouseMove={draw} 
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`absolute inset-0 w-full h-full touch-none selection:bg-none z-10 ${canDraw ? 'cursor-crosshair' : 'cursor-default'}`} 
        />
        
        {/* Signal Status Badge */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 sm:gap-3 bg-[#020617]/80 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border border-white/10 pointer-events-none z-20">
           <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${!canDraw ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-blue-500 shadow-[0_0_10px_blue]'}`}></div>
           <div className="flex items-center gap-1.5 sm:gap-2">
              {!canDraw ? <Lock className="w-3 h-3 sm:w-3 sm:h-3 text-red-500"/> : <Unlock className="w-3 h-3 sm:w-3 sm:h-3 text-blue-500"/>}
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.2em] text-slate-300">
                {!canDraw ? "Read_Only" : "Write_Mode"}
              </span>
           </div>
        </div>
      </div>

    </div>
  );
}

function ToolBtn({ icon, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
    >
      {React.cloneElement(icon, { strokeWidth: 2.5 })}
    </button>
  );
}

export default Whiteboard;