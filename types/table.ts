/**
 * Serialisable cell render configuration.
 *
 * These plain objects are safe to pass from Server Components to Client
 * Components across the RSC boundary — no functions, no closures.
 */

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

export type BadgeVariant =
  // Fees
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Upcoming"
  // Library
  | "Returned"
  | "Issued"
  // Leave
  | "Approved"
  | "Rejected"
  // Attendance
  | "Excellent"
  | "Average"
  | "Low";

// ---------------------------------------------------------------------------
// Cell configs — one type per visual pattern
// ---------------------------------------------------------------------------

/** Plain text, rendered as-is (optionally bolded / muted). */
export type TextCellConfig = {
  type: "text";
  bold?: boolean;
  muted?: boolean;
};

/** Monospace identifier style (IDs, codes). */
export type CodeCellConfig = {
  type: "code";
};

/** Currency amount: prepends a prefix symbol (default "₹"). */
export type AmountCellConfig = {
  type: "amount";
  prefix?: string; // e.g. "₹" | "$"
};

/**
 * Status badge pill. Colour is determined automatically from the value
 * string against the BadgeVariant map inside CellRenderer.
 */
export type BadgeCellConfig = {
  type: "badge";
};

/**
 * Attendance progress bar + percentage label.
 * Requires the row to have a `percentage` numeric field.
 * Pass that field name via `percentageKey`.
 */
export type ProgressCellConfig = {
  type: "progress";
  percentageKey: string; // key on the row object that holds the 0–100 number
};

/**
 * Attendance status icon + label (Excellent / Average / Low).
 * Derived from the same percentage value as ProgressCellConfig.
 */
export type AttendanceStatusCellConfig = {
  type: "attendance-status";
  percentageKey: string;
};

/**
 * Combined two-key display, e.g. "35 / 40".
 */
export type CombinedCellConfig = {
  type: "combined";
  secondKey: string; // second field name on the row object
  separator?: string; // default " / "
};

// Union of all configs
export type CellConfig =
  | TextCellConfig
  | CodeCellConfig
  | AmountCellConfig
  | BadgeCellConfig
  | ProgressCellConfig
  | AttendanceStatusCellConfig
  | CombinedCellConfig;

// ---------------------------------------------------------------------------
// Column definition — fully serialisable, safe across RSC boundary
// ---------------------------------------------------------------------------

export type ColumnDef<T> = {
  header: string;
  /** Key of the field on T that this column reads. */
  accessor: keyof T;
  /** Declarative render config — no functions allowed here. */
  cell?: CellConfig;
};

// ---------------------------------------------------------------------------
// DataTable props
// ---------------------------------------------------------------------------

export type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
};
