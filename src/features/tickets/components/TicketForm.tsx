"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { listOrganizations } from "../lib/ticket-api";

type OrganizationOption = { id: string; name: string; code?: string };

function getTicketErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return "No se pudo abrir el ticket.";

  if (Array.isArray(error.details)) {
    const messagesByField: Record<string, string> = {
      organizationId: "Selecciona un cliente válido.",
      process: "El proceso debe tener entre 3 y 160 caracteres.",
      description: "La descripción debe tener entre 5 y 5000 caracteres.",
    };
    const messages = error.details.flatMap((issue) => {
      if (!issue || typeof issue !== "object" || !("path" in issue) || !Array.isArray(issue.path)) {
        return [];
      }
      const field = issue.path[0];
      return typeof field === "string" && messagesByField[field]
        ? [messagesByField[field]]
        : [];
    });
    if (messages.length > 0) return [...new Set(messages)].join(" ");
  }

  return error.message;
}

function getInitials(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getTicketCode(userName: string, organizationCode: string, date: Date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `TK${getInitials(userName)}-${day}${month}${year}-${organizationCode}`;
}

export function TicketForm() {
  const router = useRouter();
  const { session, loading: loadingSession } = useSession();
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [process, setProcess] = useState("");
  const [description, setDescription] = useState("");
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedOrganization = organizations.find(
    (organization) => organization.id === organizationId,
  );
  const previewCode =
    session && selectedOrganization
      ? getTicketCode(
          session.name,
          selectedOrganization.code || getInitials(selectedOrganization.name),
          new Date(),
        )
      : loadingSession
        ? "Cargando usuario..."
        : "Selecciona un cliente";

  useEffect(() => {
    let active = true;
    const loadOrganizations = async () => {
      try {
        const result = await listOrganizations();
        if (active) {
          setOrganizations(result.organizations);
          setOrganizationId(result.organizations[0]?.id ?? "");
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof ApiError
              ? loadError.message
              : "No se pudieron cargar los clientes.",
          );
        }
      } finally {
        if (active) setLoadingOrganizations(false);
      }
    };

    void loadOrganizations();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedProcess = process.trim();
    const trimmedDescription = description.trim();
    if (trimmedProcess.length < 3) {
      setError("El proceso debe tener al menos 3 caracteres.");
      return;
    }
    if (trimmedDescription.length < 5) {
      setError("La descripción debe tener al menos 5 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest<{ ticket: { code: string } }>("/tickets", {
        method: "POST",
        body: JSON.stringify({
          organizationId,
          process: trimmedProcess,
          description: trimmedDescription,
        }),
      });
      router.push(`/tickets/detail?id=${encodeURIComponent(result.ticket.code)}`);
    } catch (submitError) {
      setError(getTicketErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-300/80 bg-white shadow-md shadow-slate-900/[0.04]">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="inline-flex rounded-full bg-[#E8EEF8] px-3 py-1 text-xs font-semibold text-[#002679]">
              Nuevo ticket
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-[#002679] sm:text-3xl">
              Abrir un ticket
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              El ticket se guardará y quedará disponible para el cliente en su historial.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="ticket-organization" className="text-sm font-semibold text-slate-800">
                Cliente
              </label>
              <select
                id="ticket-organization"
                required
                value={organizationId}
                onChange={(event) => setOrganizationId(event.target.value)}
                disabled={loadingOrganizations || organizations.length === 0}
                className="w-full rounded-xl border border-slate-300 bg-[#F7F9FC] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#002679] focus:bg-white focus:ring-4 focus:ring-[#002679]/10 disabled:opacity-60"
              >
                <option value="">
                  {loadingOrganizations ? "Cargando clientes..." : "Selecciona un cliente"}
                </option>
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
              {!loadingOrganizations && organizations.length === 0 && !error && (
                <p className="text-xs text-amber-700">Primero crea una organización desde administración.</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="ticket-process" className="text-sm font-semibold text-slate-800">
                Proceso
              </label>
              <input
                id="ticket-process"
                value={process}
                onChange={(event) => setProcess(event.target.value)}
                required
                minLength={3}
                maxLength={160}
                placeholder="Describe brevemente el proceso"
                className="w-full rounded-xl border border-slate-300 bg-[#F7F9FC] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#002679] focus:bg-white focus:ring-4 focus:ring-[#002679]/10"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="ticket-description" className="text-sm font-semibold text-slate-800">
                Descripción
              </label>
              <textarea
                id="ticket-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                minLength={5}
                maxLength={5000}
                rows={5}
                placeholder="Agrega el contexto, los pasos realizados o la ayuda solicitada..."
                className="w-full resize-y rounded-xl border border-slate-300 bg-[#F7F9FC] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#002679] focus:bg-white focus:ring-4 focus:ring-[#002679]/10"
              />
              <p className="text-right text-xs text-slate-400">{description.length}/5000</p>
            </div>

          </div>

          <section
            aria-label="Previsualización del ticket"
            className="rounded-2xl border border-[#002679]/15 bg-[#F3F6FB] p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Previsualización del ticket
                </p>
                <p className="mt-1 text-lg font-bold text-[#002679]">{previewCode}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                Se abrirá al confirmar
              </span>
            </div>
            <dl className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">Cliente</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedOrganization?.name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Proceso</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {process.trim() || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">Descripción</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {description.trim() || "—"}
                </dd>
              </div>
            </dl>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} className="focus-visible:ring-[#002679]">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                loadingSession ||
                !session ||
                loadingOrganizations ||
                organizations.length === 0
              }
              className="bg-[#002679] text-white shadow-sm hover:bg-[#001d5c] focus-visible:ring-[#002679]"
            >
              {loading ? "Abriendo ticket..." : "Abrir ticket"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
