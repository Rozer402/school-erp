"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-3xl border border-rose-100 dark:border-rose-900 shadow-sm m-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-black text-rose-600 dark:text-rose-500 tracking-tight">
          Something went wrong
        </h2>
        <p className="text-zinc-500 max-w-md mx-auto text-sm">
          {error.message || "An unexpected error occurred while loading this section."}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
