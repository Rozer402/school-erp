"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Schedule } from "@/components/dashboard/Schedule";
import { BulletinBoard } from "@/components/dashboard/BulletinBoard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { useQuery } from "@tanstack/react-query";
import { apiFetchClient } from "@/lib/api-client";
import { statCardsData as staticCardsConfig } from "@/data/dashboard";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function AdminDashboard() {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiFetchClient('/api/dashboard')
  });

  const apiStats = data?.stats || [];

  const displayStats = staticCardsConfig.map((config, index) => {
    const apiStat = apiStats[index];
    if (!apiStat) return config;
    return {
      ...config,
      value: apiStat.value,
      trend: apiStat.trend,
      progress: apiStat.progress,
    };
  });

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border shadow-sm group">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-foreground tracking-tight italic">Greetings, {user?.name.split(" ")[0]}! 👋</h1>
          </div>
          <p className="text-muted-foreground text-sm font-bold tracking-tight">You have <span className="text-indigo-600 dark:text-indigo-400 font-black underline underline-offset-4 decoration-4 decoration-indigo-200 dark:decoration-indigo-900/50 transition-all hover:decoration-indigo-600">2 new notifications</span> and 4 pending tasks today.</p>
        </div>
        <div className="px-6 py-4 bg-muted/20 dark:bg-muted/10 rounded-3xl border border-border/50 flex flex-col items-center md:items-end transition-all group-hover:border-indigo-500/20 group-hover:bg-indigo-50/10">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-2">Academic Calendar</p>
          <p className="text-sm font-black text-foreground truncate italic">{currentDate}</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] pl-1">Key Performance Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-[140px] rounded-3xl animate-pulse bg-gray-200 dark:bg-gray-800" />
            ))
          ) : (
            displayStats.map((stat, idx: number) => (
              <motion.div key={idx} variants={item}>
                <StatCard {...stat} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
            <Schedule />
            <PerformanceChart />
        </motion.div>
        <motion.div variants={item}>
            <BulletinBoard />
        </motion.div>
      </div>
    </motion.div>
  );
}
