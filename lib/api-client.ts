import { API_BASE_URL, USE_MOCK } from "./config";
import { mockDashboard, mockNotices, attendanceTrends, subjectAttendance, mockUser, mockFees, mockAttendance } from "../data/mock";

/**
 * Client-only API Fetcher
 * Use ONLY in Client Components / React Query (e.g. "use client").
 */
export async function apiFetchClient(url: string, options: RequestInit = {}) {
  if (USE_MOCK) {
    if (url.includes('/api/dashboard')) return mockDashboard;
    if (url.includes('/api/bulletins') || url.includes('/api/notices')) return mockNotices;
    if (url.includes('/api/attendanceTrends')) return attendanceTrends;
    if (url.includes('/api/subjectAttendance')) return subjectAttendance;
    if (url.includes('/api/attendance')) return mockAttendance;
    if (url.includes('/api/fees')) return mockFees;
    if (url.includes('/api/auth/me')) return { user: mockUser };
    return {};
  }

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
    console.warn(`API Error: ${res.status}`);
    return null;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
