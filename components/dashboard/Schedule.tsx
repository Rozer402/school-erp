"use client";

import { Clock, MapPin, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetchClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function Schedule() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiFetchClient("/api/dashboard"),
  });

  const scheduleData: any[] = data?.schedule || [];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const isOngoing = (timeRange: string) => {
    const [startStr, endStr] = timeRange.split(" - ");

    const parseTime = (t: string) => {
      const [time, modifier] = t.split(" ");
      const parsed = time.split(":").map(Number);
      let hours = parsed[0];
      const minutes = parsed[1];
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      const d = new Date(currentTime);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const start = parseTime(startStr);
    const end = parseTime(endStr);

    return currentTime >= start && currentTime <= end;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-card rounded-xl p-6 border border-border shadow-soft lg:col-span-2 text-center py-16 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-4" />
        <div className="w-48 h-6 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto" />
      </div>
    );
  }

  if (scheduleData.length === 0) {
    return (
      <div className="bg-white dark:bg-card rounded-xl p-6 border border-border shadow-soft lg:col-span-2 text-center text-muted-foreground py-16 flex flex-col items-center gap-4">
        <Clock className="w-12 h-12 text-muted-foreground/20" />
        <div className="space-y-1">
          <p className="text-lg font-black text-foreground">
            No classes scheduled
          </p>
          <p className="text-sm">
            Enjoy your free time or catch up on studies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card rounded-xl p-4 border border-border shadow-soft lg:col-span-2 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Today&apos;s Schedule
          </h2>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
            4 Academic Sessions Today
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-50 dark:bg-indigo-900/20 text-xs font-semibold text-primary dark:text-primary rounded-lg hover:bg-blue-100 dark:hover:bg-indigo-900/40 transition">
          View All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-2 px-2">
        {scheduleData.map((item) => {
          const active = isOngoing(item.time);
          return (
            <div
              key={item.id}
              className={cn(
                "flex-shrink-0 w-72 p-4 rounded-xl border transition-all snap-start shadow-soft hover:shadow-medium relative group/card",
                active
                  ? "bg-blue-50 border-blue-300 dark:bg-indigo-950/40 dark:border-indigo-500/50 ring-2 ring-blue-100"
                  : "bg-background border-border/50 hover:border-blue-200 dark:hover:border-indigo-800",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Clock
                    className={cn(
                      "w-3.5 h-3.5",
                      active ? "text-primary" : "text-muted-foreground/50",
                    )}
                  />
                  {item.time}
                </div>
                {active && (
                  <Badge className="bg-primary text-white font-semibold text-[9px] px-2 py-0.5 animate-pulse border-none shadow-soft">
                    <Play className="w-2 h-2 fill-current mr-1" />
                    ONGOING
                  </Badge>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground leading-snug mb-4 group-hover/card:text-primary transition-colors">
                {item.subject}
              </h3>

              <div className="flex items-center justify-between text-xs mt-2 p-3 bg-muted/20 dark:bg-muted/10 rounded-lg">
                <span className="flex items-center gap-1.5 text-foreground font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {item.location}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-semibold text-[9px] uppercase tracking-widest shadow-soft",
                    item.type === "Lecture"
                      ? "bg-blue-100 text-blue-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                  )}
                >
                  {item.type}
                </span>
              </div>

              {active && (
                <div className="absolute top-1/2 -right-2 w-1.5 h-8 bg-indigo-500 rounded-full blur-[2px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
