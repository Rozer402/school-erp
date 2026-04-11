"use client";

import { useState } from "react";
import type { FeeAssignment, Payment } from "@/modules/fees/types";
import { PaymentMethod } from "@/modules/fees/types";
import StatusBadge from "./StatusBadge";
import { FeeTimeline } from "./FeeTimeline";
import ReceiptView from "./ReceiptView";

type FeeTableClientProps = {
  initialData: FeeAssignment[];
};

export function FeeTable({ initialData }: FeeTableClientProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<FeeAssignment | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold">
                Student
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold">
                Class
              </th>
              <th className="text-right px-6 py-3 text-sm font-semibold">
                Total
              </th>
              <th className="text-right px-6 py-3 text-sm font-semibold">
                Paid
              </th>
              <th className="text-right px-6 py-3 text-sm font-semibold">
                Due
              </th>
              <th className="text-center px-6 py-3 text-sm font-semibold">
                Status
              </th>
              <th className="text-center px-6 py-3 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {initialData.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">
                  {assignment.student?.name || "N/A"}
                </td>

                <td className="px-6 py-4 text-sm">
                  {assignment.class?.name || assignment.classId}
                </td>

                <td className="px-6 py-4 text-sm text-right">
                  ₹{(assignment.totalAmount / 100).toLocaleString()}
                </td>

                <td className="px-6 py-4 text-sm text-right text-green-600">
                  ₹{(assignment.paidAmount / 100).toLocaleString()}
                </td>

                <td className="px-6 py-4 text-sm text-right text-red-600">
                  ₹{(assignment.dueAmount / 100).toLocaleString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <StatusBadge status={assignment.status} />
                </td>

                <td className="px-6 py-4 text-center space-x-2">
                  {/* Timeline Button */}
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="text-indigo-600 text-xs"
                  >
                    Timeline
                  </button>

                  {/* Mock Receipt Button */}
                  <button
                    onClick={() =>
                      setReceiptPayment({
                        id: "demo",
                        assignmentId: assignment.id,
                        amount: assignment.paidAmount,
                        paidAt: new Date().toISOString(),
                        method: PaymentMethod.CASH,
                        receiptNo: "RCP-DEMO",
                        receiptDate: new Date().toISOString(),
                        createdAt: "",
                        updatedAt: "",
                      })
                    }
                    className="text-green-600 text-xs"
                  >
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TIMELINE MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-6 w-full max-w-lg">
            <button
              className="mb-4 text-sm text-gray-500"
              onClick={() => setSelectedAssignment(null)}
            >
              Close
            </button>

            <FeeTimeline
              assignment={{
                totalAmount: selectedAssignment.totalAmount,
                createdAt: selectedAssignment.createdAt,
              }}
              payments={[]}
              setSelectedPayment={setReceiptPayment}
            />
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl">
            <button
              className="mb-4 text-sm"
              onClick={() => setReceiptPayment(null)}
            >
              Close
            </button>

            <ReceiptView
              studentName="Demo Student"
              amount={receiptPayment.amount / 100}
              date={receiptPayment.paidAt}
              receiptId={receiptPayment.receiptNo}
              status="SUCCESS"
            />
          </div>
        </div>
      )}
    </div>
  );
}
