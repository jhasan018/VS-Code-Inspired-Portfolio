"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { FrontendTheme } from "@/lib/theme";

export default function Preloader({ theme = "vscode" }: { theme?: FrontendTheme }) {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden ${theme === "dimension" ? "dimension-preloader" : "bg-[#37353e]"}`}
        >
          {theme === "dimension" ? <>
            <div className="dimension-loader-grid" />
            <motion.div className="dimension-loader-orb" animate={{ rotate: 360, scale: [1, 1.08, 1] }} transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}>
              <span>JH</span>
            </motion.div>
            <div className="dimension-loader-info"><span>ENTERING DIGITAL DIMENSION</span><b>{percent.toString().padStart(3, "0")}</b><i><em style={{ width: `${percent}%` }} /></i></div>
          </> : <>
          {/* Central Logo & Progress Ring */}
          <div className="relative flex items-center justify-center">
            {/* Progress Ring SVG */}
            <svg className="w-40 h-40 md:w-56 md:h-56 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                stroke="#44444e"
                strokeWidth="2"
                fill="transparent"
                className="opacity-20"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="48%"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray="100 100"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - percent }}
                strokeLinecap="round"
                style={{ strokeDasharray: "301.59", strokeDashoffset: 301.59 - (301.59 * percent) / 100 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#715a5a" />
                  <stop offset="100%" stopColor="#d3dad9" />
                </linearGradient>
              </defs>
            </svg>

            {/* Logo in center */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-white/10 shadow-2xl shadow-[#715a5a]/30">
                <img src="/jahid-favicon.png" alt="Jahid Hasan" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Loading Info */}
          <div className="mt-12 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono"
            >
              <span className="text-[10px] md:text-xs tracking-[0.3em] text-[#d3dad9]/70 uppercase">
                Synchronizing Experience
              </span>
              <div className="mt-2 flex items-center justify-center gap-4">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#715a5a]" />
                <span className="text-xl md:text-2xl font-bold text-[#d3dad9] tabular-nums">
                  {percent.toString().padStart(3, '0')}
                </span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#d3dad9]" />
              </div>
            </motion.div>
          </div>

          {/* Abstract Light Beams */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-10"
            >
              <div className="absolute top-0 left-1/2 w-1 h-1/2 bg-gradient-to-b from-[#715a5a] to-transparent blur-xl" />
              <div className="absolute bottom-0 left-1/2 w-1 h-1/2 bg-gradient-to-t from-[#d3dad9] to-transparent blur-xl" />
            </motion.div>
          </div>
          </>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
