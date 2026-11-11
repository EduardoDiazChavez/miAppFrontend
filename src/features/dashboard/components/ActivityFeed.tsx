const activities = [
  {
    time: "Hace 12 min",
    title: "Correo recibido de Banco Norte",
    detail: "Se registró apertura de ticket con hora de inicio y descripción del trabajo.",
    tone: "purple",
  },
  {
    time: "Hace 34 min",
    title: "Ticket en revisión",
    detail: "Alegra Logística solicita confirmación del alcance y cierre del pedido.",
    tone: "amber",
  },
  {
    time: "Hace 1 h",
    title: "Respuesta enviada",
    detail: "Grupo Solis respondió el correo con la hora de cierre del servicio.",
    tone: "emerald",
  },
  {
    time: "Hace 2 h",
    title: "Nuevo correo de soporte",
    detail: "Mundial Textiles reportó una incidencia de acceso del equipo de operaciones.",
    tone: "sky",
  },
];

const toneStyles = {
  purple: "bg-violet-100 text-violet-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-700",
};

export function ActivityFeed() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600">Actividad</p>
          <h3 className="text-xl font-semibold text-slate-900">Actividad reciente</h3>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${toneStyles[activity.tone as keyof typeof toneStyles]}`}>
              •
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                <span className="text-[11px] text-slate-400">{activity.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
