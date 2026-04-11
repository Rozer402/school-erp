"use client";

/**
 * CellRenderer
 *
 * The single Client Component responsible for mapping a serialisable
 * CellConfig → rendered JSX. All visual logic (badges, progress bars, icons)
 * lives HERE and never crosses the RSC boundary as functions.
 */

import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { CellConfig, BadgeVariant } from "@/types/table";

// ---------------------------------------------------------------------------
// Badge colour map
// ---------------------------------------------------------------------------

const BADGE_STYLES: Record<BadgeVariant, string> = {
  // Fees
  Paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Overdue: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  Upcoming: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
  // Library
  Returned: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Issued: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  // Leave
  Approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Rejected: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  // Attendance
  Excellent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Average: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Low: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
};

function getBadgeStyle(value: string): string {
  return BADGE_STYLES[value as BadgeVariant] ?? "bg-muted text-muted-foreground";
}

// ---------------------------------------------------------------------------
// Attendance helpers
// ---------------------------------------------------------------------------

function getAttendanceLabel(pct: number): string {
  if (pct >= 85) return "Excellent";
  if (pct >= 75) return "Average";
  return "Low";
}

function getAttendanceColour(pct: number): string {
  if (pct >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function getProgressBarColour(pct: number): string {
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-rose-500";
}

function getAttendanceBadgeStyle(pct: number): string {
  if (pct >= 85) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
  if (pct >= 75) return "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
  return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400";
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type CellRendererProps = {
  /** The raw value of the cell (item[accessor]). */
  value: unknown;
  /** The full row object — needed for configs that read sibling keys. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Record<string, any>;
  config: CellConfig;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CellRenderer({ value, row, config }: CellRendererProps) {
  const str = value != null ? String(value) : "—";

  switch (config.type) {
    // ── Text ───────────────────────────────────────────────────────────────
    case "text":
      return (
        <span
          className={cn(
            config.bold && "font-bold text-foreground",
            config.muted && "text-muted-foreground font-medium"
          )}
        >
          {str}
        </span>
      );

    // ── Code / ID ──────────────────────────────────────────────────────────
    case "code":
      return (
        <span className="font-mono font-black text-muted-foreground tracking-wide text-xs">
          {str}
        </span>
      );

    // ── Amount ─────────────────────────────────────────────────────────────
    case "amount": {
      const prefix = config.prefix ?? "₹";
      return (
        <span className="font-black text-foreground tabular-nums">
          {prefix}{str}
        </span>
      );
    }

    // ── Badge ──────────────────────────────────────────────────────────────
    case "badge":
      return (
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none shadow-sm",
            getBadgeStyle(str)
          )}
        >
          {str}
        </span>
      );

    // ── Progress bar ───────────────────────────────────────────────────────
    case "progress": {
      const pct = Number(row[config.percentageKey] ?? 0);
      return (
        <div className="flex items-center gap-3 min-w-[140px]">
          {/* Track */}
          <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", getProgressBarColour(pct))}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          {/* Label */}
          <span className={cn("font-black text-xs w-10 text-right tabular-nums", getAttendanceColour(pct))}>
            {pct}%
          </span>
        </div>
      );
    }

    // ── Attendance Status ──────────────────────────────────────────────────
    case "attendance-status": {
      const pct = Number(row[config.percentageKey] ?? 0);
      const label = getAttendanceLabel(pct);
      const Icon =
        pct >= 85 ? CheckCircle : pct >= 75 ? AlertTriangle : XCircle;

      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider",
            getAttendanceBadgeStyle(pct)
          )}
        >
          <Icon className="w-3 h-3" />
          {label}
        </div>
      );
    }

    // ── Combined (e.g. "35 / 40") ──────────────────────────────────────────
    case "combined": {
      const sep = config.separator ?? " / ";
      const second = row[config.secondKey] != null ? String(row[config.secondKey]) : "—";
      return (
        <span className="font-bold text-foreground tabular-nums">
          {str}
          <span className="text-muted-foreground font-medium">{sep}</span>
          {second}
        </span>
      );
    }

    default:
      return <span>{str}</span>;
  }
}
