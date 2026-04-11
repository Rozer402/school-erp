"use client";

import { Schedule } from "@/components/dashboard/Schedule";
import { EmptyState } from "@/components/shared/EmptyState";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function TimetablePage() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        show: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-8 pb-12"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-foreground tracking-tight italic">Academic Timetable</h1>
          <p className="text-muted-foreground text-sm font-bold">Synchronized with your official course registration for Semester 2.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-800 text-xs font-black uppercase tracking-widest leading-none">
          <Info className="w-4 h-4" />
          Live Sync Active
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Schedule />
      </motion.div>

      <motion.div variants={item} className="mt-8">
        <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-8">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] pl-1">Weekly Grid Overview</h2>
          <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 decoration-2 decoration-indigo-200">Request Changes</button>
        </div>
        <EmptyState 
          icon="search"
          title="Weekly Grid Syncing..."
          description="We are currently fetching your complete weekly timetable from the central server. This usually takes less than a minute."
          action={{
            label: "Force Refresh",
            onClick: () => window.location.reload()
          }}
        />
      </motion.div>
    </motion.div>
  );
}
