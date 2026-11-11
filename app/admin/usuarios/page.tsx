"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

type Organization = { id: string; name: string };
type Invitation = { email: string; organization: string; url: string; expiresAt: string };
type InternalRole = "OPERATOR" | "SUPERVISOR";

function AdminUsersContent() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationName, setOrganizationName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [internalName, setInternalName] = useState("");
  const [internalEmail, setInternalEmail] = useState("");
  const [internalRole, setInternalRole] = useState<InternalRole>("OPERATOR");
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadOrganizations = useCallback(async () => {
    try {
      const result = await apiRequest<{ organizations: Organization[] }>("/admin/organizations");
      setOrganizations(result.organizations);
      setSelectedOrganization((current) => current || result.organizations[0]?.id || "");
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "No se pudieron cargar las organizaciones.");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadOrganizations(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadOrganizations]);

  const handleCreateOrganization = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await apiRequest("/admin/organizations", {
        method: "POST",
        body: JSON.stringify({ name: organizationName }),
      });
      setOrganizationName("");
      setNotice("Organización creada correctamente.");
      await loadOrganizations();
    } catch (createError) {
      setError(createError instanceof ApiError ? createError.message : "No se pudo crear la organización.");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setInvitation(null);
    setLoading(true);
    try {
      const result = await apiRequest<{ invitation: Invitation }>("/admin/invitations/clients", {
        method: "POST",
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          organizationId: selectedOrganization,
        }),
      });
      setInvitation(result.invitation);
      setClientName("");
      setClientEmail("");
    } catch (inviteError) {
      setError(inviteError instanceof ApiError ? inviteError.message : "No se pudo crear la invitación.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInternalUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await apiRequest("/admin/users/internal", {
        method: "POST",
        body: JSON.stringify({ name: internalName, email: internalEmail, role: internalRole }),
      });
      setInternalName("");
      setInternalEmail("");
      setNotice("Cuenta interna creada. El usuario podrá vincularse con Google usando ese correo.");
    } catch (createError) {
      setError(createError instanceof ApiError ? createError.message : "No se pudo crear la cuenta interna.");
    } finally {
      setLoading(false);
    }
  };

  const copyInvitation = async () => {
    if (!invitation) return;
    try {
      await navigator.clipboard.writeText(invitation.url);
      setNotice("Enlace de invitación copiado.");
    } catch (copyError) {
      setError(copyError instanceof Error ? `No se pudo copiar el enlace: ${copyError.message}` : "No se pudo copiar el enlace.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm font-medium text-violet-700 hover:text-violet-900">← Administración</Link>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Cuentas y acceso</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Organizaciones y usuarios</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Invita a clientes a crear su contraseña y habilita al equipo con acceso de Google.
            </p>
          </div>
        </header>

        {(error || notice) && (
          <p className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role={error ? "alert" : "status"}>
            {error || notice}
          </p>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Crear organización</h2>
            <p className="mt-1 text-sm text-slate-500">Las organizaciones vinculan a sus usuarios y tickets.</p>
            <form onSubmit={handleCreateOrganization} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="organization-name">Nombre de organización</label>
              <input
                id="organization-name"
                required
                minLength={2}
                maxLength={120}
                value={organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
                placeholder="Nombre de la empresa"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <button type="submit" disabled={loading} className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">
                Crear
              </button>
            </form>
            <ul className="mt-5 space-y-2">
              {organizations.map((organization) => (
                <li key={organization.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {organization.name}
                </li>
              ))}
              {organizations.length === 0 && <li className="text-sm text-slate-500">No hay organizaciones registradas.</li>}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Invitar cliente</h2>
            <p className="mt-1 text-sm text-slate-500">La invitación dura 72 horas y se usa una sola vez.</p>
            <form onSubmit={handleInviteClient} className="mt-5 space-y-3">
              <label className="sr-only" htmlFor="client-name">Nombre del cliente</label>
              <input id="client-name" required minLength={2} maxLength={120} value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Nombre de la persona" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              <label className="sr-only" htmlFor="client-email">Correo del cliente</label>
              <input id="client-email" required type="email" maxLength={254} value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} placeholder="correo@empresa.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              <label className="sr-only" htmlFor="client-organization">Organización del cliente</label>
              <select id="client-organization" required value={selectedOrganization} onChange={(event) => setSelectedOrganization(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100">
                <option value="">Selecciona organización</option>
                {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
              </select>
              <button type="submit" disabled={loading || organizations.length === 0 || !selectedOrganization} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
                Generar invitación
              </button>
            </form>
            {invitation && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-900">Invitación lista · {invitation.organization}</p>
                <p className="mt-1 break-all text-xs text-emerald-800">{invitation.url}</p>
                <p className="mt-2 text-xs text-emerald-800">Vence: {new Date(invitation.expiresAt).toLocaleString("es")}</p>
                <button type="button" onClick={() => void copyInvitation()} className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-200 hover:bg-emerald-100">
                  Copiar enlace
                </button>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Habilitar personal interno</h2>
            <p className="mt-1 text-sm text-slate-500">El correo se autoriza aquí y el usuario inicia sesión con Google.</p>
            <form onSubmit={handleCreateInternalUser} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_200px_auto]">
              <label className="sr-only" htmlFor="internal-name">Nombre del usuario</label>
              <input id="internal-name" required minLength={2} maxLength={120} value={internalName} onChange={(event) => setInternalName(event.target.value)} placeholder="Nombre completo" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              <label className="sr-only" htmlFor="internal-email">Correo corporativo</label>
              <input id="internal-email" required type="email" maxLength={254} value={internalEmail} onChange={(event) => setInternalEmail(event.target.value)} placeholder="correo@empresa.com" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              <label className="sr-only" htmlFor="internal-role">Rol interno</label>
              <select id="internal-role" value={internalRole} onChange={(event) => setInternalRole(event.target.value as InternalRole)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100">
                <option value="OPERATOR">Usuario operativo</option>
                <option value="SUPERVISOR">Supervisor</option>
              </select>
              <button type="submit" disabled={loading} className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">
                Autorizar acceso
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function AdminUsuariosPage() {
  return (
    <SessionGuard allowedRoles={["Administrador"]}>
      <AdminUsersContent />
    </SessionGuard>
  );
}
