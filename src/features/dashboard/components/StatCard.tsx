type StatCardProps = {
  label: string;
  value: string;
  change: string;
};

export function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-900/[0.04]">
      <div className="mb-4 h-0.5 w-9 rounded-full bg-[#EB7700]" aria-hidden="true" />
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#002679]">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{change}</p>
    </div>
  );
}
