import { TicketForm } from "./TicketForm";

export function TicketFormPage() {
  return (
    <main className="min-h-screen bg-[#F3F6FB] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-5 border-b border-slate-300/80 pb-5 sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#002679] sm:text-sm">
            Trabajo remoto
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#002679] sm:text-3xl lg:text-4xl">
            Generar ticket
          </h1>
          <div className="mt-3 h-0.5 w-12 rounded-full bg-[#EB7700]" aria-hidden="true" />
        </div>

        <TicketForm />
      </div>
    </main>
  );
}
