import { apiRequest } from "@/src/features/auth/lib/api-client";
import type { TicketRecord, TicketStatus } from "@/src/features/dashboard/data/mockData";

export type ApiTicket = {
  _id: string;
  code: string;
  organizationId: string | { name?: string };
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";
  assignedTo?: { name?: string } | string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
};

export type OpenTicket = {
  code: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING";
};

const statusLabels: Record<ApiTicket["status"], TicketStatus> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En revisión",
  WAITING: "Pendiente cierre",
  CLOSED: "Cerrado",
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("es", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toTicketRecord(ticket: ApiTicket): TicketRecord {
  const openedAt = formatTime(ticket.createdAt);
  const organizationName =
    ticket.organizationId && typeof ticket.organizationId === "object"
      ? ticket.organizationId.name ?? "—"
      : "—";
  return {
    id: ticket.code,
    cliente: organizationName,
    proceso: ticket.title,
    abierto: openedAt,
    cierre: ticket.closedAt ? formatTime(ticket.closedAt) : "—",
    estado: statusLabels[ticket.status],
    responsable:
      ticket.assignedTo && typeof ticket.assignedTo === "object"
        ? ticket.assignedTo.name ?? "Sin asignar"
        : "Sin asignar",
    descripcion: ticket.description,
    horaApertura: openedAt,
    ...(ticket.closedAt ? { horaCierre: formatTime(ticket.closedAt) } : {}),
  };
}

export async function listTickets(options: { status?: string; page?: number; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (options.status) params.set("status", options.status);
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  const suffix = params.size > 0 ? `?${params.toString()}` : "";
  const result = await apiRequest<{ tickets: ApiTicket[]; page: number; limit: number; total: number }>(
    `/tickets${suffix}`,
  );
  return { ...result, tickets: result.tickets.map(toTicketRecord) };
}

export async function listOrganizations() {
  return apiRequest<{ organizations: Array<{ id: string; name: string; code?: string }> }>("/tickets/organizations");
}

export function getNextTicketSequence(organizationId: string) {
  const params = new URLSearchParams({ organizationId });
  return apiRequest<{ nextSequence: number; openTicket: OpenTicket | null }>(
    `/tickets/next-sequence?${params.toString()}`,
  );
}

export function getTicket(ticketId: string) {
  return apiRequest<{ ticket: ApiTicket; messages: ApiTicketMessage[] }>(
    `/tickets/${encodeURIComponent(ticketId)}`,
  );
}

export type ApiTicketMessage = {
  _id: string;
  authorName: string;
  authorRole: "CLIENT" | "TEAM";
  content: string;
  createdAt: string;
};

export function toTicketMessages(messages: ApiTicketMessage[]) {
  return messages.map((message) => ({
    id: message._id,
    author: message.authorName,
    role: message.authorRole === "CLIENT" ? ("Cliente" as const) : ("Equipo" as const),
    content: message.content,
    createdAt: new Date(message.createdAt).toLocaleString("es", {
      dateStyle: "short",
      timeStyle: "short",
    }),
  }));
}
