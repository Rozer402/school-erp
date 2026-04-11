"use client";

import { buildTimeline } from "../utils/timeline";
import type { Payment } from "@/modules/fees/types";
import { PaymentMethod } from "@/modules/fees/types";

type FeeTimelineProps = {
  assignment: {
    totalAmount: number;
    createdAt: string;
  };
  payments: Payment[];
  setSelectedPayment: (p: Payment) => void;
};

export function FeeTimeline({
  assignment,
  payments,
  setSelectedPayment,
}: FeeTimelineProps) {
  const timeline = buildTimeline(assignment, payments);

  if (!timeline || timeline.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No payments available</p>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`h-2 w-2 rounded-full ${
                item.type === "PAID" ? "bg-green-500" : "bg-indigo-500"
              }`}
            />
            <div className="flex-1 w-[1px] bg-border" />
          </div>

          <div>
            <p className="text-sm font-medium">
              {item.type === "PAID"
                ? `Paid ₹${item.amount}`
                : `Fee assigned ₹${item.amount}`}
            </p>

            <p className="text-xs text-muted-foreground">{item.date}</p>

            {item.type === "PAID" && (
              <button
                onClick={() =>
                  setSelectedPayment({
                    id: "temp-id",
                    assignmentId: "temp",
                    amount: item.amount,
                    paidAt: item.date,
                    method: PaymentMethod.CASH,
                    receiptNo: "RCP-TEMP",
                    receiptDate: item.date,
                    createdAt: item.date,
                    updatedAt: item.date,
                  })
                }
                className="text-xs text-indigo-500 mt-1"
              >
                View Receipt
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
