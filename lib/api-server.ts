import { cookies } from "next/headers";
import { API_BASE_URL } from "./config";

/**
 * Server-only API Fetcher
 * Use ONLY in Server Components.
 */
export async function apiFetchServer(url: string, options: RequestInit = {}) {
  const baseUrl = API_BASE_URL;
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const headers = new Headers(options.headers || {});

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      headers.set("Cookie", `token=${token}`);
    }
  } catch {
    // Ignore if not in request context (e.g. during build or on edge without cookies)
  }

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!res.ok) {
      return null;
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (_error) {
    return null;
  }
}
