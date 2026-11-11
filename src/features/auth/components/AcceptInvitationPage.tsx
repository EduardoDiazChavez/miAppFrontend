"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ApiError, apiRequest, getHomeForRole, notifySessionChanged, toSessionUser, type ApiUser } from "../lib/api-client";

export function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest<{ user: ApiUser }>("/auth/client/accept-invitation", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      notifySessionChanged();
      router.replace(getHomeForRole(toSessionUser(result.user).role));
    } catch (acceptError) {
      setError(
        acceptError instanceof ApiError
          ? acceptError.message
          : "No se pudo activar la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-9">
        <Link href="/" className="text-sm font-bold text-violet-700">miapp</Link>
        <p className="mt-8 text-sm font-semibold text-violet-700">Invitación de cliente</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Activa tu cuenta</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Define una contraseña para entrar al portal y seguir tus tickets.
        </p>

        {!token ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            Falta el código de invitación. Solicita un enlace nuevo al administrador de tu organización.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-slate-700">Contraseña nueva</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <p className="text-xs text-slate-500">Usa al menos 10 caracteres.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">Confirmar contraseña</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                maxLength={128}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#5b4be8] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4b3bd3] disabled:opacity-60">
              {loading ? "Activando cuenta..." : "Activar cuenta"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
