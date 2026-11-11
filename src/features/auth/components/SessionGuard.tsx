"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getHomeForRole } from "../lib/api-client";
import { useSession } from "../hooks/useSession";
import type { UserRole } from "../types";

type SessionGuardProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

export function SessionGuard({ allowedRoles, children }: SessionGuardProps) {
  const router = useRouter();
  const { session, loading } = useSession();
  const isAllowed = session !== null && allowedRoles.includes(session.role);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!session) {
      router.replace("/login");
    } else if (!allowedRoles.includes(session.role)) {
      router.replace(getHomeForRole(session.role));
    }
  }, [allowedRoles, loading, router, session]);

  if (loading || !isAllowed) {
    return <main className="min-h-screen bg-slate-100" aria-label="Cargando sesión" />;
  }

  return children;
}
