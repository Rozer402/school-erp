"use client";

import { useState } from "react";
import type { FeeAssignment } from "@/modules/fees/types";
import StatusBadge from "./StatusBadge";
import PaymentModal from "./PaymentModal";

type StudentFeeTableClientProps = {
  initialData: FeeAssignment[];
};

export default function StudentFeeTableClient({
  initialData,
}: StudentFeeTableClientProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<FeeAssignment | null>(null);

  const totalFees = initialData.reduce((sum, a) => sum + a.totalAmount, 0);
  const totalPaid = initialData.reduce((sum, a) => sum + a.paidAmount, 0);
  const totalDue = initialData.reduce((sum, a) => sum + a.dueAmount, 0);
  const overdueCount = initialData.filter((a) => a.status === "OVERDUE").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            Total Fees
          </p>
          <p className="text-2xl font-bold mt-2">
            ₹{(totalFees / 100).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            Total Paid
          </p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ₹{(totalPaid / 100).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            Total Due
          </p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹{(totalDue / 100).toLocaleString()}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            Overdue Items
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {overdueCount}
          </p>
        </div>
      </div>

      {/* Fee Assignments Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-sm">
                Academic Year
              </th>
              <th className="text-left px-6 py-3 font-semibold text-sm">
                Class
              </th>
              <th className="text-right px-6 py-3 font-semibold text-sm">
                Total
              </th>
              <th className="text-right px-6 py-3 font-semibold text-sm">
                Paid
              </th>
              <th className="text-right px-6 py-3 font-semibold text-sm">
                Due
              </th>
              <th className="text-center px-6 py-3 font-semibold text-sm">
                Status
              </th>
              <th className="text-center px-6 py-3 font-semibold text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialData.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{assignment.academicYear}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {assignment.class?.name || assignment.classId}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold">
                  ₹{(assignment.totalAmount / 100).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-right text-green-600 font-semibold">
                  ₹{(assignment.paidAmount / 100).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-right text-red-600 font-semibold">
                  ₹{(assignment.dueAmount / 100).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={assignment.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                  >
                    Pay Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!initialData.length && (
        <div className="text-center py-12 text-gray-500">
          No fee assignments found
        </div>
      )}

      {selectedAssignment && (
        <PaymentModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
}
