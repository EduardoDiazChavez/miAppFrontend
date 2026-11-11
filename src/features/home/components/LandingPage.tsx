import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TicketCheck,
} from "lucide-react";

const benefits = [
  {
    icon: TicketCheck,
    title: "Tickets con contexto",
    description: "Cada solicitud conserva responsable, estado e historial en un mismo lugar.",
  },
  {
    icon: MessageSquareText,
    title: "Conversaciones claras",
    description: "El cliente responde sobre el caso. El equipo continúa desde el mismo hilo.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso por perfil",
    description: "Clientes y equipo entran por flujos distintos y ven lo que les corresponde.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5b4be8] text-base font-black text-white shadow-lg shadow-violet-500/25">
            m
          </span>
          miapp
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 sm:inline-flex"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 sm:px-5"
          >
            Acceder
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14 lg:grid-cols-[0.94fr_1.06fr] lg:gap-8 lg:px-10 lg:pb-32 lg:pt-16">
        <div className="pointer-events-none absolute -left-48 top-0 h-[34rem] w-[34rem] rounded-full bg-violet-200/50 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-16 h-96 w-96 rounded-full bg-sky-200/50 blur-[100px]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-violet-800 shadow-sm">
            <Sparkles size={14} aria-hidden="true" />
            Una operación más conectada
          </div>
          <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.35rem]">
            El servicio al cliente,{" "}
            <span className="bg-gradient-to-r from-[#5b4be8] via-violet-600 to-sky-600 bg-clip-text text-transparent">
              en movimiento.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Gestiona solicitudes, registra el trabajo y mantén cada conversación ligada a su ticket. Un espacio compartido para clientes y equipos.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5b4be8] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,75,232,0.28)] transition hover:-translate-y-0.5 hover:bg-[#4b3bd3]"
            >
              Entrar al portal
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              Conocer la plataforma
              <ArrowDownRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" aria-hidden="true" />
              Seguimiento en un solo hilo
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" aria-hidden="true" />
              Acceso según tu perfil
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
          <div className="absolute -inset-5 rounded-[2.4rem] bg-gradient-to-br from-violet-200/60 via-white/20 to-sky-200/60 blur-2xl" />
          <div className="relative rotate-[1deg] rounded-[1.8rem] border border-white/80 bg-white/75 p-3 shadow-[0_35px_90px_rgba(42,48,90,0.16)] backdrop-blur-xl sm:p-4">
            <div className="overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="ml-3 text-xs font-semibold text-slate-500">Espacio de trabajo</span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  En línea
                </span>
              </div>
              <div className="grid min-h-[310px] sm:min-h-[380px] sm:grid-cols-[150px_1fr]">
                <aside className="hidden border-r border-slate-100 bg-slate-50/80 p-4 sm:block">
                  <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="h-6 w-6 rounded-lg bg-violet-600" />
                    MiApp
                  </div>
                  {["Resumen", "Tickets", "Clientes", "Actividad"].map((item, index) => (
                    <div
                      key={item}
                      className={`mb-1 rounded-lg px-2.5 py-2 text-[11px] font-medium ${
                        index === 1 ? "bg-violet-100 text-violet-800" : "text-slate-500"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </aside>
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-violet-600">
                        Vista general
                      </p>
                      <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                        Hola, Ana <span aria-hidden="true">✦</span>
                      </h2>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-800">
                      AU
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { label: "Abiertos", value: "12", tone: "text-violet-700 bg-violet-50" },
                      { label: "En curso", value: "08", tone: "text-sky-700 bg-sky-50" },
                      { label: "Resueltos", value: "24", tone: "text-emerald-700 bg-emerald-50" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-slate-100 bg-white p-2.5 sm:p-3">
                        <p className="text-[9px] text-slate-500 sm:text-[10px]">{stat.label}</p>
                        <p className={`mt-1 inline-flex rounded-md px-1.5 py-0.5 text-sm font-bold sm:text-base ${stat.tone}`}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-slate-100 bg-white p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Actividad reciente</p>
                        <p className="mt-0.5 text-[9px] text-slate-400">Últimos movimientos del equipo</p>
                      </div>
                      <Layers3 size={15} className="text-slate-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 space-y-3">
                      {[
                        { code: "TK-1048", title: "Acceso a correo corporativo", status: "En revisión", tone: "bg-amber-50 text-amber-700", time: "hace 12 min" },
                        { code: "TK-1047", title: "Actualización de permisos", status: "Abierto", tone: "bg-violet-50 text-violet-700", time: "hace 1 h" },
                      ].map((ticket) => (
                        <div key={ticket.code} className="flex items-center gap-2.5 border-t border-slate-50 pt-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <TicketCheck size={15} aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-semibold text-slate-800">{ticket.title}</p>
                            <p className="mt-0.5 text-[9px] text-slate-400">{ticket.code} · {ticket.time}</p>
                          </div>
                          <span className={`whitespace-nowrap rounded-full px-2 py-1 text-[8px] font-semibold sm:text-[9px] ${ticket.tone}`}>
                            {ticket.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#f7f5ff] p-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-violet-700 shadow-sm">
                      <Clock3 size={14} aria-hidden="true" />
                    </span>
                    <p className="text-[9px] leading-4 text-slate-600">
                      El historial y las respuestas viven junto al ticket.
                    </p>
                    <MessageSquareText size={14} className="ml-auto shrink-0 text-violet-600" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-white bg-white/90 p-3 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Check size={17} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold text-slate-800">Un hilo, todo el contexto</p>
              <p className="text-[9px] text-slate-500">Vista previa del producto</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="relative border-y border-slate-200/80 bg-white/75 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Diseñado para trabajar en conjunto</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Menos seguimiento manual. Más claridad para todos.
            </h2>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  index === 0 ? "bg-violet-100 text-violet-700" : index === 1 ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">¿Ya tienes una cuenta?</h2>
          <p className="mt-2 text-sm text-slate-600">Entra al portal de cliente o al espacio de tu equipo.</p>
        </div>
        <Link
          href="/login"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
        >
          Acceder a MiApp
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
      <footer className="border-t border-slate-200/80 px-5 py-5 text-center text-xs text-slate-500">
        MiApp · Plataforma de gestión de servicios
      </footer>
    </main>
  );
}
