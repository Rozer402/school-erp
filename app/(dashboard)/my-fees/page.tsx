export const dynamic = "force-dynamic";
import { getServerUser } from "@/modules/fees/server/getServerUser";
import { getStudentFees } from "@/modules/fees/server/getFees";
import StudentFeeTableClient from "@/modules/fees/components/StudentFeeTable";

/**
 * SSR Page: /app/(dashboard)/my-fees/page.tsx
 *
 * Student-facing fees view.
 * - Fetches own fees via getStudentFees()
 * - Allows student to record payments
 * - No admin override or bulk operations
 */
export default async function MyFeesPage() {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-xl w-full rounded-[2rem] border border-border bg-white dark:bg-card p-10 shadow-soft text-center">
          <h1 className="text-3xl font-black mb-4 text-foreground">
            Access unavailable
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn&apos;t verify your session right now. Please sign in again
            once the backend is reachable.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Go to login
          </a>
        </div>
      </div>
    );
  }

  if (!["student", "admin"].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-xl w-full rounded-[2rem] border border-border bg-white dark:bg-card p-10 shadow-soft text-center">
          <h1 className="text-3xl font-black mb-4 text-foreground">
            Access denied
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your account does not have access to this page.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Return to dashboard
          </a>
        </div>
      </div>
    );
  }

  const assignments = await getStudentFees();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Fees</h1>
        <p className="text-sm text-gray-600 mt-2">
          View your fee assignments and payment history
        </p>
      </div>

      <StudentFeeTableClient initialData={assignments} />
    </div>
  );
}
