"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { listOrganizations } from "../lib/ticket-api";

type OrganizationOption = { id: string; name: string };
type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const priorities: Array<{ value: Priority; label: string }> = [
  { value: "LOW", label: "Baja" },
  { value: "MEDIUM", label: "Media" },
  { value: "HIGH", label: "Alta" },
  { value: "CRITICAL", label: "Crítica" },
];

export function TicketForm() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);
    try {
      await apiRequest("/tickets", {
        method: "POST",
        body: JSON.stringify({ organizationId, title, area, description, priority }),
      });
      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : "No se pudo crear el ticket.",
      );
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
              Registrar trabajo
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

            <div className="space-y-2">
              <label htmlFor="ticket-area" className="text-sm font-semibold text-slate-800">
                Área de atención
              </label>
              <input
                id="ticket-area"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                required
                minLength={2}
                maxLength={100}
                placeholder="Ej. Soporte técnico"
                className="w-full rounded-xl border border-slate-300 bg-[#F7F9FC] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#002679] focus:bg-white focus:ring-4 focus:ring-[#002679]/10"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="ticket-title" className="text-sm font-semibold text-slate-800">
                Actividad o asunto
              </label>
              <input
                id="ticket-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                minLength={3}
                maxLength={160}
                placeholder="Resume el trabajo o solicitud"
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

            <fieldset className="space-y-2 md:col-span-2">
              <legend className="text-sm font-semibold text-slate-800">Prioridad</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {priorities.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition focus-within:ring-2 focus-within:ring-[#002679] ${
                      priority === option.value
                        ? "border-[#002679] bg-[#002679] text-white ring-2 ring-[#002679]/15"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-[#F3F6FA]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={priority === option.value}
                      onChange={() => setPriority(option.value)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} className="focus-visible:ring-[#002679]">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || loadingOrganizations || organizations.length === 0}
              className="bg-[#002679] text-white shadow-sm hover:bg-[#001d5c] focus-visible:ring-[#002679]"
            >
              {loading ? "Guardando ticket..." : "Crear ticket"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
