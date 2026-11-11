import { ClientPortalPage } from "@/src/features/clients/components/ClientPortalPage";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

export default function ClientPortalRoute() {
  return (
    <SessionGuard allowedRoles={["Cliente"]}>
      <ClientPortalPage />
    </SessionGuard>
  );
}
