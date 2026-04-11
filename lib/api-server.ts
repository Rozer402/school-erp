import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    // Ignore if not in request context (e.g., during build)
  }

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // During build, don't redirect, just throw
    try {
      cookies();
    } catch (_e) {
      throw new Error(`API Error: ${res.status}`);
    }
    if (res.status === 401) {
      redirect("/login");
    }
    if (res.status === 403) {
      redirect("/dashboard");
    }
    throw new Error(`API Error: ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
