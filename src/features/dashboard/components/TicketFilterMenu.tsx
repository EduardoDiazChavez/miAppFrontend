"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ListFilter, X } from "lucide-react";
import type { TicketStatus } from "../data/mockData";
import type { TicketFilterUser } from "@/src/features/tickets/lib/ticket-api";

const statuses: Array<"Todos" | TicketStatus> = [
  "Todos",
  "Abierto",
  "En revisión",
  "Pendiente cierre",
  "Cerrado",
];

type TicketFilterMenuProps = {
  showStatusFilter: boolean;
  showCreatorAndDateFilters: boolean;
  users: TicketFilterUser[];
  userId: string;
  dateFrom: string;
  dateTo: string;
  statusFilter?: "Todos" | TicketStatus;
  usersLoading: boolean;
  usersError: string;
  onUserChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onStatusChange?: (value: "Todos" | TicketStatus) => void;
  onClear: () => void;
};

export function TicketFilterMenu({
  showStatusFilter,
  showCreatorAndDateFilters,
  users,
  userId,
  dateFrom,
  dateTo,
  statusFilter = "Todos",
  usersLoading,
  usersError,
  onUserChange,
  onDateFromChange,
  onDateToChange,
  onStatusChange,
  onClear,
}: TicketFilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeFilterCount =
    (showStatusFilter && statusFilter !== "Todos" ? 1 : 0) +
    (showCreatorAndDateFilters ? [userId, dateFrom, dateTo].filter(Boolean).length : 0);

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

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="ticket-filter-panel"
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2 sm:w-auto ${
          isOpen || activeFilterCount > 0
            ? "border-[#002679]/20 bg-[#E8EEF8] text-[#002679]"
            : "border-slate-200 bg-white text-slate-700 hover:bg-[#F3F6FA]"
        }`}
      >
        <ListFilter aria-hidden="true" className="h-4 w-4" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-[#002679] px-2 py-0.5 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id="ticket-filter-panel"
          role="dialog"
          aria-label="Filtros de tickets"
          className="absolute right-0 top-full z-30 mt-2 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
        >
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-[#002679]">Filtrar tickets</h4>
                <p className="mt-1 text-xs text-slate-500">Combina los criterios que necesites.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar filtros"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679]"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[min(65vh,28rem)] space-y-5 overflow-y-auto p-5">
            {showStatusFilter && <div>
              <label htmlFor="ticket-status-filter" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estado
              </label>
              <select
                id="ticket-status-filter"
                value={statusFilter}
                onChange={(event) => onStatusChange?.(event.target.value as "Todos" | TicketStatus)}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002679] focus:ring-2 focus:ring-[#002679]/20"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "Todos" ? "Todos los estados" : status}
                  </option>
                ))}
              </select>
            </div>}

            {showCreatorAndDateFilters && (
              <>
                <div className="border-t border-slate-100" aria-hidden="true" />
                <div>
                  <label htmlFor="ticket-user-filter" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Usuario
                  </label>
                  <select
                    id="ticket-user-filter"
                    value={userId}
                    onChange={(event) => onUserChange(event.target.value)}
                    disabled={usersLoading}
                    className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002679] focus:ring-2 focus:ring-[#002679]/20 disabled:cursor-wait disabled:bg-slate-100"
                  >
                    <option value="">{usersLoading ? "Cargando usuarios..." : "Todos los usuarios"}</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-slate-100" aria-hidden="true" />
                <fieldset>
                  <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fecha de creación
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ticket-date-from" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Desde
                      </label>
                      <input
                        id="ticket-date-from"
                        type="date"
                        value={dateFrom}
                        max={dateTo || undefined}
                        onChange={(event) => onDateFromChange(event.target.value)}
                        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002679] focus:ring-2 focus:ring-[#002679]/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="ticket-date-to" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Hasta
                      </label>
                      <input
                        id="ticket-date-to"
                        type="date"
                        value={dateTo}
                        min={dateFrom || undefined}
                        onChange={(event) => onDateToChange(event.target.value)}
                        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002679] focus:ring-2 focus:ring-[#002679]/20"
                      />
                    </div>
                  </div>
                </fieldset>
              </>
            )}

            {usersError && (
              <p className="text-sm text-red-700" role="alert">{usersError}</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-[#F8FAFC] px-5 py-3">
            <button
              type="button"
              disabled={activeFilterCount === 0}
              onClick={onClear}
              className="text-sm font-medium text-red-700 transition hover:text-red-800 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Limpiar todo
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#002679] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#001d5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
