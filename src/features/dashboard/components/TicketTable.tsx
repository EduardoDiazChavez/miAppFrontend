"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/src/features/auth/lib/api-client";
import { listTickets } from "@/src/features/tickets/lib/ticket-api";
import type { TicketRecord, TicketStatus } from "../data/mockData";
import { StatusBadge } from "./StatusBadge";

const filters: Array<"Todos" | TicketStatus> = ["Todos", "Abierto", "En revisión", "Pendiente cierre", "Cerrado"];
const statusApiValues: Partial<Record<TicketStatus, string>> = {
  Abierto: "OPEN",
  "En revisión": "IN_PROGRESS",
  "Pendiente cierre": "WAITING",
  Cerrado: "CLOSED",
};

export function TicketTable() {
  const [statusFilter, setStatusFilter] = useState<"Todos" | TicketStatus>("Todos");
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listTickets({
        page,
        limit: 20,
        ...(statusFilter !== "Todos" ? { status: statusApiValues[statusFilter] } : {}),
      });
      setTickets(result.tickets);
      setTotal(result.total);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "No se pudieron cargar los tickets.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadTickets(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadTickets]);

  const handleFilter = (filter: "Todos" | TicketStatus) => {
    setStatusFilter(filter);
    setPage(1);
  };

  return (
    <section className="rounded-2xl border border-slate-300/80 bg-white p-4 shadow-md shadow-slate-900/[0.04] sm:p-6">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-[#002679]">Operación</p>
          <h3 className="mt-1 text-xl font-semibold text-[#002679]">Tickets registrados</h3>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-[#EB7700]" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
          <div role="group" aria-label="Filtrar tickets por estado" className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-[#F3F6FA] p-1">
            {filters.map((filter) => {
              const isActive = statusFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilter(filter)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-1 ${
                    isActive
                      ? "bg-[#002679] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#002679]"
                  }`}
                >
                  <span>{filter}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg bg-[#F3F6FA] px-3 py-2 text-sm text-slate-600" aria-live="polite">
            {loading ? "Cargando tickets..." : (
              <>Mostrando <span className="font-semibold text-[#002679]">{tickets.length}</span> de {total} tickets</>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-[#F3F6FA] text-xs uppercase tracking-wide text-slate-600">
              <th scope="col" className="px-3 py-3 font-semibold first:rounded-l-lg">Ticket</th>
              <th scope="col" className="px-3 py-3 font-semibold">Cliente</th>
              <th scope="col" className="px-3 py-3 font-semibold">Área</th>
              <th scope="col" className="px-3 py-3 font-semibold">Actividad</th>
              <th scope="col" className="px-3 py-3 font-semibold">Abierto</th>
              <th scope="col" className="px-3 py-3 font-semibold">Cierre</th>
              <th scope="col" className="px-3 py-3 font-semibold last:rounded-r-lg">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-500">Cargando tickets...</td></tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-8 text-center">
                  <p className="text-sm text-red-700" role="alert">{error}</p>
                  <button type="button" onClick={() => void loadTickets()} className="mt-2 text-sm font-semibold text-[#002679] hover:underline">
                    Reintentar
                  </button>
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-500">No hay tickets para este filtro.</td></tr>
            ) : tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-slate-200/80 align-top text-sm text-slate-700 transition-colors hover:bg-[#F3F6FB]">
                <td className="px-3 py-4 font-semibold text-[#002679]">{ticket.id}</td>
                <td className="px-3 py-4 font-medium text-slate-800">{ticket.cliente}</td>
                <td className="px-3 py-4">{ticket.area}</td>
                <td className="min-w-52 px-3 py-4 text-slate-600">{ticket.actividad}</td>
                <td className="whitespace-nowrap px-3 py-4">{ticket.abierto}</td>
                <td className="whitespace-nowrap px-3 py-4">{ticket.cierre}</td>
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={ticket.estado} />
                    <Link
                      href={`/tickets/detail?id=${encodeURIComponent(ticket.id)}`}
                      className="text-xs font-medium text-[#002679] underline-offset-4 transition hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-xs text-slate-500">Página {page} de {Math.max(1, Math.ceil(total / 20))}</p>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-[#002679] transition hover:bg-[#F3F6FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] disabled:opacity-40">
            Anterior
          </button>
          <button type="button" disabled={page * 20 >= total || loading} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-[#002679] transition hover:bg-[#F3F6FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] disabled:opacity-40">
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}
