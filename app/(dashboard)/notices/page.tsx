import { BulletinBoard } from "@/components/dashboard/BulletinBoard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notices | EduERP",
};

export default function NoticesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notices & Circulars</h1>
        <p className="text-gray-500 text-sm">Review important school announcements and guidelines.</p>
      </div>
      <div className="max-w-4xl">
        <BulletinBoard />
      </div>
    </div>
  );
}