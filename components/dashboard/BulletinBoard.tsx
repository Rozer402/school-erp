"use client";

import { BellRing, ChevronRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetchClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function BulletinBoard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiFetchClient("/api/dashboard"),
  });

  const bulletinData: any[] = data?.bulletins || [];

  // Tag normalization
  const normalizeTag = (tag: string) => {
    if (tag === "PLACEMENT") return "EXAM";
    if (["IMPORTANT", "GENERAL", "EXAM", "HOLIDAY"].includes(tag)) return tag;
    return "GENERAL";
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl p-4 border border-border shadow-soft flex flex-col group/board hover:shadow-medium transition">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
            <BellRing className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Bulletin Board
          </h2>
        </div>
        <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
          View History
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 rounded-xl border border-border/50 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-1/4" />
                </div>
              </div>
            ))
          : bulletinData.map((item, idx) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-primary/5 dark:hover:bg-indigo-900/10 transition group cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0 border transition-transform group-hover:scale-105 shadow-soft",
                    item.type === "Important"
                      ? "bg-red-100 border-red-100 text-red-700 dark:bg-rose-900/40 dark:text-rose-400"
                      : item.type === "Placement" || item.type === "EXAM"
                        ? "bg-blue-100 border-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : item.type === "Holiday"
                          ? "bg-green-100 border-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-indigo-50 border-indigo-100 text-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400",
                  )}
                >
                  <span className="text-[10px] font-semibold leading-none opacity-50">
                    {item.date.split(" ")[0]}
                  </span>
                  <span className="text-sm font-semibold leading-none">
                    {item.date.split(" ")[1].replace(",", "")}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors truncate mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-semibold uppercase tracking-widest px-2 py-0 border-none",
                        normalizeTag(item.type) === "IMPORTANT"
                          ? "bg-red-100 text-red-700 dark:bg-rose-900/40 dark:text-rose-400"
                          : normalizeTag(item.type) === "EXAM"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                            : normalizeTag(item.type) === "HOLIDAY"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
                      )}
                    >
                      {normalizeTag(item.type)}
                    </Badge>
                    {normalizeTag(item.type) === "EXAM" && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-400 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        Live Now
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
              </div>
            ))}
        {!isLoading && bulletinData.length === 0 && (
          <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-4">
            <BellRing className="w-12 h-12 opacity-10" />
            <p className="text-sm font-bold">
              Quiet day on the bulletin board.
            </p>
          </div>
        )}
      </div>

      {/* Upcoming Event Banner */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="bg-indigo-600 rounded-2xl p-4 text-white relative overflow-hidden group/cta cursor-pointer flex items-center justify-between">
          <div className="flex flex-col gap-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <p className="text-sm font-bold">Annual Cultural Fest 2026</p>
            </div>
            <p className="text-xs text-white/70">
              Falgun 15, 2082 / Feb 27, 2026
            </p>
          </div>
          <button className="ml-4 text-xs text-white/80 hover:underline flex items-center gap-1 font-semibold bg-transparent border-0 shadow-none px-0 py-0">
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover/cta:scale-150 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
}
