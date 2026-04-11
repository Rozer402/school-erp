"use client";

/**
 * CLIENT MUTATION LAYER — Phase 5
 *
 * What: React Query mutations for payment operations.
 * Why: Optimistic updates, cache invalidation, error recovery.
 * What to never do:
 *   - Never fetch initial data here (use server functions)
 *   - Never store fees in useQuery on client mount
 *   - Never retry failed payments silently (show error to user)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetchClient } from "@/lib/api-client";
import { FeeStatus } from "@/modules/fees/types";
import type { Payment, FeeAssignment } from "@/modules/fees/types";

/**
 * Raw API call to record a payment.
 * - Uses apiFetchClient (credentials: "include")
 * - Returns Payment entity
 * - Throws on 400/401/403/409 (caller handles)
 */
export async function payFee(
  assignmentId: string,
  amount: number,
  method: string,
  receiptNo?: string,
): Promise<Payment> {
  const response = await apiFetchClient("/api/payments", {
    method: "POST",
    body: JSON.stringify({
      assignmentId,
      amount, // in paisa
      method,
      receiptNo,
    }),
  });

  return response as Payment;
}

/**
 * React Query mutation hook for payment recording.
 *
 * Usage:
 *   const mutation = usePayFee();
 *
 *   const handlePay = async () => {
 *     await mutation.mutateAsync({
 *       assignmentId: "123",
 *       amount: 50000,  // ₹500 in paisa
 *       method: "ONLINE",
 *     });
 *   };
 *
 * Features:
 *   - Optimistic update: immediately reflect new payment in UI
 *   - Rollback on error: revert optimistic change if API fails
 *   - Cache invalidation: trigger re-fetch of fees list
 *   - Error states: typed error handling per status code
 *   - Loading state: isPending, isSuccess, isError
 */
export function usePayFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      assignmentId: string;
      amount: number;
      method: string;
      receiptNo?: string;
    }) => {
      return payFee(
        input.assignmentId,
        input.amount,
        input.method,
        input.receiptNo,
      );
    },

    /**
     * OPTIMISTIC UPDATE — Phase 5 key feature
     *
     * Before API call completes:
     *   1. Snapshot current FeeAssignment for rollback
     *   2. Immediately update UI: decrease due, update status
     *   3. User sees change instantly (no lag)
     *   4. If API fails, rollback to snapshot
     *
     * Why: At 10k+ students with slow networks, perceived performance matters.
     * Optimistic updates make payment feel instant even if server takes 500ms.
     */
    onMutate: async (variables) => {
      // Cancel any in-flight queries (prevent race conditions)
      await queryClient.cancelQueries({
        queryKey: ["fees", variables.assignmentId],
      });

      // Snapshot current data for rollback
      const previousAssignment = queryClient.getQueryData<FeeAssignment>([
        "fees",
        variables.assignmentId,
      ]);

      if (previousAssignment) {
        // Calculate optimistic new state
        const newPaidAmount = previousAssignment.paidAmount + variables.amount;
        const newDueAmount = previousAssignment.totalAmount - newPaidAmount;
        const newStatus: FeeStatus =
          newPaidAmount >= previousAssignment.totalAmount
            ? FeeStatus.PAID
            : newPaidAmount > 0
              ? FeeStatus.PARTIAL
              : FeeStatus.DUE;

        // Update cache optimistically
        const optimisticData: FeeAssignment = {
          ...previousAssignment,
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
          status: newStatus,
        };

        queryClient.setQueryData(
          ["fees", variables.assignmentId],
          optimisticData,
        );
      }

      // Return snapshot for rollback if needed
      return { previousAssignment };
    },

    /**
     * SUCCESS: Invalidate cache, show success
     *
     * Strategy:
     *   - Don't re-fetch entire page (too expensive)
     *   - Invalidate specific assignment query → will re-fetch on next access
     *   - Main FeeTable uses pre-fetched data, will update via cache from optimistic
     *   - User sees payment reflected immediately via optimistic update
     */
    onSuccess: (newPayment, variables) => {
      // Invalidate the specific assignment (fresh data will load if page accesses it)
      queryClient.invalidateQueries({
        queryKey: ["fees", variables.assignmentId],
      });

      // Also invalidate the main fees list (admin view) to keep in sync
      queryClient.invalidateQueries({
        queryKey: ["fees"],
      });

      // Toast shows success (handled by caller)
      // Example: toast.success(`Payment recorded: ${newPayment.receiptNo}`);
    },

    /**
     * ERROR: Rollback optimistic update, show typed error
     *
     * Each HTTP status code gets a different message:
     *   - 400: Validation error (amount, format, etc.)
     *   - 402: Insufficient funds (not applicable here, but example)
     *   - 409: Duplicate payment (already recorded within window)
     *   - 401: Session expired (redirect handled by apiFetchClient)
     *   - 403: Access denied (student paid another student's fee)
     *   - 500: Server error (retry available)
     *
     * Never show raw error dumps — translate to user-friendly messages
     */
    onError: (error: any, variables, context) => {
      // Rollback optimistic update if we had one
      if (context?.previousAssignment) {
        queryClient.setQueryData(
          ["fees", variables.assignmentId],
          context.previousAssignment,
        );
      }

      // Parse error and determine user message
      let userMessage = "Payment recording failed. Please try again.";

      if (error.message?.includes("400")) {
        userMessage = "Invalid payment details. Check amount and method.";
      } else if (error.message?.includes("409")) {
        userMessage =
          "Payment already recorded. This may be a duplicate. Check your history.";
      } else if (error.message?.includes("401")) {
        userMessage = "Session expired. Please log in again.";
        // apiFetchClient already redirects, but this prevents double-submit
      } else if (error.message?.includes("403")) {
        userMessage =
          "You don't have permission to record this payment. Contact admin.";
      } else if (error.message?.includes("Unauthorized")) {
        userMessage = "Session expired. Redirecting to login...";
      }

      console.error("[usePayFee] Mutation failed:", {
        error: error.message,
        variables,
        userMessage,
      });

      // Toast shows error (handled by caller)
      // Example: toast.error(userMessage);
    },

    /**
     * SETTLED: Always close modal (success or error)
     */
    onSettled: () => {
      // Modal close handled by caller
      // Example: onClose();
    },
  });
}

/**
 * Type-safe error parsing for payment API
 */
export function parsePaymentError(error: unknown): {
  code: number | null;
  message: string;
  recoverable: boolean;
} {
  if (error instanceof Error) {
    if (error.message.includes("400")) {
      return {
        code: 400,
        message: "Invalid payment details",
        recoverable: true,
      };
    }
    if (error.message.includes("409")) {
      return {
        code: 409,
        message: "Duplicate payment detected",
        recoverable: false,
      };
    }
    if (error.message.includes("401")) {
      return {
        code: 401,
        message: "Session expired",
        recoverable: false,
      };
    }
    if (error.message.includes("403")) {
      return {
        code: 403,
        message: "Access denied",
        recoverable: false,
      };
    }
  }

  return {
    code: null,
    message: "Unknown error",
    recoverable: true,
  };
}
