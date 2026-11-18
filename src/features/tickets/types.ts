import type { UserRole } from "@/src/features/auth/types";

export type TicketStatus =
  | "Abierto"
  | "En revisión"
  | "Pendiente cierre"
  | "Cerrado";

export type TicketRecord = {
  id: string;
  cliente: string;
  creador?: string;
  proceso: string;
  fechaCreacion?: string;
  abierto: string;
  cierre: string;
  estado: TicketStatus;
  responsable: string;
  descripcion: string;
  horaApertura: string;
  horaCierre?: string;
};

export type UserRecord = {
  nombre: string;
  email: string;
  rol: UserRole;
  area: string;
  estado: "Activo" | "Inactivo";
  tickets: number;
};