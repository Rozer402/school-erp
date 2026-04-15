"use server";

import { apiFetchServer } from "@/lib/api-server";
import type { User } from "@/types/auth";
import { mockUser } from "@/data/mock";

import { USE_MOCK } from "@/lib/config";

/**
 * Server-only function to fetch the authenticated user from backend.
 * Called once during SSR to populate AuthProvider.
 *
 * Used in layout.tsx:
 *   const user = await getServerUser();
 *   return <AuthProvider user={user}>...</AuthProvider>
 */
export async function getServerUser(): Promise<User | null> {
  if (USE_MOCK) {
    return mockUser as User;
  }

  try {
    const data = await apiFetchServer("/api/auth/me");
    if (!data?.user) {
      // In case API returns nothing but finishes (backend unavailable mock)
      return USE_MOCK ? (mockUser as User) : null;
    }
    return data.user;
  } catch {
    return USE_MOCK ? (mockUser as User) : null;
  }
}
