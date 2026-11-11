import { Suspense } from "react";
import { TicketDetailPage } from "@/src/features/tickets/components/TicketDetailPage";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

export default function TicketDetailRoute() {
  return (
    <SessionGuard allowedRoles={["Cliente", "Usuario", "Supervisor", "Administrador"]}>
      <Suspense fallback={<div className="min-h-screen bg-slate-100" />}>
        <TicketDetailPage />
      </Suspense>
    </SessionGuard>
  );
}
