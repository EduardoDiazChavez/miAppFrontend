import { DashboardPage } from "@/src/features/dashboard/components/DashboardPage";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";
import { internalUserRoles } from "@/src/features/auth/types";

export default function DashboardRoute() {
  return (
    <SessionGuard allowedRoles={internalUserRoles}>
      <DashboardPage />
    </SessionGuard>
  );
}
