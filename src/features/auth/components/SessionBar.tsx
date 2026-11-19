"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, UserPlus } from "lucide-react";
import { apiRequest, notifySessionChanged } from "../lib/api-client";
import { useSession } from "../hooks/useSession";
import { adminUserRoles } from "../types";

export function SessionBar() {
  const router = useRouter();
  const { session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
      setIsOpen(false);
      router.push("/login");
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "No se pudo cerrar la sesión.");
    }
  };

  return (
    <div ref={containerRef} className="group relative w-full sm:w-auto">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Menú de usuario: ${session.name}`}
        aria-expanded={isOpen}
        aria-controls="session-user-menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-300 bg-white py-2 pl-2 pr-3 text-left shadow-sm transition hover:border-[#002679]/30 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2 sm:w-auto"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#002679] text-sm font-semibold text-white">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-[#002679]">{session.name}</span>
          <span className="block truncate text-xs text-slate-500">{session.role}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && <div
        id="session-user-menu"
        className="absolute right-0 z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/10"
      >
        <div className="border-b border-slate-100 px-3 py-3">
          <p className="truncate text-sm font-semibold text-[#002679]">{session.name}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{session.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-[#E8EEF8] px-2.5 py-1 text-xs font-medium text-[#002679]">{session.role}</p>
        </div>
        {adminUserRoles.includes(session.role) && (
          <Link
            href="/admin"
            onNavigate={() => setIsOpen(false)}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#002679] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679]"
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Administrar Empresas
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
      </div>}
    </div>
  );
}
