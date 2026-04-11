/**
 * Library Page — SERVER COMPONENT
 *
 * No "use client" directive. Data and columns flow down to the Client
 * Component <DataTable> as plain serialisable objects (no functions).
 * This enables `export const metadata` and React Server Component benefits.
 */
export const dynamic = "force-dynamic";
import { DataTable } from "@/components/shared/DataTable";
import { apiFetchServer } from "@/lib/api-server";
import { BookMarked } from "lucide-react";
import { Metadata } from "next";
import type { ColumnDef } from "@/types/table";

export const metadata: Metadata = {
  title: "Library Transactions | EduERP",
  description: "View issued, returned, and overdue library books.",
};

// Row type — derived from the mock data shape
type LibraryRow = {
  id: string;
  title: string;
  author: string;
  issueDate: string;
  returnDate: string;
  status: string;
};

// Columns are a plain array of objects — fully serialisable, zero functions
const columns: ColumnDef<LibraryRow>[] = [
  {
    header: "Book ID",
    accessor: "id",
    cell: { type: "code" },
  },
  {
    header: "Title",
    accessor: "title",
    cell: { type: "text", bold: true },
  },
  {
    header: "Author",
    accessor: "author",
    cell: { type: "text", muted: true },
  },
  {
    header: "Issue Date",
    accessor: "issueDate",
    cell: { type: "text", muted: true },
  },
  {
    header: "Return Date",
    accessor: "returnDate",
    cell: { type: "text", muted: true },
  },
  {
    header: "Status",
    accessor: "status",
    cell: { type: "badge" },
  },
];

export default async function LibraryPage() {
  const libraryData: LibraryRow[] =
    (await apiFetchServer("/api/library")) ?? [];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-foreground tracking-tight italic">
            Library Records
          </h1>
          <p className="text-muted-foreground text-sm font-bold">
            Review your issued, returned, and overdue library transactions.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 group">
          <BookMarked className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Request Book
        </button>
      </div>
      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Issued", value: "3", colour: "indigo" },
          { label: "Returned", value: "1", colour: "emerald" },
          { label: "Overdue", value: "1", colour: "rose" },
        ].map(({ label, value, colour }) => (
          <div
            key={label}
            className={`bg-${colour}-50 dark:bg-${colour}-950/20 p-5 rounded-[2rem] border border-${colour}-100 dark:border-${colour}-800/20 flex flex-col gap-2`}
          >
            <p
              className={`text-[10px] font-black uppercase tracking-widest text-${colour}-600 dark:text-${colour}-400`}
            >
              {label}
            </p>
            <p
              className={`text-3xl font-black italic tracking-tighter text-${colour}-700 dark:text-${colour}-300`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] pl-1">
            Transaction History
          </h2>
          <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 decoration-2 decoration-indigo-200">
            Export List
          </button>
        </div>
        <DataTable<LibraryRow>
          columns={columns}
          data={libraryData}
          emptyMessage="No library transactions found."
        />
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Overdue books attract a fine of रू 5 per day as per school library
          policy.
        </div>
      </div>
    </div>
  );
}
