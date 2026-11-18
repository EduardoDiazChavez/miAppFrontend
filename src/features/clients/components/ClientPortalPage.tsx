"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/src/features/auth/lib/api-client";
import { SessionBar } from "@/src/features/auth/components/SessionBar";
import type { TicketRecord } from "@/src/features/tickets/types";
import { TicketFilterMenu } from "@/src/features/dashboard/components/TicketFilterMenu";
import { getTicketFilterUsers, listTickets } from "@/src/features/tickets/lib/ticket-api";
import { StatusBadge } from "@/src/features/dashboard/components/StatusBadge";

export function ClientPortalPage() {
  const [clientTickets, setClientTickets] = useState<TicketRecord[]>([]);
  const [filterUsers, setFilterUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [filterUsersLoading, setFilterUsersLoading] = useState(true);
  const [filterUsersError, setFilterUsersError] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const loadTickets = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    try {
      const result = await listTickets({
        limit: 100,
        ...(userFilter ? { userId: userFilter } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
      });
      if (currentRequestId !== requestId.current) return;
      setClientTickets(result.tickets);
      setError("");
    } catch (loadError) {
      if (currentRequestId !== requestId.current) return;
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "No se pudo cargar el historial de tickets.",
      );
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }, [dateFrom, dateTo, userFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadTickets(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadTickets]);

  useEffect(() => {
    let active = true;
    getTicketFilterUsers()
      .then((result) => {
        if (active) {
          setFilterUsers(result.users);
          setFilterUsersError("");
          setFilterUsersLoading(false);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setFilterUsersError(
            loadError instanceof ApiError
              ? loadError.message
              : "No se pudieron cargar los usuarios para filtrar.",
          );
          setFilterUsersLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const clearFilters = () => {
    setUserFilter("");
    setDateFrom("");
    setDateTo("");
  };
  const hasFilters = Boolean(userFilter || dateFrom || dateTo);
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
            <p className="text-sm text-slate-500">{hasFilters ? "Tickets encontrados" : "Tickets registrados"}</p>
            <p className="mt-2 text-3xl font-semibold text-[#002679]">
              {loading ? "—" : clientTickets.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-md shadow-slate-900/[0.04]">
            <p className="text-sm text-slate-500">{hasFilters ? "En seguimiento" : "Tickets en seguimiento"}</p>
            <p className="mt-2 text-3xl font-semibold text-[#002679]">
              {loading ? "—" : openCount}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-md shadow-slate-900/[0.04] sm:p-7">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#002679]">Tu organización</p>
              <h2 className="mt-1 text-xl font-semibold text-[#002679]">Tus solicitudes</h2>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-[#EB7700]" aria-hidden="true" />
            </div>
            <TicketFilterMenu
              showStatusFilter={false}
              showCreatorAndDateFilters
              users={filterUsers}
              userId={userFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              usersLoading={filterUsersLoading}
              usersError={filterUsersError}
              onUserChange={setUserFilter}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onClear={clearFilters}
            />
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
              {userFilter || dateFrom || dateTo
                ? "No hay tickets para los filtros seleccionados."
                : "Todavía no hay tickets asociados a tu organización."}
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
                      {ticket.creador && ticket.creador !== "—" ? `${ticket.creador} · ` : ""}
                      {ticket.fechaCreacion ? `${ticket.fechaCreacion} · ` : ""}
                      Hora de apertura: {ticket.horaApertura}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Hora de cierre:{" "}
                      {ticket.horaCierre ?? (ticket.estado === "Cerrado" ? "No disponible" : "Sin cierre")}
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
