export type Role = "admin" | "teacher" | "student";

export type User = {
  name: string;
  role: Role;
};

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}
