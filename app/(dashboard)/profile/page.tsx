import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Book,
  Edit2,
  Info,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Profile | EduERP",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-gray-500 text-sm">
          View and manage your personal details.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 w-full relative" />
        <div className="px-6 pb-6 pt-4 relative">
          <div className="flex justify-between items-start">
            <div className="flex items-end -mt-16 mb-4 gap-4">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md border border-gray-100 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700">
                  AM
                </div>
              </div>
              <div className="pb-2">
                <h2 className="text-xl font-bold text-gray-900">Arjun Mehta</h2>
                <p className="text-sm font-medium text-indigo-600">
                  ID: ST-2023-0492
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                Personal Information
              </h3>
              <div className="flex gap-3 text-sm">
                <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-0.5">
                    Full Name
                  </p>
                  <p className="text-gray-900 font-medium">
                    Arjun Prakash Mehta
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-0.5">
                    Email Address
                  </p>
                  <p className="text-gray-900 font-medium">
                    arjun.mehta@eduerp.edu
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-0.5">
                    Phone Number
                  </p>
                  <p className="text-gray-900 font-medium">+977 98000 12345</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-0.5">
                    Residential Address
                  </p>
                  <p className="text-gray-900 font-medium">
                    Ward 4, Baneshwor, Kathmandu
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                Academic Details
              </h3>
              <div className="flex gap-3 text-sm">
                <Building2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-0.5">
                    Class Teacher
                  </p>
                  <p className="text-gray-900 font-medium">
                    Mrs. Sunita Sharma
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Book className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-0.5">
                    Class & Section
                  </p>
                  <p className="text-gray-900 font-medium">
                    Class 10 - Section A
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-0.5">
                    Academic Program
                  </p>
                  <p className="text-gray-900 font-medium">
                    SEE Appearing - 2025-26
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t pt-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
              School Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="block text-gray-500 text-xs font-semibold mb-0.5">
                  School
                </span>
                <span className="text-gray-900 font-medium">
                  R.D. Memorial Academy
                </span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs font-semibold mb-0.5">
                  Board
                </span>
                <span className="text-gray-900 font-medium">
                  National Examinations Board (NEB)
                </span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs font-semibold mb-0.5">
                  Academic Year
                </span>
                <span className="text-gray-900 font-medium">2025-26</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
