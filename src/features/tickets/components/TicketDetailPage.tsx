"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { useSession } from "@/src/features/auth/hooks/useSession";
import type { TicketRecord } from "@/src/features/dashboard/data/mockData";
import { getTicket, toTicketRecord, type ApiTicket } from "../lib/ticket-api";
import { StatusBadge } from "@/src/features/dashboard/components/StatusBadge";
import { TicketConversation } from "./TicketConversation";

export function TicketDetailPage() {
  const searchParams = useSearchParams();
  const { session } = useSession();
  const ticketId = searchParams.get("id") ?? "";
  const isClient = session?.role === "Cliente";
  const returnHref = isClient ? "/cliente" : "/dashboard";
  const [ticket, setTicket] = useState<TicketRecord | null>(null);
  const [rawTicket, setRawTicket] = useState<ApiTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadTicket = useCallback(async () => {
    if (!ticketId) {
      setError("No se indicó un ticket para consultar.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getTicket(ticketId);
      setRawTicket(result.ticket);
      setTicket(toTicketRecord(result.ticket));
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "No se pudo cargar el ticket.",
      );
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadTicket(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadTicket]);

  const closeTicket = async () => {
    if (!rawTicket) return;
    setSaving(true);
    setError("");
    try {
      const result = await apiRequest<{ ticket: ApiTicket }>(
        `/tickets/${encodeURIComponent(ticketId)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: "CLOSED" }),
        },
      );
      setRawTicket(result.ticket);
      setTicket(toTicketRecord(result.ticket));
    } catch (saveError) {
      setError(
        saveError instanceof ApiError
          ? saveError.message
          : "No se pudo actualizar el estado del ticket.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <p className="inline-flex items-center gap-2 text-sm text-slate-600" role="status">
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          Cargando ticket...
        </p>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Ticket</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Ticket no disponible</h1>
          <p className="mt-2 text-slate-600" role="alert">
            {error || "No encontramos este ticket en el historial disponible para tu cuenta."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => void loadTicket()} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Reintentar
            </button>
            <Link href={returnHref} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500">
              Volver
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Ticket</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Detalle del ticket</h1>
          </div>
          <Link
            href={returnHref}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            {isClient ? "Volver al historial" : "Volver al dashboard"}
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Ticket</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">{ticket.id}</h2>
            </div>
            <StatusBadge status={ticket.estado} />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                {isClient ? "Servicio" : "Actividad"}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{ticket.actividad}</p>
              <p className="text-sm text-slate-500">{ticket.area}</p>
            </div>

            {!isClient && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Responsable</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{ticket.responsable}</p>
              </div>
            )}

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Hora de apertura</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{ticket.horaApertura}</p>
            </div>

            {!isClient && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Hora de cierre</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{ticket.horaCierre ?? "Sin cierre"}</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Descripción</p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-700">{ticket.descripcion}</p>
          </div>

          {!isClient && (
            <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl bg-violet-50 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600">Prioridad</p>
                <p className="mt-1 text-xl font-semibold text-violet-900">{ticket.prioridad}</p>
              </div>
              {ticket.estado !== "Cerrado" && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void closeTicket()}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:opacity-60"
                >
                  {saving ? "Actualizando..." : "Cerrar ticket"}
                </button>
              )}
            </div>
          )}
          {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
        </section>
        <TicketConversation ticketId={ticket.id} />
      </div>
    </main>
  );
}
