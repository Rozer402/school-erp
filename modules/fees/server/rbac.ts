/**
 * ROLE-BASED ACCESS CONTROL — Phase 7
 *
 * What: Centralized role verification functions.
 * Why: Enforce permissions server-side; document role contract explicitly.
 * What to never do:
 *   - Never use these for UI hiding (security theater)
 *   - Never trust role from client cookies
 *   - Never skip role check in server functions
 *   - Never render admin-only sections based on client-side role
 */

import type { Role } from "@/types/auth";

/**
 * ROLE & PERMISSION MATRIX — Phase 7 Specification
 *
 * ┌─────────┬──────────────────┬────────────────────────────┐
 * │ Role    │ View Own Fees?    │ View All Fees?             │
 * ├─────────┼──────────────────┼────────────────────────────┤
 * │ STUDENT │ ✅ Yes           │ ❌ No                      │
 * │ TEACHER │ ❌ No            │ ❌ No                      │
 * │ ADMIN   │ ✅ Yes (others)  │ ✅ Yes (all)               │
 * └─────────┴──────────────────┴────────────────────────────┘
 *
 * ┌─────────┬──────────────────────────────────────────────┐
 * │ Role    │ Record Payment?                              │
 * ├─────────┼──────────────────────────────────────────────┤
 * │ STUDENT │ ❌ No (API validates student === auth user)  │
 * │ TEACHER │ ❌ No (no payment permissions)               │
 * │ ADMIN   │ ✅ Yes (any student)                         │
 * └─────────┴──────────────────────────────────────────────┘
 *
 * ENFORCEMENT LAYERS (DEFENSE IN DEPTH):
 * 1. Middleware: token exists? (via cookies)
 * 2. Server function: role matches permission level
 * 3. API endpoint: backend validates role from JWT
 * 4. Data access: student ID in JWT prevents cross-access
 */

/**
 * Can this role view the fees admin dashboard?
 *
 * @param role User role from auth token
 * @returns true if role has access
 *
 * ✅ ADMIN: Can view all students' fees
 * ❌ STUDENT: Should redirect to /my-fees
 * ❌ TEACHER: Should redirect to /dashboard
 */
export function canViewAllFees(role: Role | undefined): boolean {
  return role === "admin";
}

/**
 * Can this role view their own fees?
 *
 * @param role User role from auth token
 * @returns true if role has access
 *
 * ✅ ADMIN: Can view any student's fees
 * ✅ STUDENT: Can view their own fees
 * ❌ TEACHER: No fee viewing
 */
export function canViewOwnFees(role: Role | undefined): boolean {
  return role === "admin" || role === "student";
}

/**
 * Can this role record a payment?
 *
 * @param role User role from auth token
 * @returns true if role has access
 *
 * ✅ ADMIN: Can record payment for any student
 * ❌ STUDENT: Cannot record (API validates separately)
 * ❌ TEACHER: No payment permissions
 *
 * Note: Endpoint still validates that a student recording their own
 * fee has their ID matching the assignment's studentId.
 */
export function canRecordPayment(role: Role | undefined): boolean {
  return role === "admin";
}

/**
 * Can this role access the fees module at all?
 *
 * @param role User role from auth token
 * @returns true if role has any fees access
 */
export function hasFeesAccess(role: Role | undefined): boolean {
  return canViewAllFees(role) || canViewOwnFees(role);
}

/**
 * VERIFY & THROW ON UNAUTHORIZED
 * Used in server functions to fail-fast if role doesn't match.
 *
 * Pattern:
 *   export async function getFees() {
 *     const user = await getServerUser();
 *     requireFeesAdmin(user?.role);  // ← throws if not admin
 *     ...
 *   }
 */

export function requireFeesAdmin(role: Role | undefined): void {
  if (!canViewAllFees(role)) {
    throw new Error("403: Fees admin access required");
  }
}

export function requireFeesAccess(role: Role | undefined): void {
  if (!hasFeesAccess(role)) {
    throw new Error("403: Fees access required");
  }
}

export function requirePaymentPermission(role: Role | undefined): void {
  if (!canRecordPayment(role)) {
    throw new Error("403: Payment recording permission required");
  }
}

/**
 * WHERE AUTHORIZATION IS ENFORCED
 *
 * Layer 1: Server Components (/app/(dashboard)/fees/page.tsx)
 *   ↓ Calls getServerUser()
 *   ↓ Checks user?.role === "admin"
 *   ↓ Calls getFees() if authorized
 *   ↗ Redirects to /dashboard if not
 *
 * Layer 2: Server Functions (/modules/fees/server/getFees.ts)
 *   ↓ Receives request context
 *   ↓ Could add redundant role check here (defense in depth)
 *   ↓ Calls apiFetchServer()
 *   ↗ Throws on 401/403 (redirected by apiFetchServer)
 *
 * Layer 3: Backend API Endpoint (not in this repo)
 *   ↓ Validates JWT token
 *   ↓ Extracts role from token
 *   ↓ Checks: GET /fees requires role === "admin"
 *   ↗ Returns 403 if check fails
 *
 * Layer 4: Data Filtering (not in this repo)
 *   ↓ Even if someone spoofs the API layer, database queries filter by JWT
 *   ↓ "SELECT * FROM fees WHERE student_id = $1" uses token's userId
 *   ↗ Student can never fetch other students' fees
 *
 * WHY MULTIPLE LAYERS?
 * Not because client-side check is secure (it's not).
 * But because:
 *   1. Early exit = better UX (redirect before showing errors)
 *   2. Debugging = easier to trace where auth failed
 *   3. Defense in depth = if one layer has a bug, others catch it
 *   4. Clear intent = code documents what SHOULD happen
 */

/**
 * WHAT CLIENT COMPONENTS NEVER DO
 *
 * ❌ WRONG: Hiding payment button based on role
 *   if (user?.role === "admin") {
 *     <button>Record Payment</button>  // ← Student can see in HTML source
 *   }
 *
 * ✅ RIGHT: Server component gates access entirely
 *   // Server-side
 *   if (user?.role !== "admin") redirect("/dashboard");
 *
 *   // Client component never runs for non-admins
 *   return <PaymentModal />;  // ← Only rendered if authorized server-side
 *
 * The difference:
 *   - Wrong: Security is theater. Inspect element, modify HTML, submit.
 *   - Right: No HTML sent to client at all. Backend validates every request.
 */
