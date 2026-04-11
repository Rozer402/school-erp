import { cn } from "@/lib/utils";
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  lightBase: string;
  text: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  progress?: number;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color: _color,
  lightBase,
  text,
  trend,
  progress,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-card rounded-xl p-4 border border-border shadow-soft hover:shadow-medium transition relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-soft",
            lightBase,
            text,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-semibold",
              trend.isUp
                ? "bg-green-100 text-green-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-rose-500/10 dark:text-rose-400",
            )}
          >
            {trend.isUp ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">
          {title}
        </h3>
        <div className="text-2xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
          {value}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}
    </div>
  );
}
