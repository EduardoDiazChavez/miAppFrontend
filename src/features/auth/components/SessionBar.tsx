"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, UserPlus } from "lucide-react";
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
    <details className="group relative">
      <summary
        aria-label={`Menú de usuario: ${session.name}`}
        className="flex cursor-pointer list-none items-center gap-3 rounded-xl border border-slate-300 bg-white py-2 pl-2 pr-3 shadow-sm transition hover:border-[#002679]/30 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#002679] text-sm font-semibold text-white">
          {initials}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-36 truncate text-sm font-semibold text-[#002679]">{session.name}</span>
          <span className="block text-xs text-slate-500">{session.role}</span>
        </span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/10">
        <div className="border-b border-slate-100 px-3 py-3">
          <p className="truncate text-sm font-semibold text-[#002679]">{session.name}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{session.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-[#E8EEF8] px-2.5 py-1 text-xs font-medium text-[#002679]">{session.role}</p>
        </div>
        {session.role === "Administrador" && (
          <Link
            href="/admin"
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#002679] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679]"
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Agregar cliente
          </Link>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#002679] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679]"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Cerrar sesión
        </button>
        {logoutError && <p className="px-3 pb-2 text-xs text-red-700" role="alert">{logoutError}</p>}
      </div>
    </details>
  );
}
