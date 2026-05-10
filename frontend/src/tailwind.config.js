/** 
 * ============================================================
 * 🚀 TITAN DESIGN SYSTEM ORCHESTRATOR (v4.2 - Production)
 * Ref: Report Section 3.7 (UI/UX Engineering & Design Tokens)
 * Purpose: Enforcing industrial visual identity via Tailwind Config.
 * ============================================================
 * @type {import('tailwindcss').Config} 
 */

export default {
  // 🔐 AUTHORITY_CONTROL: Dark mode enabled via 'class' for neural theme switching
  darkMode: "class", 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // 📐 NEURAL_TYPOGRAPHY: Optimized for high-density academic data
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'], // For class codes/node IDs
      },
      
      // 🎨 INSTITUTIONAL_PALETTE: Professional grade "Titan" colors
      colors: {
        darkBg: "#020617", // Deep Midnight (Primary)
        slateSub: "#01040a", // Sidebar/Secondary Background
        bluePrimary: "#2563eb", // Neural Hub Blue
        emeraldSignal: "#10b981", // Success/Presence Signal
      },

      // 🌀 PERFORMANCE_ANIMATIONS: Hardware-accelerated UI feedback
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neural-float': 'float 6s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },

      // 💎 INDUSTRIAL_GLOW: Shadow tokens for glassmorphism
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.6)',
        'blue-glow': '0 0 30px rgba(37, 99, 235, 0.2)',
        'emerald-glow': '0 0 30px rgba(16, 185, 129, 0.2)',
      }
    },
  },

  plugins: [
    // Standard plugins can be added here (e.g., forms, typography)
  ],
};