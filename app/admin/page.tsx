"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Archive, ArrowLeft, Check, LockKeyhole, Pencil, RotateCcw, Ticket, UserPlus } from "lucide-react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { SessionBar } from "@/src/features/auth/components/SessionBar";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

type Organization = {
  id: string;
  name: string;
  code: string;
  active: boolean;
  allowTicketCreation: boolean;
  archived: boolean;
};

type OrganizationUpdate = Partial<
  Pick<Organization, "name" | "code" | "active" | "allowTicketCreation" | "archived">
>;

function AdminPageContent() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiRequest<{ organizations: Organization[] }>("/admin/organizations");
      setOrganizations(result.organizations);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadOrganizations(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadOrganizations]);

  const updateOrganization = async (id: string, update: OrganizationUpdate, successMessage: string) => {
    setSavingId(id);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/admin/organizations/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(update),
      });
      await loadOrganizations();
      setEditingId("");
      setNotice(successMessage);
    } catch (updateError) {
      setError(updateError instanceof ApiError ? updateError.message : "No se pudo actualizar el cliente.");
    } finally {
      setSavingId("");
    }
  };

  const handleSaveEdit = (event: FormEvent<HTMLFormElement>, organization: Organization) => {
    event.preventDefault();
    void updateOrganization(
      organization.id,
      { name: editName, code: editCode.trim().toUpperCase() },
      "Los datos del cliente se actualizaron.",
    );
  };

  const handleArchive = (organization: Organization) => {
    const confirmed = window.confirm(
      `¿Archivar a ${organization.name}? Se bloqueará su acceso y se conservarán sus cuentas y tickets históricos.`,
    );
    if (confirmed) {
      void updateOrganization(organization.id, { archived: true }, "Cliente archivado. El historial se conservó.");
    }
  };

  const activeCount = organizations.filter((organization) => !organization.archived && organization.active).length;
  const archivedCount = organizations.filter((organization) => organization.archived).length;

  return (
    <main className="min-h-screen bg-[#F3F6FB] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-5 border-b border-slate-300/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#002679]">Administración</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#002679]">Clientes</h1>
            <div className="mt-3 h-0.5 w-12 rounded-full bg-[#EB7700]" aria-hidden="true" />
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Administra el acceso de cada cliente y define si el equipo puede abrirle tickets.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#002679] shadow-sm transition hover:bg-[#F7F9FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Volver al dashboard
            </Link>
            <SessionBar />
          </div>
        </header>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-[#E8EEF8] px-3 py-1.5 font-medium text-[#002679]">
              {activeCount} activos
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600">
              {archivedCount} archivados
            </span>
          </div>
          <Link
            href="/admin/usuarios"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#002679] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001d5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] focus-visible:ring-offset-2"
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Crear cliente
          </Link>
        </div>

        {(error || notice) && (
          <p
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
              error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
            role={error ? "alert" : "status"}
          >
            {error || notice}
          </p>
        )}

        <section aria-labelledby="client-list-heading" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 id="client-list-heading" className="text-xl font-semibold text-[#002679]">Clientes disponibles</h2>
            <p className="mt-1 text-sm text-slate-500">
              Bloquear el acceso no elimina las cuentas; archivar conserva también el historial de tickets.
            </p>
          </div>

          {loading ? (
            <p className="rounded-xl bg-[#F7F9FC] p-5 text-sm text-slate-600" role="status">Cargando clientes...</p>
          ) : error && organizations.length === 0 ? (
            <button
              type="button"
              onClick={() => void loadOrganizations()}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-[#002679] transition hover:bg-[#F3F6FB]"
            >
              Reintentar
            </button>
          ) : organizations.length === 0 ? (
            <div className="rounded-xl bg-[#F7F9FC] p-6 text-center">
              <p className="text-sm text-slate-600">Aún no hay clientes registrados.</p>
              <Link href="/admin/usuarios" className="mt-3 inline-flex text-sm font-semibold text-[#002679] hover:underline">
                Crear el primer cliente
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {organizations.map((organization) => (
                <li key={organization.id} className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-slate-900">{organization.name}</h3>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold tracking-wide text-[#002679] ring-1 ring-slate-200">
                          {organization.code || "Sin siglas"}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            organization.archived
                              ? "bg-slate-200 text-slate-700"
                              : organization.active
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {organization.archived ? "Archivado" : organization.active ? "Acceso activo" : "Acceso bloqueado"}
                        </span>
                      </div>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <Ticket aria-hidden="true" className="h-3.5 w-3.5" />
                        {organization.allowTicketCreation ? "Se pueden crear tickets" : "Creación de tickets desactivada"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={Boolean(savingId)}
                        onClick={() => {
                          setEditingId(editingId === organization.id ? "" : organization.id);
                          setEditName(organization.name);
                          setEditCode(organization.code);
                          setError("");
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#002679]/30 hover:text-[#002679] disabled:opacity-50"
                      >
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                        Editar
                      </button>
                      {!organization.archived && (
                        <>
                          <button
                            type="button"
                            disabled={Boolean(savingId)}
                            onClick={() => void updateOrganization(
                              organization.id,
                              { active: !organization.active },
                              organization.active ? "Acceso del cliente bloqueado." : "Acceso del cliente habilitado.",
                            )}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#002679]/30 hover:text-[#002679] disabled:opacity-50"
                          >
                            <LockKeyhole aria-hidden="true" className="h-4 w-4" />
                            {organization.active ? "Bloquear acceso" : "Habilitar acceso"}
                          </button>
                          <button
                            type="button"
                            disabled={Boolean(savingId)}
                            onClick={() => void updateOrganization(
                              organization.id,
                              { allowTicketCreation: !organization.allowTicketCreation },
                              organization.allowTicketCreation
                                ? "La creación de tickets se desactivó para este cliente."
                                : "La creación de tickets se habilitó para este cliente.",
                            )}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#002679]/30 hover:text-[#002679] disabled:opacity-50"
                          >
                            <Ticket aria-hidden="true" className="h-4 w-4" />
                            {organization.allowTicketCreation ? "Desactivar tickets" : "Permitir tickets"}
                          </button>
                          <button
                            type="button"
                            disabled={Boolean(savingId)}
                            onClick={() => handleArchive(organization)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Archive aria-hidden="true" className="h-4 w-4" />
                            Archivar
                          </button>
                        </>
                      )}
                      {organization.archived && (
                        <button
                          type="button"
                          disabled={Boolean(savingId)}
                          onClick={() => void updateOrganization(organization.id, { archived: false }, "Cliente restaurado. Habilita su acceso cuando quieras.")}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#002679]/30 hover:text-[#002679] disabled:opacity-50"
                        >
                          <RotateCcw aria-hidden="true" className="h-4 w-4" />
                          Restaurar
                        </button>
                      )}
                    </div>
                  </div>

                  {editingId === organization.id && (
                    <form
                      onSubmit={(event) => handleSaveEdit(event, organization)}
                      className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-[minmax(0,1fr)_180px_auto]"
                    >
                      <div className="space-y-1.5">
                        <label htmlFor={`client-name-${organization.id}`} className="text-sm font-medium text-slate-700">Nombre del cliente</label>
                        <input
                          id={`client-name-${organization.id}`}
                          required
                          minLength={2}
                          maxLength={120}
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor={`client-code-${organization.id}`} className="text-sm font-medium text-slate-700">Siglas</label>
                        <input
                          id={`client-code-${organization.id}`}
                          required
                          minLength={2}
                          maxLength={8}
                          pattern="[A-Za-z0-9]{2,8}"
                          value={editCode}
                          onChange={(event) => setEditCode(event.target.value.toUpperCase())}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          type="submit"
                          disabled={Boolean(savingId)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#002679] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#001d5c] disabled:opacity-50"
                        >
                          <Check aria-hidden="true" className="h-4 w-4" />
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId("")}
                          className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <SessionGuard allowedRoles={["Administrador"]}>
      <AdminPageContent />
    </SessionGuard>
  );
}
