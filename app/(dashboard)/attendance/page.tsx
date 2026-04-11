"use client";

/**
 * Attendance Page — CLIENT COMPONENT
 *
 * This page legitimately needs "use client" because it uses Framer Motion
 * animations and Recharts. That is correct per Next.js 14 best practices.
 *
 * Crucially, even though this is a Client Component, the `columns` array
 * uses declarative CellConfig objects — no render functions. This means
 * the pattern is consistent and the columns array could be extracted to a
 * shared server-safe config file in the future.
 */

import { useQuery } from "@tanstack/react-query";
import { apiFetchClient } from "@/lib/api-client";
import { DataTable } from "@/components/shared/DataTable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import type { ColumnDef } from "@/types/table";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Row type + columns
type AttendanceRow = {
  id: string;
  name: string;
  totalClasses: number;
  attended: number;
  percentage: number;
};

const columns: ColumnDef<AttendanceRow>[] = [
  {
    header: "Code",
    accessor: "id",
    cell: { type: "code" },
  },
  {
    header: "Subject Name",
    accessor: "name",
    cell: { type: "text", bold: true },
  },
  {
    header: "Attended / Total",
    accessor: "attended",
    cell: { type: "combined", secondKey: "totalClasses" },
  },
  {
    header: "Attendance",
    accessor: "percentage",
    cell: { type: "progress", percentageKey: "percentage" },
  },
  {
    header: "Status",
    accessor: "percentage",
    cell: { type: "attendance-status", percentageKey: "percentage" },
  },
];

export default function AttendancePage() {
  const { data: attendanceTrendsData } = useQuery({
    queryKey: ["attendanceTrends"],
    queryFn: () => apiFetchClient("/api/attendanceTrends"),
  });

  const { data: subjectAttendanceData, isLoading: isLoadingSubjects } =
    useQuery({
      queryKey: ["subjectAttendance"],
      queryFn: () => apiFetchClient("/api/subjectAttendance"),
    });

  const displayTrends = attendanceTrendsData || [];
  const displaySubjects = subjectAttendanceData || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border shadow-sm"
      >
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-foreground tracking-tight italic">
            Attendance Record
          </h1>
          <p className="text-muted-foreground text-sm font-bold">
            Comprehensive tracking across all academic sessions for Second Term
            (2025-26).
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-14 w-1 bg-emerald-500 rounded-full" />
          <div className="text-right">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Overall Attendance
            </p>
            <p className="text-3xl font-black text-foreground italic tracking-tighter">
              85.2%
            </p>
          </div>
        </div>
      </motion.div>
      {/* Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-card rounded-[2.5rem] p-8 border border-border shadow-sm"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-foreground tracking-tight italic">
              Attendance Trend
            </h2>
            <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">
              Monthly Percentage Comparison
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 bg-muted/20 dark:bg-muted/10 rounded-xl border border-border/30">
            <div className="px-3 py-1 bg-white dark:bg-background rounded-lg shadow-sm text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">
              ACADEMIC YEAR 2025-26
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayTrends}
              margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                  fontWeight: 700,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                  fontWeight: 700,
                }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "16px",
                  padding: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#4f46e5"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorAtt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      {/* Subject Table */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] pl-1">
            Subject Breakdown
          </h2>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest leading-none">
              Minimum 75% Required
            </span>
          </div>
        </div>
        <DataTable<AttendanceRow>
          columns={columns}
          data={displaySubjects}
          isLoading={isLoadingSubjects}
          emptyMessage="No attendance records found."
        />
      </motion.div>
    </motion.div>
  );
}
