import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getServerUser } from "@/modules/fees/server/getServerUser";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-xl w-full rounded-[2rem] border border-border bg-white dark:bg-card p-10 shadow-soft text-center">
          <h1 className="text-3xl font-black mb-4 text-foreground">
            Session unavailable
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn&apos;t verify your session because the backend is
            unavailable or your session expired. Please try again later or sign
            in again.
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

  return (
    <AuthProvider user={user}>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden md:ml-64 transition-all duration-300 relative">
          <Topbar />
          <PageWrapper>{children}</PageWrapper>
        </div>
      </div>
    </AuthProvider>
  );
}
