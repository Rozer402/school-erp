"use client";

import { useState } from "react";
import type { FeeAssignment } from "@/modules/fees/types";
import { PaymentMethod } from "@/modules/fees/types";

type PaymentModalProps = {
  assignment: FeeAssignment;
  onClose: () => void;
};

export default function PaymentModal({
  assignment,
  onClose,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.ONLINE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const maxAmount = assignment.dueAmount;
  const maxAmountDisplay = (maxAmount / 100).toLocaleString();

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/\D/g, "");
    setAmount(numValue);
    setError("");
  };

  const isValidAmount =
    amount &&
    parseInt(amount) > 0 &&
    parseInt(amount) <= maxAmount &&
    parseInt(amount) % 1 === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAmount) {
      setError("Invalid amount. Must be between ₹1 and ₹" + maxAmountDisplay);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          assignmentId: assignment.id,
          amount: parseInt(amount),
          method,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment failed. Please try again.");
      }

      alert("Payment recorded successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Record Payment</h2>
            <p className="text-sm text-gray-600 mt-1">
              {assignment.student?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Fees:</span>
            <span className="font-semibold">
              ₹{(assignment.totalAmount / 100).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Already Paid:</span>
            <span className="font-semibold text-green-600">
              ₹{(assignment.paidAmount / 100).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600 font-semibold">Remaining Due:</span>
            <span className="font-bold text-red-600">
              ₹{(maxAmount / 100).toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Amount</label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">₹</span>
              <input
                type="text"
                value={amount ? (parseInt(amount) / 100).toLocaleString() : ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Max: ₹{maxAmountDisplay}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value={PaymentMethod.ONLINE}>Online</option>
              <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
              <option value={PaymentMethod.CHEQUE}>Cheque</option>
              <option value={PaymentMethod.CASH}>Cash</option>
              <option value={PaymentMethod.CARD}>Card</option>
            </select>
          </div>

          {error && (
            <div className="text-sm text-red-600 font-semibold">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValidAmount || isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
