type StatusBadgeProps = {
  status: "Abierto" | "En revisión" | "Pendiente cierre" | "Cerrado";
};

const styles: Record<StatusBadgeProps["status"], string> = {
  Abierto: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "En revisión": "bg-amber-50 text-amber-700 ring-amber-200",
  "Pendiente cierre": "bg-[#FFF4E8] text-[#9A4D00] ring-[#F5C78F]",
  Cerrado: "bg-slate-200 text-slate-700 ring-slate-300",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles[status]}`}>
      {status}
    </span>
  );
}
