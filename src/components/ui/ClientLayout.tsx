"use client";
import { useState, useEffect } from "react";
import Preloader from "./Preloader";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { FrontendTheme } from "@/lib/theme";

export default function ClientLayout({ children, frontendTheme }: { children: React.ReactNode; frontendTheme: FrontendTheme }) {
  const pathname = usePathname();

  if (pathname !== "/" || frontendTheme === "dimension") return <>{children}</>;

  return <HomeEntrance theme={frontendTheme}>{children}</HomeEntrance>;
}

function HomeEntrance({ children, theme }: { children: React.ReactNode; theme: FrontendTheme }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Sync this with Preloader's duration (approx 2s + exit transition)
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2800); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader theme={theme} />
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
