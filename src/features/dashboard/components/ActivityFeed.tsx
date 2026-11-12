const activities = [
  {
    time: "Hace 12 min",
    title: "Correo recibido de Banco Norte",
    detail: "Se registró apertura de ticket con hora de inicio y descripción del trabajo.",
  },
  {
    time: "Hace 34 min",
    title: "Ticket en revisión",
    detail: "Alegra Logística solicita confirmación del alcance y cierre del pedido.",
  },
  {
    time: "Hace 1 h",
    title: "Respuesta enviada",
    detail: "Grupo Solis respondió el correo con la hora de cierre del servicio.",
  },
  {
    time: "Hace 2 h",
    title: "Nuevo correo de soporte",
    detail: "Mundial Textiles reportó una incidencia de acceso del equipo de operaciones.",
  },
];

export function ActivityFeed() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-900/[0.04]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#002679]">Actividad</p>
          <h3 className="text-xl font-semibold text-[#002679]">Actividad reciente</h3>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-3 rounded-xl border border-slate-200 bg-[#F7F9FC] p-3">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EEF8] text-xs font-semibold text-[#002679]">
              <span className="h-2 w-2 rounded-full bg-[#EB7700]" aria-hidden="true" />
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
