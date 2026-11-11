type StatCardProps = {
  label: string;
  value: string;
  change: string;
  tone?: "purple" | "sky" | "emerald" | "amber";
};

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  purple: "bg-violet-50 text-violet-700 ring-violet-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

export function StatCard({ label, value, change, tone = "purple" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneStyles[tone]}`}>
        {change}
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
