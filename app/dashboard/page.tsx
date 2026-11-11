import { DashboardPage } from "@/src/features/dashboard/components/DashboardPage";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

export default function DashboardRoute() {
  return (
    <SessionGuard allowedRoles={["Usuario", "Supervisor", "Administrador"]}>
      <DashboardPage />
    </SessionGuard>
  );
}
