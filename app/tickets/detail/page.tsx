import { Suspense } from "react";
import { TicketDetailPage } from "@/src/features/tickets/components/TicketDetailPage";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";
import { internalUserRoles } from "@/src/features/auth/types";

export default function TicketDetailRoute() {
  return (
    <SessionGuard allowedRoles={["Cliente", ...internalUserRoles]}>
      <Suspense fallback={<div className="min-h-screen bg-slate-100" />}>
        <TicketDetailPage />
      </Suspense>
    </SessionGuard>
  );
}
