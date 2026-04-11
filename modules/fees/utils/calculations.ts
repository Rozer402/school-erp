/**
 * BUSINESS LOGIC LAYER — Phase 6
 *
 * What: Pure functions for fees calculations and validation.
 * Why: Isolate logic from components so it's unit-testable, server-safe, and reusable.
 * What to never do:
 *   - Never make API calls
 *   - Never use React hooks
 *   - Never access global state
 *   - Never have side effects (console.log is ok for debugging)
 */

import { FeeStatus } from "@/modules/fees/types";
import type { FeeAssignment, Payment } from "@/modules/fees/types";

/**
 * Calculate fee status from paid amount vs total.
 * Pure function — same input always produces same output.
 *
 * @param assignment The fee assignment
 * @param payments Optional payment list (uses assignment.paidAmount if not provided)
 * @returns FeeStatus: PAID | PARTIAL | DUE | OVERDUE
 *
 * Logic:
 *   1. If paid >= total → PAID (fully satisfied)
 *   2. If paid > 0 and paid < total → PARTIAL (partial payment)
 *   3. If paid === 0 and before dueDate → DUE (payment expected soon)
 *   4. If paid === 0 and after dueDate → OVERDUE (late)
 */
export function calculateStatus(
  assignment: FeeAssignment,
  payments?: Payment[],
): FeeStatus {
  // Use provided payments or fall back to assignment.paidAmount
  const paidAmount = payments
    ? payments.reduce((sum, p) => sum + p.amount, 0)
    : assignment.paidAmount;

  const totalAmount = assignment.totalAmount;

  // Rule 1: Fully paid
  if (paidAmount >= totalAmount) {
    return FeeStatus.PAID;
  }

  // Rule 2: Partially paid
  if (paidAmount > 0) {
    return FeeStatus.PARTIAL;
  }

  // Rules 3 & 4: Nothing paid — check due date
  if (!assignment.feeStructure?.dueDate) {
    // No due date provided — assume it's due (pessimistic)
    return FeeStatus.DUE;
  }

  const now = new Date();
  const dueDate = new Date(assignment.feeStructure.dueDate);

  return now > dueDate ? FeeStatus.OVERDUE : FeeStatus.DUE;
}

/**
 * Calculate remaining due amount.
 *
 * @param assignment The fee assignment
 * @param payments Optional payment list
 * @returns Due amount in paisa
 *
 * Formula: totalAmount - paidAmount
 * Never returns negative (cap at 0)
 */
export function calculateDue(
  assignment: FeeAssignment,
  payments?: Payment[],
): number {
  const paidAmount = payments
    ? payments.reduce((sum, p) => sum + p.amount, 0)
    : assignment.paidAmount;

  const due = assignment.totalAmount - paidAmount;
  return Math.max(0, due); // Never negative
}

/**
 * Calculate total paid amount from list.
 *
 * @param payments Payment list
 * @returns Total amount paid in paisa
 */
export function calculateTotalPaid(payments: Payment[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Validate a payment amount for an assignment.
 *
 * @param amount Amount in paisa to validate
 * @param dueAmount Currently due amount in paisa
 * @returns { valid: boolean; reason?: string }
 *
 * Checks:
 *   1. Amount must be > 0 (no zero/negative payments)
 *   2. Amount must be <= due (no overpayment)
 *   3. Amount must be numeric (no NaN)
 *   4. Amount must be whole paisa (no fractional)
 */
export function validatePayment(
  amount: number,
  dueAmount: number,
): {
  valid: boolean;
  reason?: string;
} {
  // Check 1: Numeric
  if (!Number.isFinite(amount)) {
    return { valid: false, reason: "Amount must be a number" };
  }

  // Check 2: Positive
  if (amount <= 0) {
    return {
      valid: false,
      reason: "Amount must be greater than 0",
    };
  }

  // Check 3: Not exceeding due
  if (amount > dueAmount) {
    return {
      valid: false,
      reason: `Amount exceeds due amount (₹${(dueAmount / 100).toFixed(2)})`,
    };
  }

  // Check 4: Whole paisa
  if (amount % 1 !== 0) {
    return {
      valid: false,
      reason: "Amount must be in whole paisa",
    };
  }

  return { valid: true };
}

/**
 * Check if a payment would overpay (exceed due amount).
 *
 * @param amount Amount to pay in paisa
 * @param dueAmount Current due in paisa
 * @returns true if amount > due
 */
export function isOverpayment(amount: number, dueAmount: number): boolean {
  return amount > dueAmount;
}

/**
 * Check if payment would settle the entire fee.
 *
 * @param amount Amount to pay in paisa
 * @param dueAmount Current due in paisa
 * @returns true if amount >= due
 */
export function willSettleDebt(amount: number, dueAmount: number): boolean {
  return amount >= dueAmount;
}

/**
 * Calculate remaining balance after a payment.
 *
 * @param currentDue Current due in paisa
 * @param paymentAmount Payment amount in paisa
 * @returns New due amount (never negative)
 */
export function calculateBalanceAfterPayment(
  currentDue: number,
  paymentAmount: number,
): number {
  const newDue = currentDue - paymentAmount;
  return Math.max(0, newDue);
}

/**
 * Check if an assignment is overdue.
 *
 * @param assignment The fee assignment
 * @returns true if status is OVERDUE
 */
export function isOverdue(assignment: FeeAssignment): boolean {
  return assignment.status === "OVERDUE";
}

/**
 * Check if an assignment is fully paid.
 *
 * @param assignment The fee assignment
 * @returns true if status is PAID
 */
export function isPaid(assignment: FeeAssignment): boolean {
  return assignment.status === "PAID";
}

/**
 * Check if an assignment has any payments.
 *
 * @param assignment The fee assignment
 * @returns true if paidAmount > 0
 */
export function hasPayments(assignment: FeeAssignment): boolean {
  return assignment.paidAmount > 0;
}

/**
 * Calculate the percentage of fee paid.
 *
 * @param assignment The fee assignment
 * @returns Percentage (0-100)
 */
export function calculatePaymentPercentage(assignment: FeeAssignment): number {
  if (assignment.totalAmount === 0) return 0;
  return (assignment.paidAmount / assignment.totalAmount) * 100;
}

/**
 * Group assignments by status.
 *
 * @param assignments List of fee assignments
 * @returns Object with status as keys, arrays as values
 */
export function groupByStatus(
  assignments: FeeAssignment[],
): Record<FeeStatus, FeeAssignment[]> {
  return {
    PAID: assignments.filter((a) => a.status === "PAID"),
    PARTIAL: assignments.filter((a) => a.status === "PARTIAL"),
    DUE: assignments.filter((a) => a.status === "DUE"),
    OVERDUE: assignments.filter((a) => a.status === "OVERDUE"),
  };
}

/**
 * Calculate aggregate statistics across assignments.
 *
 * @param assignments List of fee assignments
 * @returns { totalFees, totalPaid, totalDue, overdueCount }
 */
export function calculateAggregateStats(assignments: FeeAssignment[]): {
  totalFees: number;
  totalPaid: number;
  totalDue: number;
  overdueCount: number;
  paidCount: number;
  partialCount: number;
  dueCount: number;
} {
  return {
    totalFees: assignments.reduce((sum, a) => sum + a.totalAmount, 0),
    totalPaid: assignments.reduce((sum, a) => sum + a.paidAmount, 0),
    totalDue: assignments.reduce((sum, a) => sum + a.dueAmount, 0),
    overdueCount: assignments.filter((a) => a.status === "OVERDUE").length,
    paidCount: assignments.filter((a) => a.status === "PAID").length,
    partialCount: assignments.filter((a) => a.status === "PARTIAL").length,
    dueCount: assignments.filter((a) => a.status === "DUE").length,
  };
}
