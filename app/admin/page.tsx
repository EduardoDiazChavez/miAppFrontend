import Link from "next/link";
import { SessionGuard } from "@/src/features/auth/components/SessionGuard";

export default function AdminPage() {
  return (
    <SessionGuard allowedRoles={["Administrador"]}>
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Administración</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Panel de administración</h1>
          <p className="mt-3 text-slate-600">Esta vista está lista para extender el control de usuarios, permisos y configuración del sistema.</p>
          <Link href="/admin/usuarios" className="mt-6 inline-flex rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500">
            Gestionar organizaciones y usuarios
          </Link>
        </div>
      </main>
    </SessionGuard>
  );
}
