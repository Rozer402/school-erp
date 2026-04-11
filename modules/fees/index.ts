/**
 * Fees Module Barrel Export
 * Centralized exports for types, server functions, and utilities.
 *
 * Usage:
 *   import { FeeAssignment, getFees, formatCurrency } from "@/modules/fees"
 */

// Types
export type {
  Student,
  Class,
  FeeStructure,
  FeeComponent,
  FeeAssignment,
  Payment,
  Receipt,
  AcademicYear,
  FeeFilters,
  PaginationMeta,
  PaginatedResponse,
  FeeStatusSummary,
  StudentFeeStats,
  ApiFeesResponse,
} from "./types";

// Enums (runtime exports)
export { FeeStatus, PaymentMethod } from "./types";

// Server functions
export { getFees, getStudentFees, getFeeDetails } from "./server/getFees";

export { getServerUser } from "./server/getServerUser";

// Server constants
export {
  FEES_API_BASE,
  PAYMENTS_API_BASE,
  FEES_ALLOWED_ROLES,
  FEES_ADMIN_ROLES,
  CURRENCY,
  CURRENCY_SYMBOL,
} from "./server/constants";

// RBAC (Role-Based Access Control)
export {
  canViewAllFees,
  canViewOwnFees,
  canRecordPayment,
  hasFeesAccess,
  requireFeesAdmin,
  requireFeesAccess,
  requirePaymentPermission,
} from "./server/rbac";

// Utilities (Formatting, etc.)
export {
  formatCurrency,
  parseCurrency,
  isValidPaymentAmount,
  computeTotalPaid,
  computeTotalDue,
  generateStudentFeeStats,
  generateFeeStatusSummary,
  hasOverdueFees,
  getAllPayments,
  formatDate,
  getPaymentMethodLabel,
} from "./utils/fees-utils";

// Business Logic (Calculations)
export {
  calculateStatus,
  calculateDue,
  calculateTotalPaid,
  validatePayment,
  isOverpayment,
  willSettleDebt,
  calculateBalanceAfterPayment,
  isOverdue,
  isPaid,
  hasPayments,
  calculatePaymentPercentage,
  groupByStatus,
  calculateAggregateStats,
} from "./utils/calculations";

// Client Mutations (React Query)
export { payFee, usePayFee, parsePaymentError } from "./api/client";
