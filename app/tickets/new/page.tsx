import { TicketFormPage } from "@/src/features/tickets/components/TicketFormPage";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";
import { internalUserRoles } from "@/src/features/auth/types";

export default function NewTicketPage() {
  return (
    <SessionGuard allowedRoles={internalUserRoles}>
      <TicketFormPage />
    </SessionGuard>
  );
}
