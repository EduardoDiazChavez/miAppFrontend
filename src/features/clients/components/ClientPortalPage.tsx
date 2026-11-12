"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/src/features/auth/lib/api-client";
import { SessionBar } from "@/src/features/auth/components/SessionBar";
import type { TicketRecord } from "@/src/features/dashboard/data/mockData";
import { listTickets } from "@/src/features/tickets/lib/ticket-api";
import { StatusBadge } from "@/src/features/dashboard/components/StatusBadge";

export function ClientPortalPage() {
  const [clientTickets, setClientTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listTickets({ limit: 100 });
      setClientTickets(result.tickets);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "No se pudo cargar el historial de tickets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadTickets(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadTickets]);

  const openCount = clientTickets.filter((ticket) => ticket.estado !== "Cerrado").length;

  return (
    <main className="min-h-screen bg-[#F3F6FB] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-5 border-b border-slate-300/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#002679]">
              Portal de cliente
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#002679] sm:text-3xl">
              Historial de tickets
            </h1>
            <div className="mt-3 h-0.5 w-12 rounded-full bg-[#EB7700]" aria-hidden="true" />
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Consulta el avance y responde al equipo desde cada ticket.
            </p>
          </div>
          <SessionBar />
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-md shadow-slate-900/[0.04]">
            <p className="text-sm text-slate-500">Tickets registrados</p>
            <p className="mt-2 text-3xl font-semibold text-[#002679]">
              {loading ? "—" : clientTickets.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-md shadow-slate-900/[0.04]">
            <p className="text-sm text-slate-500">Tickets en seguimiento</p>
            <p className="mt-2 text-3xl font-semibold text-[#002679]">
              {loading ? "—" : openCount}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-md shadow-slate-900/[0.04] sm:p-7">
          <div className="mb-5">
            <p className="text-sm font-medium text-[#002679]">Tu organización</p>
            <h2 className="mt-1 text-xl font-semibold text-[#002679]">Tus solicitudes</h2>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-[#EB7700]" aria-hidden="true" />
          </div>

          {loading ? (
            <p className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-6 text-sm text-slate-600" role="status">
              Cargando tus tickets...
            </p>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-red-800" role="alert">{error}</p>
              <button
                type="button"
                onClick={() => void loadTickets()}
                className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-800 ring-1 ring-red-200 transition hover:bg-red-100"
              >
                Reintentar
              </button>
            </div>
          ) : clientTickets.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
              Todavía no hay tickets asociados a tu cuenta.
            </p>
          ) : (
            <div className="space-y-3">
              {clientTickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-[#F7F9FC] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-slate-900">{ticket.id}</h3>
                      <StatusBadge status={ticket.estado} />
                    </div>
                    <p className="mt-2 font-medium text-slate-700">{ticket.proceso}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Apertura {ticket.horaApertura}
                    </p>
                  </div>
                  <Link
                    href={`/tickets/detail?id=${encodeURIComponent(ticket.id)}`}
                    className="shrink-0 rounded-xl bg-[#002679] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#001d5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2"
                  >
                    Ver historial y responder
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
