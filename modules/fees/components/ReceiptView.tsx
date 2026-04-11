import React from "react";
import { SCHOOL } from "@/config/school";

type ReceiptViewProps = {
  receiptId: string;
  studentName: string;
  amount: number;
  date: string;
  status: string;
};

export default function ReceiptView({
  receiptId,
  studentName,
  amount,
  date,
  status,
}: ReceiptViewProps) {
  return (
    <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-md mx-auto space-y-4 print:shadow-none print:border print:border-border print:max-w-full print:p-8">
      {/* School Header */}
      <div className="text-center">
        <p className="font-bold text-lg">{SCHOOL.name}</p>
        <p className="text-xs">{SCHOOL.location}</p>
      </div>
      <hr />
      {/* Receipt Title */}
      <h2 className="text-center font-semibold">Payment Receipt</h2>
      {/* Details */}
      <div className="space-y-1 text-sm">
        <p>Receipt No: {receiptId}</p>
        <p>Student: {studentName}</p>
        <p>Amount Paid: ₹{amount}</p>
        <p>Date: {date}</p>
      </div>
      {/* Status */}
      <div className="text-center">
        <span className="text-green-600 font-medium">{status}</span>
      </div>
      <div className="flex justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}
