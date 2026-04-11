"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Week 1", score: 65, attendance: 90 },
  { name: "Week 2", score: 72, attendance: 88 },
  { name: "Week 3", score: 68, attendance: 85 },
  { name: "Week 4", score: 85, attendance: 92 },
  { name: "Week 5", score: 78, attendance: 95 },
  { name: "Week 6", score: 92, attendance: 94 },
];

export function PerformanceChart() {
  return (
    <div className="bg-white dark:bg-card border border-border shadow-soft rounded-xl p-4 lg:col-span-2 group">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground tracking-tight italic">
            Semester Progress
          </h2>
          <p className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
            Performance vs Attendance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-soft" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              Scores
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-soft" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              Attendance
            </span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAttending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
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
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 2,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAttending)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
