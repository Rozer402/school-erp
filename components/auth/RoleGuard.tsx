"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import type { Role } from "@/types/auth";
import { ReactNode } from "react";

type RoleGuardProps = {
  children: ReactNode;
  roles: Role[];
  fallback?: ReactNode;
};

/**
 * Renders `children` if the authenticated user has one of the specified `roles`.
 * Otherwise renders the `fallback` (or null by default).
 */
export function RoleGuard({ children, roles, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  
  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
