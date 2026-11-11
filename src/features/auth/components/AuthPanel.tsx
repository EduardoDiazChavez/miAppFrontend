const stats = [
  { label: "Incidencias atendidas", value: "1.2k" },
  { label: "Tiempo medio", value: "3.4h" },
  { label: "Satisfacción", value: "96%" },
];

export function AuthPanel() {
  return (
    <aside className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-700 to-sky-600 p-6 text-white sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.26),_transparent_35%)]" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
          Sistema activo
        </div>

        <div className="mt-10 max-w-md">
          <p className="text-sm uppercase tracking-[0.24em] text-violet-100">MiApp</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Gestiona tu operación con claridad y velocidad.
          </h1>
          <p className="mt-4 text-base text-violet-100/90">
            Centraliza tickets, seguimiento y tareas del equipo en un único panel pensado para equipos modernos.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-xs text-violet-100/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
