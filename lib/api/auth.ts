import type { PasswordResetRequest, PasswordResetResponse } from "@/types/auth";

export async function requestPasswordReset(
  data: PasswordResetRequest
): Promise<PasswordResetResponse> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "Failed to request password reset");
  }

  return responseData as PasswordResetResponse;
}
