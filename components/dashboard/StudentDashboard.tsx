"use client";

import { SCHOOL } from "@/config/school";
import { BulletinBoard } from "@/components/dashboard/BulletinBoard";
import { motion } from "framer-motion";
import { BookOpen, AlertCircle, Calendar } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StudentDashboard() {
  // Static English and Bikram Sambat dates for the academic calendar
  const engDate = "Thursday, April 2, 2026";
  const bsDate = "Chaitra 20, 2082";

  // Stat cards config with new backgrounds and label changes
  const statCards = [
    {
      icon: BookOpen,
      title: "Announcements",
      value: "12",
      subtitle: "New this week",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: AlertCircle,
      title: "Attendance",
      value: "98%",
      subtitle: "This term",
      bg: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: Calendar,
      title: "Assessments",
      value: "5",
      subtitle: "Upcoming",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: BookOpen,
      title: "Tasks",
      value: "4",
      subtitle: "Due soon",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: Calendar,
      title: "Exams",
      value: "2",
      subtitle: "This month",
      bg: "bg-gray-50 dark:bg-zinc-900/40",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-8 rounded-2xl border border-border shadow-sm group"
      >
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold">
            Welcome to {SCHOOL.name} Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Academic Year: {SCHOOL.academicYear}
          </p>
        </div>
        <div className="px-6 py-4 bg-muted/20 dark:bg-muted/10 rounded-3xl border border-border/50 flex flex-col items-center md:items-end transition-all group-hover:border-indigo-500/20 group-hover:bg-indigo-50/10">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-2">
            Academic Calendar
          </p>
          <p className="text-sm font-black text-foreground truncate italic">
            {engDate}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{bsDate}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <motion.div key={idx} variants={item}>
            <div
              className={`flex flex-col items-start justify-between rounded-xl p-4 border border-border shadow-soft transition ${card.bg}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <card.icon className="w-6 h-6 text-muted-foreground" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {card.title}
                </span>
              </div>
              <div className="text-2xl font-semibold text-foreground tracking-tight">
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <BulletinBoard />
      </div>
    </motion.div>
  );
}
