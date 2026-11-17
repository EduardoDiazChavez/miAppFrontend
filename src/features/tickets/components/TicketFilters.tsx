import type { TicketFilterUser } from "../lib/ticket-api";

type TicketFiltersProps = {
  users: TicketFilterUser[];
  userId: string;
  dateFrom: string;
  dateTo: string;
  usersLoading?: boolean;
  onUserChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClear: () => void;
};

export function TicketFilters({
  users,
  userId,
  dateFrom,
  dateTo,
  usersLoading = false,
  onUserChange,
  onDateFromChange,
  onDateToChange,
  onClear,
}: TicketFiltersProps) {
  const hasFilters = Boolean(userId || dateFrom || dateTo);

  return (
    <fieldset className="mt-4 rounded-xl border border-slate-200 bg-[#F7F9FC] p-3 sm:p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
        Filtros de tickets
      </legend>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2 xl:col-span-1">
          <label htmlFor="ticket-user-filter" className="mb-1.5 block text-xs font-medium text-slate-600">
            Usuario que creó el ticket
          </label>
          <select
            id="ticket-user-filter"
            value={userId}
            onChange={(event) => onUserChange(event.target.value)}
            disabled={usersLoading}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002679] focus:ring-2 focus:ring-[#002679]/20 disabled:cursor-wait disabled:bg-slate-100"
          >
            <option value="">{usersLoading ? "Cargando usuarios..." : "Todos los usuarios"}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ticket-date-from" className="mb-1.5 block text-xs font-medium text-slate-600">
            Creado desde
          </label>
          <input
            id="ticket-date-from"
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(event) => onDateFromChange(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002679] focus:ring-2 focus:ring-[#002679]/20"
          />
        </div>
        <div>
          <label htmlFor="ticket-date-to" className="mb-1.5 block text-xs font-medium text-slate-600">
            Creado hasta
          </label>
          <input
            id="ticket-date-to"
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => onDateToChange(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002679] focus:ring-2 focus:ring-[#002679]/20"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            disabled={!hasFilters}
            onClick={onClear}
            className="min-h-11 rounded-lg px-3 text-sm font-medium text-[#002679] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002679] disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </fieldset>
  );
}
