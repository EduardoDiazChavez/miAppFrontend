import { TicketForm } from "./TicketForm";

export function TicketFormPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4 sm:mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600 sm:text-sm">
            Trabajo remoto
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
            Generar ticket
          </h1>
        </div>

        <TicketForm />
      </div>
    </main>
  );
}
