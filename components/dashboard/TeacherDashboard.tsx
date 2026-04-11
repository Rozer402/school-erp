"use client";

import { Schedule } from "@/components/dashboard/Schedule";
import { BulletinBoard } from "@/components/dashboard/BulletinBoard";
import { useAuth } from "@/components/auth/AuthProvider";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function TeacherDashboard() {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border shadow-sm group">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-foreground tracking-tight italic">Welcome, {user?.name}! 👋</h1>
          <p className="text-muted-foreground text-sm font-bold tracking-tight">You have 3 classes scheduled today.</p>
        </div>
        <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center md:items-end">
          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none mb-2">Today</p>
          <p className="text-sm font-black text-foreground truncate italic">{currentDate}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
            <Schedule />
        </motion.div>
        <motion.div variants={item}>
            <BulletinBoard />
        </motion.div>
      </div>
    </motion.div>
  );
}
