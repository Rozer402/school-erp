"use client";

/**
 * DataTable — reusable, fully-typed Client Component.
 *
 * Props are 100% serialisable (no render functions), making it safe to use
 * from both Server Components and Client Components.
 *
 * Usage:
 *   <DataTable<MyRow> columns={columns} data={rows} />
 *
 * Where `columns` is ColumnDef<MyRow>[] — see @/types/table.
 */

import { CellRenderer } from "@/components/shared/CellRenderer";
import type { DataTableProps } from "@/types/table";

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <tbody className="divide-y divide-border/30">
      {Array.from({ length: 5 }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-8 py-5">
              <div className="h-3 rounded-full bg-muted/50" style={{ width: `${60 + (c * 17) % 30}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyRow({ message, cols }: { message: string; cols: number }) {
  return (
    <tbody>
      <tr>
        <td colSpan={cols}>
          <div className="w-full py-16 text-center text-muted-foreground flex flex-col items-center gap-4">
            <div className="p-4 bg-muted/20 rounded-full">
              <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="font-black text-foreground">Empty Dataset</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "No data available.",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden bg-white dark:bg-card border border-border/50 rounded-3xl shadow-sm group">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          {/* Head */}
          <thead>
            <tr className="bg-muted/30 border-b border-border/50">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          {isLoading ? (
            <TableSkeleton cols={columns.length} />
          ) : data.length === 0 ? (
            <EmptyRow message={emptyMessage} cols={columns.length} />
          ) : (
            <tbody className="divide-y divide-border/30">
              {data.map((row, ri) => (
                <tr
                  key={ri}
                  className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-colors group/row"
                >
                  {columns.map((col, ci) => {
                    const value = row[col.accessor as string];
                    return (
                      <td
                        key={ci}
                        className="px-8 py-5 text-sm font-bold text-foreground whitespace-nowrap transition-all group-hover/row:pl-9"
                      >
                        {col.cell ? (
                          <CellRenderer
                            value={value}
                            row={row as Record<string, unknown>}
                            config={col.cell}
                          />
                        ) : (
                          <span>{value != null ? String(value) : "—"}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
