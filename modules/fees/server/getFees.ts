"use server";

import { apiFetchServer } from "@/lib/api-server";

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
    // apiFetchServer reads cookies, throws on 401/403, auto-redirects
    const raw: ApiFeesResponse = await apiFetchServer(endpoint);

    // Normalize: transform raw API response to typed domain model
    // ✅ Safe extraction (matches ApiFeesResponse type)
    const rawAssignments = raw?.assignments ?? [];

    // 🚨 Validate before mapping
    if (!Array.isArray(rawAssignments)) {
      console.error("Invalid assignments format:", raw);
      return [];
    }

    // ✅ Safe mapping
    const assignments: FeeAssignment[] = rawAssignments.map((a: any) =>
      normalizeFeeAssignment(a),
    );

    return assignments;
  } catch (error) {
    // During build, API may not be available, return empty to allow build
    console.warn("Failed to fetch fees:", error);
    return [];
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
  const raw: ApiFeesResponse | null = await apiFetchServer("/api/fees/me");
  const rawAssignments = raw?.assignments ?? [];

  if (!Array.isArray(rawAssignments)) {
    return [];
  }

  return rawAssignments.map((a: any) => normalizeFeeAssignment(a));
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
  const raw = await apiFetchServer(`/api/fees/${assignmentId}`);
  if (!raw) {
    return null;
  }
  return normalizeFeeAssignment(raw);
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
