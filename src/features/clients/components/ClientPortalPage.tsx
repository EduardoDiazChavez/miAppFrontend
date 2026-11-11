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
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
              Portal de cliente
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Historial de tickets
            </h1>
            <p className="mt-2 text-slate-600">
              Consulta el avance y responde al equipo desde cada ticket.
            </p>
          </div>
          <SessionBar />
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tickets registrados</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {loading ? "—" : clientTickets.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tickets en seguimiento</p>
            <p className="mt-2 text-3xl font-semibold text-violet-700">
              {loading ? "—" : openCount}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <p className="text-sm font-medium text-violet-600">Tu organización</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Tus solicitudes</h2>
          </div>

          {loading ? (
            <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600" role="status">
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
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-slate-900">{ticket.id}</h3>
                      <StatusBadge status={ticket.estado} />
                    </div>
                    <p className="mt-2 font-medium text-slate-700">{ticket.actividad}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {ticket.area} · Apertura {ticket.horaApertura}
                    </p>
                  </div>
                  <Link
                    href={`/tickets/detail?id=${encodeURIComponent(ticket.id)}`}
                    className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
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
