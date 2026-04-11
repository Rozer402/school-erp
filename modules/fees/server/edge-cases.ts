/**
 * EDGE CASE HARDENING — Phase 9
 *
 * What: Explicit handling for every failure mode.
 * Why: Production apps fail in ways you haven't imagined. Prepare for them.
 * What to never do:
 *   - Never "assume" a case won't happen
 *   - Never log raw errors to UI (confuses users)
 *   - Never silently retry (user loses trust)
 *   - Never leave a mutation in isPending state forever
 */

import type { FeeAssignment } from "@/modules/fees/types";

/**
 * FAILURE MODE MATRIX — Phase 9 Specification
 *
 * Every row = a thing that can go wrong.
 * Every column = where it's caught and handled.
 *
 * ┌────────────────────────────┬──────────────────┬────────────────────┬──────────────┐
 * │ Scenario                   │ Layer            │ Signal             │ User Message │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Network timeout            │ apiFetchClient   │ Promise rejects    │ "Connection  │
 * │                            │                  │ (no response)      │  failed"     │
 * │                            │                  │                    │ Retry button │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Backend 500                │ apiFetchClient   │ HTTP 500           │ "Server      │
 * │                            │                  │ res.ok = false     │  error"      │
 * │                            │                  │                    │ Retry button │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Invalid amount             │ validatePayment()│ isValidAmount      │ "Check your  │
 * │ (negative, zero, > due)    │ (Phase 6)        │ = false            │  amount"     │
 * │                            │                  │ before submit      │ Submit button│
 * │                            │                  │ already disabled   │ locked       │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Duplicate payment (409)    │ parsePaymentErr()│ HTTP 409           │ "Already     │
 * │ within 60 sec window       │ (Phase 5)        │ message.includes   │  recorded"   │
 * │                            │                  │ ("409")            │ Retry with   │
 * │                            │                  │                    │ diff. amount │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Session expired (401)      │ apiFetchClient   │ HTTP 401 Unauth.   │ "Session     │
 * │ cookie invalid or expired  │ + onError        │ throws             │  expired"    │
 * │                            │                  │                    │ Redirect to  │
 * │                            │                  │                    │ login        │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Student accessing other    │ Server (403)     │ HTTP 403 Forbidden │ "Access      │
 * │ student's fee              │ Backend check    │ (backend validates │  denied"     │
 * │                            │                  │ studentId === JWT) │ apiFetchSrvr │
 * │                            │                  │                    │ redirects    │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Non-admin accessing admin  │ Server page      │ getServerUser()    │ Redirect to  │
 * │ /fees route                │ + getBfees()     │ checks role        │ /dashboard   │
 * │                            │                  │ before data fetch  │ server-side  │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Amount > due (overpayment) │ validatePayment()│ isOverpayment()    │ "Exceeds due │
 * │                            │ + isOverpayment()│ = true             │  amount"     │
 * │                            │ (Phase 6)        │ Form validation    │ Submit locked│
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ NaN or non-numeric input   │ validatePayment()│ !Number.isFinite() │ "Invalid     │
 * │                            │ (Phase 6)        │ = true             │  amount"     │
 * │                            │                  │                    │ Submit locked│
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Double-submit (rapid click)│ React Query      │ mutationFn called  │ Button       │
 * │                            │ mutation pending │ once, 2nd click    │ disabled     │
 * │                            │                  │ ignored (isPending)│ during       │
 * │                            │                  │                    │ isPending    │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Backend malformed response │ apiFetchClient   │ JSON.parse throws  │ "Server      │
 * │ (not valid JSON)           │ JSON.parse catch │ OR res.ok=false    │  error"      │
 * │                            │                  │                    │ Retry        │
 * ├────────────────────────────┼──────────────────┼────────────────────┼──────────────┤
 * │ Optimistic update rolls    │ onError()        │ context.previous   │ Form reverts │
 * │ back on error              │ queryClient.set  │ Assignment set     │ to pre-       │
 * │                            │ QueryData        │ back to cache      │  mutation    │
 * │                            │                  │                    │  state       │
 * └────────────────────────────┴──────────────────┴────────────────────┴──────────────┘
 */

/**
 * HANDLING: Network Timeout
 *
 * Where caught: apiFetchClient (network layer)
 * Signal: Promise never resolves or rejects with NetworkError
 * User sees: Loading spinner hangs, eventually timeout
 *
 * Solution:
 *   - Set fetch timeout (manually via AbortController)
 *   - onError() catches and rolls back optimistic
 *   - Toast: "Connection failed. Check your internet."
 *   - Provide retry button
 *
 * Implementation:
 *   const controller = new AbortController();
 *   const timeoutId = setTimeout(() => controller.abort(), 10000);  // 10s timeout
 *   fetch(url, { signal: controller.signal, ... })
 */
export function handleNetworkError(error: Error): {
  userMessage: string;
  recoverable: boolean;
} {
  if (error.message === "Failed to fetch" || error.name === "AbortError") {
    return {
      userMessage: "Connection failed. Please check your internet.",
      recoverable: true, // User can retry
    };
  }

  return {
    userMessage: "Network error. Please try again.",
    recoverable: true,
  };
}

/**
 * HANDLING: Duplicate Payment (409)
 *
 * Where caught: parsePaymentError() + onError()
 * Signal: HTTP 409 Conflict
 * Reason: Backend detects same amount from same student < 60sec
 * User sees: Payment fails, UI reverts
 *
 * Solution:
 *   - Toast: "Payment already recorded. Refresh to see."
 *   - Invalidate cache so next access shows fresh data
 *   - Don't auto-retry (user intended this)
 *
 * Implementation: Already in Phase 5 parsePaymentError()
 */
export function handleDuplicatePayment(): {
  userMessage: string;
  recoverable: boolean;
} {
  return {
    userMessage:
      "This payment was already recorded. Refresh to view your updated balance.",
    recoverable: false, // Don't retry immediately
  };
}

/**
 * HANDLING: Session Expired (401)
 *
 * Where caught: apiFetchClient + onError()
 * Signal: HTTP 401 Unauthorized
 * Cause: Cookie expired or JWT invalid
 * User sees: Payment fails, modal might stay open
 *
 * Solution:
 *   - Toast: "Session expired. Logging you out..."
 *   - Roll back optimistic update
 *   - Redirect to /login via client router
 *   - OR: Server-side apiFetchServer handles auto-redirect
 *
 * Implementation: See api/client.ts onError() handler
 */
export function handleSessionExpired(): {
  userMessage: string;
  recoverable: boolean;
  automaticRedirect: boolean;
} {
  return {
    userMessage: "Your session expired. Please log in again.",
    recoverable: false,
    automaticRedirect: true, // Redirect to /login
  };
}

/**
 * HANDLING: Access Denied (403)
 *
 * Where caught: apiFetchServer (server-side) OR apiFetchClient (client)
 * Signal: HTTP 403 Forbidden
 * Cause: User doesn't have permission (role mismatch, cross-student access)
 * User sees: Page redirects server-side, OR error toast client-side
 *
 * Solution (Server-side, primary):
 *   - apiFetchServer throws on 403
 *   - redirect() in page.tsx goes to /dashboard
 *   - User never sees payment form at all
 *
 * Solution (Client-side, defense):
 *   - If somehow client mutation hits 403
 *   - Roll back optimistic update
 *   - Toast: "You don't have permission for this action."
 *   - Don't retry
 *
 * Implementation: Phase 7 RBAC + server page gate
 */
export function handleAccessDenied(): {
  userMessage: string;
  recoverable: boolean;
} {
  return {
    userMessage:
      "You don't have permission to perform this action. Contact your administrator.",
    recoverable: false,
  };
}

/**
 * HANDLING: Invalid Amount (Client)
 *
 * Where caught: validatePayment() (Phase 6) BEFORE submit
 * Signal: validatePayment() returns { valid: false, reason: "..." }
 * User sees: Submit button disabled, inline error message
 *
 * Solution:
 *   - Block submit button until validatePayment() returns true
 *   - Show reason inline: "Amount exceeds due (₹200)"
 *   - Don't call API at all if client validation fails
 *
 * Implementation:
 *   const validation = validatePayment(amount, dueAmount);
 *   <button disabled={!validation.valid} />
 *   {!validation.valid && <p>{validation.reason}</p>}
 *
 * Backend ALSO validates (defense in depth):
 *   - If somehow client sends invalid amount
 *   - Backend returns 400 Bad Request
 *   - onError() rolls back optimistic
 *   - Toast: "Invalid payment details."
 */
export function handleInvalidAmount(
  amount: number,
  dueAmount: number,
): {
  userMessage: string;
  blockSubmit: boolean;
} {
  if (!Number.isFinite(amount)) {
    return { userMessage: "Please enter a valid amount", blockSubmit: true };
  }

  if (amount <= 0) {
    return {
      userMessage: "Amount must be greater than 0",
      blockSubmit: true,
    };
  }

  if (amount > dueAmount) {
    return {
      userMessage: `Amount exceeds due amount (₹${(dueAmount / 100).toFixed(2)})`,
      blockSubmit: true,
    };
  }

  if (amount % 1 !== 0) {
    return {
      userMessage: "Amount must be in whole paisa",
      blockSubmit: true,
    };
  }

  return { userMessage: "", blockSubmit: false };
}

/**
 * HANDLING: Double-Submit (Rapid Clicks)
 *
 * Where caught: React Query mutation pending state
 * Signal: mutation.isPending === true
 * Cause: User clicks "Record Payment" twice rapidly
 * User sees: Should see only one API call
 *
 * Solution:
 *   - Disable submit button while mutation.isPending
 *   - React Query internally prevents duplicate mutations
 *   - First click starts mutation, second click is ignored
 *
 * Implementation:
 *   <button disabled={mutation.isPending} >
 *     {mutation.isPending ? "Processing..." : "Record Payment"}
 *   </button>
 */
export function preventDoubleSubmit(isPending: boolean): {
  submitDisabled: boolean;
  buttonText: string;
} {
  return {
    submitDisabled: isPending,
    buttonText: isPending ? "Processing..." : "Record Payment",
  };
}

/**
 * HANDLING: Optimistic Update Rollback
 *
 * Where caught: onError() hook in usePayFee()
 * Signal: context?.previousAssignment provided
 * Cause: Any API error after optimistic cache update
 * User sees: UI reverts to pre-mutation state
 *
 * Solution:
 *   - onMutate() saves snapshot of current assignment
 *   - onError() uses snapshot to setQueryData back
 *   - UI re-renders with rolled-back state
 *   - User sees the exact balance from moment before payment
 *
 * Implementation: See Phase 5 api/client.ts onError()
 *
 * Example:
 *   Before: { paidAmount: 300k, status: "PARTIAL" }
 *   After mutation started: { paidAmount: 400k, status: "PARTIAL" }  ← optimistic
 *   API fails: { paidAmount: 300k, status: "PARTIAL" }  ← rolled back
 *   User must retry with knowledge that payment didn't go through
 */
export function shouldRollbackOptimisticUpdate(
  hadPreviousStateSnapshot: boolean,
): boolean {
  return hadPreviousStateSnapshot;
}

/**
 * HANDLING: Backend Malformed Response
 *
 * Where caught: apiFetchClient JSON.parse() catch
 * Signal: Promise rejects with SyntaxError (invalid JSON)
 * Cause: Backend returns HTML error page instead of JSON
 * User sees: Payment fails, apiFetchClient catches
 *
 * Solution:
 *   - Wrap JSON.parse in try-catch
 *   - Return 500 error to onError()
 *   - Toast: "Server error. Please try again."
 *   - Treat same as 5xx status code
 *
 * Implementation:
 *   const text = await res.text();
 *   try {
 *     return text ? JSON.parse(text) : null;
 *   } catch (e) {
 *     throw new Error("Invalid JSON response from server");
 *   }
 */
export function handleMalformedResponse(): {
  userMessage: string;
  recoverable: boolean;
} {
  return {
    userMessage:
      "Server returned an invalid response. This is a server issue, not your fault. Please try again.",
    recoverable: true,
  };
}

/**
 * COMPLETE ERROR ROUTING TABLE
 *
 * Use this to map any error signal to the correct handler:
 *
 * Error Signal                      → Handler
 * ════════════════════════════════════════════════════════════════════
 * Network timeout / AbortError      → handleNetworkError()
 * HTTP 409                          → handleDuplicatePayment()
 * HTTP 401                          → handleSessionExpired()
 * HTTP 403                          → handleAccessDenied()
 * HTTP 400                          → handleInvalidAmount()
 * HTTP 5xx                          → Toast: "Server error. Retry."
 * Invalid JSON response             → handleMalformedResponse()
 * validatePayment() = invalid       → handleInvalidAmount()
 * mutation.isPending = true         → preventDoubleSubmit()
 * context?.previousAssignment       → shouldRollbackOptimisticUpdate()
 *
 * GENERAL RULE:
 * If an error reaches the user, it's because:
 *   1. Client validation failed (inform user of their mistake)
 *   2. Network failed (offer retry)
 *   3. Server rejected (tell user what server said, in friendly terms)
 *   4. Auth failed (redirect to login or show "access denied")
 *
 * Never show:
 *   ❌ Raw error dumps: "TypeError: message is not iterable"
 *   ❌ Stack traces: "at onError (api/client.ts:123:45)"
 *   ❌ HTTP internals: "res.status = 502"
 *
 * Always show:
 *   ✅ User-friendly messages: "Your connection is unstable."
 *   ✅ Clear next steps: "Please check your internet and try again."
 *   ✅ Actionable hints: "You may need to log in again."
 */
