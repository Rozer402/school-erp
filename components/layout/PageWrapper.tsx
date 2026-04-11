"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto bg-background/50 min-h-[calc(100vh-5rem)] relative">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ 
                duration: 0.4, 
                ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative background Elements */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="fixed bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full" />
    </main>
  );
}
