"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { SessionBar } from "@/src/features/auth/components/SessionBar";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

type InternalUser = { id: string; name: string; email: string; role: string };
type Organization = { id: string; name: string; code: string };
type Worksheet = { sheetId: number; title: string; rowCount: number };
type OrganizationSheet = {
  organizationId: string;
  sheetId: number;
  worksheetName: string;
};
type Workbook = {
  id: string;
  userId: string;
  periodLabel: string;
  spreadsheetId: string;
  spreadsheetTitle: string;
  timeZone: string;
  organizationSheets: OrganizationSheet[];
  isActive: boolean;
  createdAt: string;
};
type AdminData = {
  users: InternalUser[];
  organizations: Organization[];
  workbooks: Workbook[];
};
type SpreadsheetInfo = {
  spreadsheetId: string;
  title: string;
  timeZone: string;
  sheets: Worksheet[];
};

function normalizedName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function suggestWorksheet(organization: Organization, sheets: Worksheet[]) {
  const name = normalizedName(organization.name);
  const code = normalizedName(organization.code);
  return sheets.find((sheet) => {
    const title = normalizedName(sheet.title);
    return title === name || (code && (title === code || title.endsWith(` ${code}`)));
  });
}

function AdminGoogleSheetsContent() {
  const [data, setData] = useState<AdminData>({
    users: [],
    organizations: [],
    workbooks: [],
  });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [periodLabel, setPeriodLabel] = useState("");
  const [spreadsheetInput, setSpreadsheetInput] = useState("");
  const [spreadsheetInfo, setSpreadsheetInfo] = useState<SpreadsheetInfo | null>(null);
  const [worksheetByOrganization, setWorksheetByOrganization] = useState<Record<string, string>>({});
  const [editingWorkbookId, setEditingWorkbookId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTabs, setLoadingTabs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activatingId, setActivatingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiRequest<AdminData>("/admin/sheets/workbooks");
      setData(result);
      setSelectedUserId((current) =>
        result.users.some((user) => user.id === current)
          ? current
          : result.users[0]?.id ?? "",
      );
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "No se pudieron cargar las configuraciones de Google Sheets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const loadWorksheets = async (value: string, workbook?: Workbook) => {
    setError("");
    setNotice("");
    setLoadingTabs(true);
    try {
      const params = new URLSearchParams({ spreadsheetId: value });
      const result = await apiRequest<SpreadsheetInfo>(`/admin/sheets/tabs?${params.toString()}`);
      setSpreadsheetInfo(result);
      setSpreadsheetInput(result.spreadsheetId);
      if (workbook) {
        setWorksheetByOrganization(
          Object.fromEntries(
            workbook.organizationSheets.map((mapping) => [
              mapping.organizationId,
              String(mapping.sheetId),
            ]),
          ),
        );
      } else {
        setWorksheetByOrganization((current) => {
          const suggestions = { ...current };
          for (const organization of data.organizations) {
            if (suggestions[organization.id]) continue;
            const suggested = suggestWorksheet(organization, result.sheets);
            if (suggested) suggestions[organization.id] = String(suggested.sheetId);
          }
          return suggestions;
        });
      }
    } catch (loadError) {
      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "No se pudo consultar el archivo o sus pestañas.",
      );
      setSpreadsheetInfo(null);
    } finally {
      setLoadingTabs(false);
    }
  };

  const resetForm = () => {
    setEditingWorkbookId("");
    setPeriodLabel("");
    setSpreadsheetInput("");
    setSpreadsheetInfo(null);
    setWorksheetByOrganization({});
    setError("");
    setNotice("");
  };

  const handleSaveWorkbook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!spreadsheetInfo || !selectedUserId) return;
    setError("");
    setNotice("");
    setSaving(true);
    const organizationSheets = data.organizations.map((organization) => ({
      organizationId: organization.id,
      sheetId: Number(worksheetByOrganization[organization.id]),
    }));

    try {
      if (editingWorkbookId) {
        await apiRequest(`/admin/sheets/workbooks/${encodeURIComponent(editingWorkbookId)}/mappings`, {
          method: "PUT",
          body: JSON.stringify({ organizationSheets }),
        });
        setNotice("Las pestañas por empresa se actualizaron.");
      } else {
        await apiRequest("/admin/sheets/workbooks", {
          method: "POST",
          body: JSON.stringify({
            userId: selectedUserId,
            periodLabel,
            spreadsheetId: spreadsheetInfo.spreadsheetId,
            organizationSheets,
          }),
        });
        setNotice("Archivo mensual guardado y activado para el usuario.");
      }
      resetForm();
      await loadData();
    } catch (saveError) {
      setError(
        saveError instanceof ApiError
          ? saveError.message
          : "No se pudo guardar la configuración del archivo.",
      );
    } finally {
      setSaving(false);
    }
  };

  const editWorkbook = async (workbook: Workbook) => {
    setEditingWorkbookId(workbook.id);
    setSelectedUserId(workbook.userId);
    setPeriodLabel(workbook.periodLabel);
    setSpreadsheetInput(workbook.spreadsheetId);
    await loadWorksheets(workbook.spreadsheetId, workbook);
  };

  const activateWorkbook = async (workbook: Workbook) => {
    setError("");
    setNotice("");
    setActivatingId(workbook.id);
    try {
      await apiRequest(`/admin/sheets/workbooks/${encodeURIComponent(workbook.id)}/activate`, {
        method: "POST",
      });
      setNotice(`Se activó el archivo ${workbook.periodLabel} para ${workbook.spreadsheetTitle}.`);
      await loadData();
    } catch (activationError) {
      setError(
        activationError instanceof ApiError
          ? activationError.message
          : "No se pudo activar el archivo.",
      );
    } finally {
      setActivatingId("");
    }
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    if (!editingWorkbookId) setPeriodLabel("");
  };

  const allOrganizationsMapped =
    data.organizations.length > 0 &&
    data.organizations.every((organization) => worksheetByOrganization[organization.id]);

  return (
    <main className="min-h-screen bg-[#F3F6FB] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-5 border-b border-slate-300/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-medium text-[#002679] hover:text-[#001d5c]">← Administración</Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#002679]">Configuración de reportes</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#002679]">Hojas mensuales de tickets</h1>
            <div className="mt-3 h-0.5 w-12 rounded-full bg-[#EB7700]" aria-hidden="true" />
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              Asigna un archivo mensual a cada usuario y relaciona cada empresa con una pestaña existente.
              Al activar un archivo nuevo, el anterior de ese usuario queda cerrado.
            </p>
          </div>
          <SessionBar />
        </header>

        {(error || notice) && (
          <p
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
            role={error ? "alert" : "status"}
          >
            {error || notice}
          </p>
        )}

        {loading ? (
          <p className="rounded-xl bg-white p-5 text-sm text-slate-600" role="status">Cargando configuración...</p>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#002679]">
                    {editingWorkbookId ? "Editar pestañas por empresa" : "Configurar archivo mensual"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    El backend valida que el archivo sea accesible para la cuenta de servicio.
                  </p>
                </div>
                {editingWorkbookId && (
                  <button type="button" onClick={resetForm} className="text-sm font-semibold text-[#002679] hover:underline">
                    Cancelar edición
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveWorkbook} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="sheet-user" className="text-sm font-medium text-slate-700">Usuario que crea tickets</label>
                    <select
                      id="sheet-user"
                      required
                      disabled={Boolean(editingWorkbookId)}
                      value={selectedUserId}
                      onChange={(event) => handleUserChange(event.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"
                    >
                      <option value="">Selecciona un usuario</option>
                      {data.users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name} · {user.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="sheet-period" className="text-sm font-medium text-slate-700">Periodo / nombre del archivo</label>
                    <input
                      id="sheet-period"
                      required
                      minLength={1}
                      maxLength={80}
                      disabled={Boolean(editingWorkbookId)}
                      value={periodLabel}
                      onChange={(event) => setPeriodLabel(event.target.value)}
                      placeholder="Ej. Noviembre 2026"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="spreadsheet-id" className="text-sm font-medium text-slate-700">Enlace o ID del archivo mensual</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="spreadsheet-id"
                      required
                      minLength={10}
                      maxLength={500}
                      value={spreadsheetInput}
                      onChange={(event) => {
                        setSpreadsheetInput(event.target.value);
                        setSpreadsheetInfo(null);
                        setWorksheetByOrganization({});
                      }}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                    />
                    <button
                      type="button"
                      disabled={loadingTabs || spreadsheetInput.trim().length < 10}
                      onClick={() => void loadWorksheets(spreadsheetInput)}
                      className="rounded-xl border border-[#002679] px-4 py-2.5 text-sm font-semibold text-[#002679] disabled:opacity-50"
                    >
                      {loadingTabs ? "Consultando..." : "Cargar pestañas"}
                    </button>
                  </div>
                  {spreadsheetInfo && (
                    <p className="text-xs text-slate-500">
                      Archivo: {spreadsheetInfo.title || spreadsheetInfo.spreadsheetId} · Zona horaria: {spreadsheetInfo.timeZone}
                    </p>
                  )}
                </div>

                {spreadsheetInfo && (
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Pestaña para cada empresa</h3>
                      <p className="text-xs text-slate-500">Las sugerencias se basan en el nombre o las siglas; revísalas antes de guardar.</p>
                    </div>
                    {data.organizations.map((organization) => (
                      <div key={organization.id} className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
                        <label htmlFor={`organization-sheet-${organization.id}`} className="text-sm font-medium text-slate-700">
                          {organization.name} <span className="text-xs text-slate-500">{organization.code}</span>
                        </label>
                        <select
                          id={`organization-sheet-${organization.id}`}
                          required
                          value={worksheetByOrganization[organization.id] ?? ""}
                          onChange={(event) => setWorksheetByOrganization((current) => ({
                            ...current,
                            [organization.id]: event.target.value,
                          }))}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        >
                          <option value="">Selecciona una pestaña</option>
                          {spreadsheetInfo.sheets.map((sheet) => (
                            <option key={sheet.sheetId} value={sheet.sheetId}>{sheet.title}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <button
                      type="submit"
                      disabled={saving || !allOrganizationsMapped || !selectedUserId || (!editingWorkbookId && !periodLabel.trim())}
                      className="rounded-xl bg-[#002679] px-5 py-3 text-sm font-semibold text-white hover:bg-[#001d5c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Guardando..."
                        : editingWorkbookId
                          ? "Guardar pestañas"
                          : "Guardar y activar archivo"}
                    </button>
                  </div>
                )}
                {data.users.length === 0 && (
                  <p className="text-sm text-amber-700">No hay usuarios internos activos que puedan generar tickets.</p>
                )}
                {data.organizations.length === 0 && (
                  <p className="text-sm text-amber-700">Registra al menos una empresa antes de configurar el archivo.</p>
                )}
              </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold text-[#002679]">Archivos registrados</h2>
              <p className="mt-1 text-sm text-slate-500">Cada usuario tiene como máximo un archivo activo.</p>
              <div className="mt-5 space-y-3">
                {data.workbooks.map((workbook) => {
                  const user = data.users.find((item) => item.id === workbook.userId);
                  return (
                    <article key={workbook.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800">{workbook.periodLabel}</p>
                          <p className="mt-1 text-sm text-slate-600">{user?.name ?? "Usuario"} · {workbook.spreadsheetTitle}</p>
                          <p className="mt-1 break-all text-xs text-slate-500">{workbook.spreadsheetId}</p>
                          <p className="mt-1 text-xs text-slate-500">{workbook.organizationSheets.length} empresas relacionadas</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${workbook.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                          {workbook.isActive ? "Activo" : "Cerrado"}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={loadingTabs || saving}
                          onClick={() => void editWorkbook(workbook)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
                        >
                          Editar pestañas
                        </button>
                        {!workbook.isActive && (
                          <button
                            type="button"
                            disabled={Boolean(activatingId)}
                            onClick={() => void activateWorkbook(workbook)}
                            className="rounded-lg border border-[#002679] px-3 py-2 text-xs font-semibold text-[#002679] disabled:opacity-50"
                          >
                            {activatingId === workbook.id ? "Activando..." : "Activar archivo"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
                {data.workbooks.length === 0 && (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Todavía no hay archivos mensuales configurados.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminGoogleSheetsPage() {
  return (
    <SessionGuard allowedRoles={["Administrador"]}>
      <AdminGoogleSheetsContent />
    </SessionGuard>
  );
}
