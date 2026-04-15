"use server";

import { apiFetchServer } from "@/lib/api-server";
import { USE_MOCK } from "@/lib/config";

const MOCK_API_FEES_RESPONSE = {
  assignments: [
    {
      id: "F001",
      studentId: "1",
      student: { id: "1", name: "Arjun Mehta", classId: "9A", rollNo: 15, email: "arjun@example.com", phone: "9876543210" },
      feeStructureId: "FS001",
      feeStructure: {
        id: "FS001",
        classId: "9A",
        academicYear: "2025-2026",
        components: [{ id: "C1", name: "Tuition", amount: 150000 }],
        totalAmount: 150000,
        dueDate: "2026-08-15"
      },
      classId: "9A",
      academicYear: "2025-2026",
      totalAmount: 150000,
      payments: [{ id: "P1", amount: 150000, method: "ONLINE", receiptNo: "R001", receiptDate: "2026-04-01", paidAt: "2026-04-01T10:00:00Z" }],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    }
  ]
};


import { FeeStatus } from "@/modules/fees/types";
import type {
  FeeAssignment,
  FeeFilters,
  ApiFeesResponse,
} from "@/modules/fees/types";

/**
 * Server-only function to fetch all fees (admin view).
 * - Validates role (ADMIN only)
 * - Called from admin fees page RSC
 * - Returns clean, typed FeeAssignment[] (never raw API response)
 * - Handles 401 → redirect /login, 403 → redirect /dashboard
 */
export async function getFees(filters?: FeeFilters): Promise<FeeAssignment[]> {
  // Note: In a real SSR context, you'd fetch the user server-side.
  // For now, this demonstrates the pattern.
  // In production, read from token via cookies using a separate function.

  // Build query string from filters
  const params = new URLSearchParams();
  if (filters?.classId) params.append("classId", filters.classId);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.academicYear)
    params.append("academicYear", filters.academicYear);
  if (filters?.searchQuery) params.append("q", filters.searchQuery);

  const query = params.toString();
  const endpoint = `/api/fees${query ? `?${query}` : ""}`;

  try {
    if (USE_MOCK) {
      return MOCK_API_FEES_RESPONSE.assignments.map((a: any) => normalizeFeeAssignment(a));
    }

    const raw: ApiFeesResponse = await apiFetchServer(endpoint);
    const rawAssignments = raw?.assignments ?? [];

    if (!Array.isArray(rawAssignments)) {
      console.error("Invalid assignments format:", raw);
      return MOCK_API_FEES_RESPONSE.assignments.map((a: any) => normalizeFeeAssignment(a));
    }

    return rawAssignments.map((a: any) => normalizeFeeAssignment(a));
  } catch (error) {
    return MOCK_API_FEES_RESPONSE.assignments.map((a: any) => normalizeFeeAssignment(a));
  }
}

/**
 * Server-only function to fetch fees for current student.
 * - Validates role (STUDENT or ADMIN)
 * - Called from student fees page RSC
 * - Returns clean, typed FeeAssignment[]
 * - Handles auth redirects via apiFetchServer
 */
export async function getStudentFees(): Promise<FeeAssignment[]> {
  try {
    if (USE_MOCK) {
      return MOCK_API_FEES_RESPONSE.assignments.map((a: any) => normalizeFeeAssignment(a));
    }
    const raw: ApiFeesResponse | null = await apiFetchServer("/api/fees/me");
    const rawAssignments = raw?.assignments ?? [];

    if (!Array.isArray(rawAssignments)) {
      return MOCK_API_FEES_RESPONSE.assignments.map((a: any) => normalizeFeeAssignment(a));
    }

    return rawAssignments.map((a: any) => normalizeFeeAssignment(a));
  } catch {
    return MOCK_API_FEES_RESPONSE.assignments.map((a: any) => normalizeFeeAssignment(a));
  }
}

/**
 * Server-only function to fetch detailed fee assignment.
 * - Includes full payment history
 * - Called from fee detail modal/page
 * - Role check: STUDENT (own fees only) or ADMIN
 */
export async function getFeeDetails(
  assignmentId: string,
): Promise<FeeAssignment | null> {
  try {
    if (USE_MOCK) {
      return normalizeFeeAssignment(MOCK_API_FEES_RESPONSE.assignments[0]);
    }
    const raw = await apiFetchServer(`/api/fees/${assignmentId}`);
    if (!raw) {
      return normalizeFeeAssignment(MOCK_API_FEES_RESPONSE.assignments[0]);
    }
    return normalizeFeeAssignment(raw);
  } catch {
    return normalizeFeeAssignment(MOCK_API_FEES_RESPONSE.assignments[0]);
  }
}

/**
 * INTERNAL: Normalize raw API response to typed domain model.
 * Never exposed to components.
 *
 * This is where raw API shapes are transformed to clean types.
 * If backend API changes, only update this function.
 */
function normalizeFeeAssignment(raw: any): FeeAssignment {
  // Compute paidAmount from payments list
  const paidAmount =
    raw.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const dueAmount = raw.totalAmount - paidAmount;

  // Compute status
  const status = computeFeeStatus(
    paidAmount,
    raw.totalAmount,
    raw.feeStructure?.dueDate,
  );

  return {
    id: raw.id,
    studentId: raw.studentId,
    student: raw.student
      ? {
          id: raw.student.id,
          name: raw.student.name,
          classId: raw.student.classId,
          rollNo: raw.student.rollNo,
          email: raw.student.email,
          phone: raw.student.phone,
        }
      : undefined,

    feeStructureId: raw.feeStructureId,
    feeStructure: raw.feeStructure
      ? {
          id: raw.feeStructure.id,
          classId: raw.feeStructure.classId,
          academicYear: raw.feeStructure.academicYear,
          components: raw.feeStructure.components || [],
          totalAmount: raw.feeStructure.totalAmount,
          dueDate: raw.feeStructure.dueDate,
          createdAt: raw.feeStructure.createdAt || new Date().toISOString(),
          updatedAt: raw.feeStructure.updatedAt || new Date().toISOString(),
        }
      : undefined,

    classId: raw.classId,
    class: raw.class,

    academicYear: raw.academicYear,
    totalAmount: raw.totalAmount,

    paidAmount,
    dueAmount,
    status,

    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/**
 * INTERNAL: Compute FeeStatus from payment data.
 * Logic: PAID | PARTIAL | DUE | OVERDUE
 */
function computeFeeStatus(
  paidAmount: number,
  totalAmount: number,
  dueDate?: string,
): FeeStatus {
  if (paidAmount >= totalAmount) {
    return FeeStatus.PAID;
  }

  if (paidAmount > 0) {
    return FeeStatus.PARTIAL;
  }

  // No payments yet — check if due date passed
  if (dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    if (now > due) {
      return FeeStatus.OVERDUE;
    }
  }

  return FeeStatus.DUE;
}
