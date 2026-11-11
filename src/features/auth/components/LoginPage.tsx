"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { ApiError, apiRequest, getHomeForRole, notifySessionChanged, toSessionUser, type ApiUser } from "../lib/api-client";
import { GoogleLoginButton } from "./GoogleLoginButton";

type LoginMode = "client" | "team";

export function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("client");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuccess = useCallback(() => {
    router.replace("/dashboard");
  }, [router]);

  const handleGoogleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleClientLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiRequest<{ user: ApiUser }>("/auth/client/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      notifySessionChanged();
      router.replace(getHomeForRole(toSessionUser(result.user).role));
    } catch (loginError) {
      setError(
        loginError instanceof ApiError
          ? loginError.message
          : "No se pudo iniciar sesión. Inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] px-4 py-6 text-slate-950 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -left-36 top-12 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al inicio
        </Link>

        <div className="my-auto grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_32px_100px_rgba(27,34,65,0.12)] backdrop-blur-xl lg:grid-cols-[1fr_0.88fr]">
          <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-[#15172a] p-8 text-white sm:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/40 blur-3xl" />
            <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-violet-700">
                  m
                </span>
                miapp
              </Link>
              <div className="mt-14 max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">
                  Un acceso, una experiencia a tu medida
                </p>
                <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  El seguimiento del servicio, sin perder el hilo.
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                  Clientes y equipo trabajan en el mismo historial, con las herramientas adecuadas para cada rol.
                </p>
              </div>
            </div>
            <div className="relative mt-12 flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck size={18} className="text-emerald-300" aria-hidden="true" />
              Acceso protegido según tu perfil
            </div>
          </section>

          <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              <p className="text-sm font-semibold text-violet-700">Bienvenido a MiApp</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Inicia sesión
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Selecciona tu tipo de acceso para continuar.
              </p>

              <div className="mt-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="Tipo de acceso">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "client"}
                  onClick={() => {
                    setMode("client");
                    setError("");
                  }}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    mode === "client" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Soy cliente
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "team"}
                  onClick={() => {
                    setMode("team");
                    setError("");
                  }}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    mode === "team" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Soy del equipo
                </button>
              </div>

              {error && (
                <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                  {error}
                </p>
              )}

              {mode === "client" ? (
                <form onSubmit={handleClientLogin} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-slate-700">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                      <input
                        id="username"
                        type="email"
                        autoComplete="username"
                        required
                        maxLength={254}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="tu@empresa.com"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Contraseña
                    </label>
                    <div className="relative">
                      <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        minLength={10}
                        maxLength={128}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Tu contraseña"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Las cuentas de cliente se habilitan mediante invitación.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-[#5b4be8] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-[#4b3bd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-wait disabled:opacity-70"
                  >
                    {loading ? "Verificando acceso..." : "Entrar al portal"}
                  </button>
                </form>
              ) : (
                <div className="mt-6 space-y-4">
                  <p className="text-sm leading-6 text-slate-600">
                    Acceso para personal autorizado que administra y genera tickets.
                  </p>
                  <GoogleLoginButton onSuccess={handleSuccess} onError={handleGoogleError} />
                </div>
              )}

              <p className="mt-7 text-center text-xs leading-5 text-slate-500">
                Al continuar, aceptas las políticas de uso y privacidad de tu organización.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
