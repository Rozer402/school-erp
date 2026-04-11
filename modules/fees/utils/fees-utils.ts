/**
 * Business logic utilities for fees module.
 * Pure functions — no API calls, no component logic.
 * Safe to call from both server and client components.
 */

import { FeeStatus } from "@/modules/fees/types";
import type {
  FeeAssignment,
  StudentFeeStats,
  FeeStatusSummary,
  Payment,
} from "@/modules/fees/types";

/**
 * Format amount in paisa to currency string.
 */
export function formatCurrency(paisa: number): string {
  const rupees = paisa / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parse currency input (e.g., "₹1,500") to paisa.
 * Returns null if invalid.
 */
export function parseCurrency(input: string): number | null {
  const cleaned = input.replace(/[^\d]/g, "");
  const paisa = parseInt(cleaned);
  return isNaN(paisa) || paisa < 0 ? null : paisa;
}

/**
 * Check if a payment amount is valid for an assignment.
 */
export function isValidPaymentAmount(
  amount: number,
  assignment: FeeAssignment,
): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }

  if (amount > assignment.dueAmount) {
    return {
      valid: false,
      error: `Amount exceeds due amount (₹${formatCurrency(assignment.dueAmount)})`,
    };
  }

  // Check for fractional paisa (amount must be whole number)
  if (amount % 1 !== 0) {
    return { valid: false, error: "Amount must be in whole paisa" };
  }

  return { valid: true };
}

/**
 * Compute total paid across assignments.
 */
export function computeTotalPaid(assignments: FeeAssignment[]): number {
  return assignments.reduce((sum, a) => sum + a.paidAmount, 0);
}

/**
 * Compute total due across assignments.
 */
export function computeTotalDue(assignments: FeeAssignment[]): number {
  return assignments.reduce((sum, a) => sum + a.dueAmount, 0);
}

/**
 * Generate fees summary for student dashboard.
 */
export function generateStudentFeeStats(
  assignments: FeeAssignment[],
): StudentFeeStats {
  const totalFees = assignments.reduce((sum, a) => sum + a.totalAmount, 0);
  const totalPaid = assignments.reduce((sum, a) => sum + a.paidAmount, 0);
  const totalDue = assignments.reduce((sum, a) => sum + a.dueAmount, 0);

  const paidCount = assignments.filter((a) => a.status === "PAID").length;
  const overdueCount = assignments.filter((a) => a.status === "OVERDUE").length;

  // Find next due date
  const nextDueDate = assignments
    .filter((a) => a.status !== "PAID")
    .map((a) => a.feeStructure?.dueDate)
    .filter(Boolean)
    .sort()
    .at(0);

  return {
    totalFees,
    totalPaid,
    totalDue,
    nextDueDate,
    assignmentCount: assignments.length,
    paidCount,
    overdueCount,
  };
}

/**
 * Generate fee status summary (count by status).
 */
export function generateFeeStatusSummary(
  assignments: FeeAssignment[],
): FeeStatusSummary {
  return {
    PAID: assignments.filter((a) => a.status === "PAID").length,
    PARTIAL: assignments.filter((a) => a.status === "PARTIAL").length,
    DUE: assignments.filter((a) => a.status === "DUE").length,
    OVERDUE: assignments.filter((a) => a.status === "OVERDUE").length,
  };
}

/**
 * Check if student has any overdue fees.
 */
export function hasOverdueFees(assignments: FeeAssignment[]): boolean {
  return assignments.some((a) => a.status === FeeStatus.OVERDUE);
}

/**
 * Get all payments from a list, enriched with assignment & student info.
 * Sorts by date (newest first).
 *
 * Usage:
 *   const allPayments = getAllPayments(payments, assignmentMap);
 *   // Returns: Payment[] with assignmentId and studentName added
 */
export function getAllPayments(
  paymentList: Payment[],
  assignmentMap?: Map<string, FeeAssignment>,
): (Payment & { assignmentId: string; studentName?: string })[] {
  return paymentList
    .map((payment) => {
      const assignment = assignmentMap?.get(payment.assignmentId);
      return {
        ...payment,
        assignmentId: payment.assignmentId,
        studentName: assignment?.student?.name,
      };
    })
    .sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
    );
}

/**
 * Format date to readable string.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get display label for a payment method.
 */
export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    BANK_TRANSFER: "Bank Transfer",
    CHEQUE: "Cheque",
    CASH: "Cash",
    CARD: "Card",
    ONLINE: "Online",
  };
  return labels[method] || method;
}
