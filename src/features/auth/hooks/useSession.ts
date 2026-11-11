"use client";

import { useEffect, useState } from "react";
import { apiRequest, toSessionUser, type ApiUser } from "../lib/api-client";
import type { SessionUser } from "../types";

export function useSession() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const updateSession = async () => {
      try {
        const result = await apiRequest<{ user: ApiUser }>("/auth/me");
        if (active) {
          setSession(toSessionUser(result.user));
          setError(null);
        }
      } catch (sessionError) {
        if (active) {
          setSession(null);
          setError(sessionError instanceof Error ? sessionError.message : "No se pudo verificar la sesión.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void updateSession();
    window.addEventListener("storage", updateSession);
    window.addEventListener("miapp:session-changed", updateSession);

    return () => {
      active = false;
      window.removeEventListener("storage", updateSession);
      window.removeEventListener("miapp:session-changed", updateSession);
    };
  }, []);

  return { session, loading, error };
}
