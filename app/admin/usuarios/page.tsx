"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";
import { SessionBar } from "@/src/features/auth/components/SessionBar";

type Organization = {
  id: string;
  name: string;
  code: string;
  active: boolean;
  archived: boolean;
};
type Invitation = { email: string; organization: string; url: string; expiresAt: string };
type InternalRole = "OPERATOR" | "SUPERVISOR";

function AdminUsersContent() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationCode, setOrganizationCode] = useState("");
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
      const activeOrganizations = result.organizations.filter(
        (organization) => organization.active && !organization.archived,
      );
      setOrganizations(activeOrganizations);
      setSelectedOrganization((current) =>
        activeOrganizations.some((organization) => organization.id === current)
          ? current
          : activeOrganizations[0]?.id || "",
      );
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
        body: JSON.stringify({
          name: organizationName,
          code: organizationCode.trim().toUpperCase(),
        }),
      });
      setOrganizationName("");
      setOrganizationCode("");
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
    <main className="min-h-screen bg-[#F3F6FB] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm font-medium text-[#002679] hover:text-[#001d5c]">← Clientes</Link>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#002679]">Cuentas y acceso</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#002679]">Crear cliente</h1>
            <div className="mt-3 h-0.5 w-12 rounded-full bg-[#EB7700]" aria-hidden="true" />
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Registra el cliente con sus siglas para tickets y después invita a las personas que iniciarán sesión.
            </p>
          </div>
          <SessionBar />
        </header>

        {(error || notice) && (
          <p className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role={error ? "alert" : "status"}>
            {error || notice}
          </p>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#002679]">Datos del cliente</h2>
            <p className="mt-1 text-sm text-slate-500">Las siglas aparecerán al final del código de cada ticket.</p>
            <form onSubmit={handleCreateOrganization} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="organization-name">Nombre del cliente</label>
                <input
                  id="organization-name"
                  required
                  minLength={2}
                  maxLength={120}
                  value={organizationName}
                  onChange={(event) => setOrganizationName(event.target.value)}
                  placeholder="Nombre de la empresa"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="organization-code">Siglas para tickets</label>
                <input
                  id="organization-code"
                  required
                  minLength={2}
                  maxLength={8}
                  pattern="[A-Za-z0-9]{2,8}"
                  value={organizationCode}
                  onChange={(event) => setOrganizationCode(event.target.value.toUpperCase())}
                  placeholder="Ej. ACME"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm uppercase outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10"
                />
                <p className="text-xs text-slate-500">De 2 a 8 letras o números; deben ser únicas.</p>
              </div>
              <button type="submit" disabled={loading} className="rounded-xl bg-[#002679] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#001d5c] disabled:opacity-60">
                Crear cliente
              </button>
            </form>
            <ul className="mt-5 space-y-2">
              {organizations.map((organization) => (
                <li key={organization.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {organization.name} <span className="ml-1 text-xs font-semibold tracking-wide text-[#002679]">{organization.code || "Sin siglas"}</span>
                </li>
              ))}
              {organizations.length === 0 && <li className="text-sm text-slate-500">No hay clientes activos disponibles.</li>}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#002679]">Invitar acceso de cliente</h2>
            <p className="mt-1 text-sm text-slate-500">El cliente define su contraseña desde la invitación, válida por 72 horas.</p>
            <form onSubmit={handleInviteClient} className="mt-5 space-y-3">
              <label className="sr-only" htmlFor="client-name">Nombre del cliente</label>
              <input id="client-name" required minLength={2} maxLength={120} value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Nombre de la persona" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10" />
              <label className="sr-only" htmlFor="client-email">Correo del cliente</label>
              <input id="client-email" required type="email" maxLength={254} value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} placeholder="correo@empresa.com" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10" />
              <label className="sr-only" htmlFor="client-organization">Organización del cliente</label>
              <select id="client-organization" required value={selectedOrganization} onChange={(event) => setSelectedOrganization(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10">
                <option value="">Selecciona cliente</option>
                {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
              </select>
              <button type="submit" disabled={loading || organizations.length === 0 || !selectedOrganization} className="w-full rounded-xl bg-[#002679] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#001d5c] disabled:opacity-50">
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
              <input id="internal-name" required minLength={2} maxLength={120} value={internalName} onChange={(event) => setInternalName(event.target.value)} placeholder="Nombre completo" className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10" />
              <label className="sr-only" htmlFor="internal-email">Correo corporativo</label>
              <input id="internal-email" required type="email" maxLength={254} value={internalEmail} onChange={(event) => setInternalEmail(event.target.value)} placeholder="correo@empresa.com" className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10" />
              <label className="sr-only" htmlFor="internal-role">Rol interno</label>
              <select id="internal-role" value={internalRole} onChange={(event) => setInternalRole(event.target.value as InternalRole)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#002679] focus:ring-4 focus:ring-[#002679]/10">
                <option value="OPERATOR">Usuario operativo</option>
                <option value="SUPERVISOR">Supervisor</option>
              </select>
              <button type="submit" disabled={loading} className="rounded-xl bg-[#002679] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#001d5c] disabled:opacity-60">
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
