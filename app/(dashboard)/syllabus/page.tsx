import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syllabus | EduERP",
};

export default function SyllabusPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Academic Syllabus</h1>
        <p className="text-gray-500 text-sm">Review your course curriculum and subject modules.</p>
      </div>

      <div className="mt-8">
        <EmptyState 
          icon={<BookOpen className="w-8 h-8" />}
          title="Syllabus Modules Unavailable"
          description="The curriculum for the current semester is being updated by the administration."
        />
      </div>
    </div>
  );
}
