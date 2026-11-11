"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest, notifySessionChanged } from "../lib/api-client";
import { useSession } from "../hooks/useSession";

export function SessionBar() {
  const router = useRouter();
  const { session } = useSession();
  const [logoutError, setLogoutError] = useState("");

  if (!session) {
    return null;
  }

  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    setLogoutError("");
    try {
      await apiRequest<void>("/auth/logout", { method: "POST" });
      notifySessionChanged();
      router.push("/login");
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "No se pudo cerrar la sesión.");
    }
  };

  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{session.name}</p>
        <p className="text-xs text-slate-500">{session.role}</p>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="ml-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        Salir
      </button>
      {logoutError && <p className="absolute right-4 top-full mt-2 max-w-64 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 shadow" role="alert">{logoutError}</p>}
    </div>
  );
}
