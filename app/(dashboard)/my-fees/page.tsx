export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
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
    redirect("/login");
  }

  // Students can view their own fees; admin can also view any student's fees
  if (!["student", "admin"].includes(user.role)) {
    redirect("/dashboard");
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
