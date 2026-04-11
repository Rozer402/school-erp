// Timeline logic for Fees module
export type TimelineEvent =
  | { type: "ASSIGNED"; date: string; amount: number }
  | { type: "PAID"; date: string; amount: number };

/**
 * Builds a timeline of fee assignment and payments, sorted by date ascending.
 * @param assignment Fee assignment object
 * @param payments Array of payment objects
 * @returns TimelineEvent[]
 */
export function buildTimeline(
  assignment: { totalAmount: number; createdAt: string },
  payments: Array<{ amount: number; paidAt: string }>,
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      type: "ASSIGNED",
      date: assignment.createdAt,
      amount: assignment.totalAmount,
    },
    ...payments.map((p) => ({
      type: "PAID" as const,
      date: p.paidAt,
      amount: p.amount,
    })),
  ];
  // Sort by date ascending
  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
