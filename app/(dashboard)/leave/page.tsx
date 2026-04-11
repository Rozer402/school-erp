/**
 * Leave Page — SERVER COMPONENT
 *
 * No "use client" directive. Columns are plain serialisable objects —
 * no render functions cross the RSC boundary.
 */
export const dynamic = "force-dynamic";
import { DataTable } from "@/components/shared/DataTable";
import { apiFetchServer } from "@/lib/api-server";
import { Plus, CalendarX } from "lucide-react";
import { Metadata } from "next";
import type { ColumnDef } from "@/types/table";

export const metadata: Metadata = {
  title: "Leave Applications | EduERP",
  description: "Manage and track your leave requests and approval statuses.",
};

type LeaveRow = {
  id: string;
  dateRange: string;
  days: number;
  reason: string;
  status: string;
};

const columns: ColumnDef<LeaveRow>[] = [
  {
    header: "Leave ID",
    accessor: "id",
    cell: { type: "code" },
  },
  {
    header: "Date Range",
    accessor: "dateRange",
    cell: { type: "text", bold: true },
  },
  {
    header: "Days",
    accessor: "days",
    cell: { type: "text", muted: true },
  },
  {
    header: "Reason",
    accessor: "reason",
    cell: { type: "text", muted: true },
  },
  {
    header: "Status",
    accessor: "status",
    cell: { type: "badge" },
  },
];

export default async function LeavePage() {
  const leaveData: LeaveRow[] = await apiFetchServer("/api/leave");

  // Summary counters derived on the server — no client JS needed
  const approved = leaveData.filter((l) => l.status === "Approved").length;
  const pending = leaveData.filter((l) => l.status === "Pending").length;
  const rejected = leaveData.filter((l) => l.status === "Rejected").length;
  const totalDays = leaveData.reduce((sum, l) => sum + Number(l.days), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-foreground tracking-tight italic">
            Leave Applications
          </h1>
          <p className="text-muted-foreground text-sm font-bold">
            Submit new requests and track existing leave approvals.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 group">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          Apply for Leave
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Days", value: totalDays, colour: "indigo", icon: CalendarX },
          { label: "Approved", value: approved, colour: "emerald", icon: null },
          { label: "Pending", value: pending, colour: "amber", icon: null },
          { label: "Rejected", value: rejected, colour: "rose", icon: null },
        ].map(({ label, value, colour }) => (
          <div
            key={label}
            className={`bg-${colour}-50 dark:bg-${colour}-950/20 p-5 rounded-[2rem] border border-${colour}-100 dark:border-${colour}-800/20 space-y-2`}
          >
            <p className={`text-[10px] font-black uppercase tracking-widest text-${colour}-600 dark:text-${colour}-400`}>
              {label}
            </p>
            <p className={`text-3xl font-black italic tracking-tighter text-${colour}-700 dark:text-${colour}-300`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] pl-1">
            Application History
          </h2>
          <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 decoration-2 decoration-indigo-200">
            Download Report
          </button>
        </div>
        <DataTable<LeaveRow>
          columns={columns}
          data={leaveData}
          emptyMessage="No leave applications found."
        />
      </div>
    </div>
  );
}
