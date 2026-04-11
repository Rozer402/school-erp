import { API_BASE_URL } from "./config";

/**
 * Client-only API Fetcher
 * Use ONLY in Client Components / React Query (e.g. "use client").
 */
export async function apiFetchClient(url: string, options: RequestInit = {}) {
  // Always use browser-native credentials flag for sending cookies natively
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // If using a separate backend, baseUrl must be defined; otherwise it hits /api directly locally
  const baseUrl = API_BASE_URL;
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include", // This ensures HTTP cookies are safely transmitted from the frontend!
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(`API Error: ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
