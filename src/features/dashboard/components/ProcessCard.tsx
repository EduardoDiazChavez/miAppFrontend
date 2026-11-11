const steps = [
  { title: "1. Apertura por correo", detail: "Se registra la hora de inicio, área y descripción del trabajo." },
  { title: "2. Asignación y seguimiento", detail: "El equipo revisa la tarea y confirma el alcance solicitado." },
  { title: "3. Cierre del ticket", detail: "Se responde el correo con la hora final y el resultado del trabajo." },
];

export function ProcessCard() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900 p-6 text-white shadow-lg shadow-violet-900/20">
      <p className="text-sm font-medium text-violet-200">Flujo de trabajo</p>
      <h3 className="mt-2 text-xl font-semibold">Cómo se gestiona cada ticket</h3>

      <div className="mt-6 space-y-4">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold text-violet-100">{step.title}</p>
            <p className="mt-2 text-sm text-slate-200">{step.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
