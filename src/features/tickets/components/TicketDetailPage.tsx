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
import { SessionBar } from "@/src/features/auth/components/SessionBar";

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
      <main className="flex min-h-screen items-center justify-center bg-[#F3F6FB] px-4">
        <p className="inline-flex items-center gap-2 text-sm text-slate-600" role="status">
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          Cargando ticket...
        </p>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-[#F3F6FB] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-300/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#002679]">Espacio de trabajo</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#002679] sm:text-3xl">Ticket no disponible</h1>
              <div className="mt-3 h-0.5 w-12 rounded-full bg-[#EB7700]" aria-hidden="true" />
            </div>
            <SessionBar />
          </header>
          <div className="rounded-2xl border border-slate-300/80 bg-white p-6 text-center shadow-md shadow-slate-900/[0.04] sm:p-8">
            <p className="mt-2 text-slate-600" role="alert">
              {error || "No encontramos este ticket en el historial disponible para tu cuenta."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => void loadTicket()} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#002679] transition hover:bg-[#F3F6FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679]">
                Reintentar
              </button>
              <Link href={returnHref} className="rounded-xl bg-[#002679] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#001d5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2">
                Volver
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F6FB] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-300/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#002679]">Espacio de trabajo</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#002679] sm:text-3xl">Detalle del ticket</h1>
            <div className="mt-3 h-0.5 w-12 rounded-full bg-[#EB7700]" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SessionBar />
            <Link
              href={returnHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#002679] transition hover:bg-[#F3F6FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679]"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {isClient ? "Volver al historial" : "Volver al dashboard"}
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-md shadow-slate-900/[0.04] sm:p-7">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#002679]">Ticket</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#002679]">{ticket.id}</h2>
            </div>
            <StatusBadge status={ticket.estado} />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Proceso
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-800">{ticket.proceso}</p>
            </div>

            {!isClient && (
              <div className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Responsable</p>
                <p className="mt-2 text-lg font-semibold text-slate-800">{ticket.responsable}</p>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Hora de apertura</p>
              <p className="mt-2 text-lg font-semibold text-slate-800">{ticket.horaApertura}</p>
            </div>

            {!isClient && (
              <div className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Hora de cierre</p>
                <p className="mt-2 text-lg font-semibold text-slate-800">{ticket.horaCierre ?? "Sin cierre"}</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-[#F7F9FC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#002679]">Descripción</p>
            <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-700">{ticket.descripcion}</p>
          </div>

          {!isClient && ticket.estado !== "Cerrado" && (
            <div className="mt-6 flex justify-end rounded-xl border border-[#002679]/10 bg-[#F3F6FA] p-4">
              <button
                type="button"
                disabled={saving}
                onClick={() => void closeTicket()}
                className="rounded-xl bg-[#002679] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001d5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Actualizando..." : "Cerrar ticket"}
              </button>
            </div>
          )}
          {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
        </section>
        <TicketConversation ticketId={ticket.id} />
      </div>
    </main>
  );
}
