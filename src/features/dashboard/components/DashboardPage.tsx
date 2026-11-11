"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ApiError, apiRequest } from "@/src/features/auth/lib/api-client";
import { ActivityFeed } from "./ActivityFeed";
import { StatCard } from "./StatCard";
import { TicketTable } from "./TicketTable";
import { SessionBar } from "@/src/features/auth/components/SessionBar";

type DashboardSummary = {
  total: number;
  active: number;
  closed: number;
  organizations: number;
  clientStats: Array<{ name: string; tickets: number }>;
  monthly: Array<{ month: string; tickets: number }>;
};

export function DashboardPage() {
  const [activeView, setActiveView] = useState<"tickets" | "metrics">("tickets");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    let active = true;
    const loadSummary = async () => {
      try {
        const result = await apiRequest<DashboardSummary>("/tickets/summary");
        if (active) {
          setSummary(result);
          setSummaryError("");
        }
      } catch (error) {
        if (active) {
          setSummaryError(
            error instanceof ApiError
              ? error.message
              : "No se pudieron cargar las métricas.",
          );
        }
      }
    };

    void loadSummary();
    return () => {
      active = false;
    };
  }, []);

  const dashboardStats = [
    { label: "Tickets activos", value: String(summary?.active ?? "—"), change: "Abiertos o en seguimiento", tone: "purple" as const },
    { label: "Tickets registrados", value: String(summary?.total ?? "—"), change: "Total histórico", tone: "sky" as const },
    { label: "Clientes activos", value: String(summary?.organizations ?? "—"), change: "Organizaciones", tone: "emerald" as const },
    { label: "Tickets cerrados", value: String(summary?.closed ?? "—"), change: "Con estado cerrado", tone: "amber" as const },
  ];
  const maxMonthlyTickets = Math.max(1, ...(summary?.monthly.map((month) => month.tickets) ?? [1]));

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Espacio de trabajo</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Operación de tickets</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SessionBar />

            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "tickets" | "metrics")} className="w-auto">
              <TabsList>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="metrics">Métricas</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button asChild className="shadow-lg shadow-violet-600/20">
              <Link href="/tickets/new">Nuevo ticket</Link>
            </Button>
          </div>
        </header>

        {activeView === "tickets" ? (
          <section className="space-y-4">
            <TicketTable />
          </section>
        ) : (
          <>
            {summaryError && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {summaryError}
              </p>
            )}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  tone={stat.tone}
                />
              ))}
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600">Clientes</p>
                      <h3 className="text-xl font-semibold text-slate-900">Tickets por cliente</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(summary?.clientStats ?? []).map((cliente) => (
                      <div key={cliente.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-800">{cliente.name}</p>
                            <p className="text-xs text-slate-500">{cliente.tickets} tickets</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">{cliente.tickets}</p>
                            <p className="text-xs text-slate-500">en total</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {summary && summary.clientStats.length === 0 && (
                      <p className="text-sm text-slate-500">Aún no hay tickets registrados por cliente.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5">
                    <p className="text-sm font-medium text-sky-600">Evolución</p>
                    <h3 className="text-xl font-semibold text-slate-900">Tickets creados por mes</h3>
                  </div>

                  <div className="flex h-40 items-end gap-3">
                    {(summary?.monthly ?? []).map((month) => (
                      <div key={month.month} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-violet-500 to-sky-400"
                          style={{ height: `${Math.max(4, (month.tickets / maxMonthlyTickets) * 100)}%` }}
                          title={`${month.tickets} tickets`}
                        />
                        <span className="text-xs text-slate-500">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <ActivityFeed />

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5">
                    <p className="text-sm font-medium text-violet-600">Usuarios</p>
                    <h3 className="text-xl font-semibold text-slate-900">Clientes con actividad</h3>
                  </div>

                  <div className="space-y-3">
                    {(summary?.clientStats ?? []).map((client) => (
                      <div key={client.name} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div>
                          <p className="font-medium text-slate-800">{client.name}</p>
                          <p className="text-xs text-slate-500">Cliente</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                            Activo
                          </span>
                          <p className="mt-2 text-xs text-slate-500">{client.tickets} tickets</p>
                        </div>
                      </div>
                    ))}
                    {summary && summary.clientStats.length === 0 && (
                      <p className="text-sm text-slate-500">No hay clientes con actividad registrada.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
