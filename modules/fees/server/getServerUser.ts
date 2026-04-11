"use server";

import { apiFetchServer } from "@/lib/api-server";
import type { User } from "@/types/auth";

/**
 * Server-only function to fetch the authenticated user from backend.
 * Called once during SSR to populate AuthProvider.
 *
 * Used in layout.tsx:
 *   const user = await getServerUser();
 *   return <AuthProvider user={user}>...</AuthProvider>
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const data = await apiFetchServer("/api/auth/me");
    return data?.user || null;
  } catch (error) {
    // apiFetchServer.throws on 401 → redirects to /login
    // If we reach here, it's a network error — return null (logged out)
    return null;
  }
}
