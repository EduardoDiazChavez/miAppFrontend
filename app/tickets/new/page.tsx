import { TicketFormPage } from "@/src/features/tickets/components/TicketFormPage";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

export default function NewTicketPage() {
  return (
    <SessionGuard allowedRoles={["Usuario", "Supervisor", "Administrador"]}>
      <TicketFormPage />
    </SessionGuard>
  );
}
