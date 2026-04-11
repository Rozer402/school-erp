"use client";

import { SCHOOL } from "@/config/school";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Image from "next/image";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const params = new URLSearchParams(window.location.search);
      const callback = params.get("callbackUrl") || "/dashboard";

      router.push(callback);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-4xl bg-white/0 dark:bg-transparent rounded-2xl shadow-none flex flex-col md:flex-row overflow-hidden">
          {/* LEFT PANEL */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-8 py-12 md:py-0 bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-700 dark:from-indigo-900 dark:via-indigo-950 dark:to-purple-900">
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                  <Image
                    src="/logo.png"
                    alt={`${SCHOOL.name} Logo`}
                    fill
                    className="object-contain drop-shadow-xl"
                    sizes="128px"
                    priority
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                  {SCHOOL.name}
                </h1>
                <p className="text-white/70 text-lg font-medium text-center">
                  Shaping Futures Since 1995
                </p>
              </div>
              <p className="text-white/60 text-sm max-w-xs text-center mt-2">
                Welcome back! Log in to access your academic portal, fees,
                attendance, notices and more.
              </p>
            </div>
            <div className="absolute bottom-4 left-0 w-full flex justify-center">
              <p className="text-white/40 text-xs text-center">
                Powered by EduERP &bull; Nepal
              </p>
            </div>
          </div>
          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8 md:p-12">
            <div className="w-full max-w-md">
              <div className="flex flex-col items-center mb-8">
                <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold text-xs px-3 py-1 rounded-full mb-3">
                  2025-26 Academic Session
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Student & Staff Login
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  Enter your credentials to continue
                </p>
              </div>
              {error && (
                <div className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 p-3 rounded-xl text-sm font-bold text-center mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border/50 bg-muted/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:bg-zinc-800 dark:text-white"
                    placeholder="Username"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border/50 bg-muted/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:bg-zinc-800 dark:text-white"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 mt-6"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  {loading ? "Signing in..." : "Secure Login"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordModalOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Forgot password? Reset here
                </button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Having trouble? Contact your school administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />
    </>
  );
}
