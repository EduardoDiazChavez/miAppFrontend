import { Suspense } from "react";
import { AcceptInvitationPage } from "@/src/features/auth/components/AcceptInvitationPage";

export default function AcceptInvitationRoute() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-100" />}>
      <AcceptInvitationPage />
    </Suspense>
  );
}
