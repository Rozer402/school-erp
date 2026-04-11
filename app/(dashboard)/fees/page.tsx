import { getFees } from "@/modules/fees/server/getFees";
import { FeeTable } from "@/modules/fees/components/FeeTable";

export default async function FeesPage() {
  const assignments = await getFees();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Fees</h1>
      <FeeTable initialData={assignments} />
    </div>
  );
}
