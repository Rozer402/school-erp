import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { apiFetchServer } from "@/lib/api-server";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1. Force the fetch to hit the dynamic backend to establish Source of Truth
  const data = await apiFetchServer("/api/auth/me", { cache: "no-store" });
  
  // The apiFetchServer will inherently handle redirecting to /login if the token throws 401
  const user = data?.user || null;

  return (
    <AuthProvider user={user}>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden md:ml-64 transition-all duration-300 relative">
          <Topbar />
          <PageWrapper>
            {children}
          </PageWrapper>
        </div>
      </div>
    </AuthProvider>
  );
}
