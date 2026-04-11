"use client";

import type { FeeStatus } from "@/modules/fees/types";

type StatusBadgeProps = {
  status: FeeStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    PAID: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    DUE: "bg-red-100 text-red-800",
    OVERDUE: "bg-red-900 text-white",
  };

  const labels = {
    PAID: "Paid",
    PARTIAL: "Partial",
    DUE: "Due",
    OVERDUE: "Overdue",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
