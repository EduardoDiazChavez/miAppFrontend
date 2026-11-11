import type { UserRole } from "@/src/features/auth/types";

export type TicketStatus = "Abierto" | "En revisión" | "Pendiente cierre" | "Cerrado";
export type TicketPriority = "Baja" | "Media" | "Alta" | "Crítica";
export type { UserRole } from "@/src/features/auth/types";

export type TicketRecord = {
  id: string;
  cliente: string;
  area: string;
  actividad: string;
  abierto: string;
  cierre: string;
  estado: TicketStatus;
  prioridad: TicketPriority;
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

export const tickets: TicketRecord[] = [
  {
    id: "TK-1048",
    cliente: "Banco Norte",
    area: "Soporte técnico",
    actividad: "Revisión de incidentes en correo corporativo",
    abierto: "08:30",
    cierre: "10:15",
    estado: "Pendiente cierre",
    prioridad: "Alta",
    responsable: "Ana Ureña",
    descripcion:
      "Se reportó un incidente de acceso y sincronización del buzón corporativo. Se verificó el problema y se inició la revisión del servicio con seguimiento del usuario.",
    horaApertura: "08:30",
    horaCierre: "10:15",
  },
  {
    id: "TK-1049",
    cliente: "Alegra Logística",
    area: "Infraestructura",
    actividad: "Ajuste de acceso y sincronización de usuarios",
    abierto: "09:05",
    cierre: "11:40",
    estado: "En revisión",
    prioridad: "Media",
    responsable: "Marcelo Ruiz",
    descripcion:
      "Se revisó la configuración del acceso para varios usuarios. Se necesita validar el cambio final y confirmar la sincronización de permisos.",
    horaApertura: "09:05",
    horaCierre: "11:40",
  },
  {
    id: "TK-1052",
    cliente: "Mundial Textiles",
    area: "Operaciones",
    actividad: "Validación de reportes de horas de atención",
    abierto: "10:50",
    cierre: "12:15",
    estado: "Abierto",
    prioridad: "Baja",
    responsable: "Laura Gómez",
    descripcion:
      "Se validó la información de horas y se requiere confirmar la conciliación de registros de atención del personal asignado.",
    horaApertura: "10:50",
    horaCierre: "12:15",
  },
  {
    id: "TK-1055",
    cliente: "Grupo Solis",
    area: "Atención al cliente",
    actividad: "Seguimiento final de correo con cierre de servicio",
    abierto: "07:40",
    cierre: "09:10",
    estado: "Cerrado",
    prioridad: "Media",
    responsable: "Sofía Díaz",
    descripcion:
      "Se cerró el servicio con la confirmación del cliente y el registro final de la solución entregada.",
    horaApertura: "07:40",
    horaCierre: "09:10",
  },
];

export const users: UserRecord[] = [
  { nombre: "Ana Ureña", email: "ana@empresa.com", rol: "Supervisor", area: "Soporte", estado: "Activo", tickets: 9 },
  { nombre: "Marcelo Ruiz", email: "marcelo@empresa.com", rol: "Usuario", area: "Infraestructura", estado: "Activo", tickets: 7 },
  { nombre: "Laura Gómez", email: "laura@empresa.com", rol: "Usuario", area: "Operaciones", estado: "Activo", tickets: 5 },
  { nombre: "Sofía Díaz", email: "sofia@empresa.com", rol: "Administrador", area: "Administración", estado: "Activo", tickets: 12 },
  { nombre: "Javier León", email: "javier@empresa.com", rol: "Usuario", area: "Atención", estado: "Inactivo", tickets: 2 },
  { nombre: "María Gómez", email: "maria@banconorte.com", rol: "Cliente", area: "Banco Norte", estado: "Activo", tickets: 1 },
];

export const clientStats = [
  { nombre: "Banco Norte", horas: "32h", tickets: 5, cambio: "+8%" },
  { nombre: "Alegra Logística", horas: "24h", tickets: 4, cambio: "+5%" },
  { nombre: "Mundial Textiles", horas: "18h", tickets: 3, cambio: "-2%" },
  { nombre: "Grupo Solis", horas: "14h", tickets: 2, cambio: "+10%" },
];

export const dashboardStats = [
  { label: "Tickets activos", value: "24", change: "+12% vs mes anterior", tone: "purple" as const },
  { label: "Horas reportadas", value: "142h", change: "+10h este mes", tone: "sky" as const },
  { label: "Clientes con actividad", value: "18", change: "+3 nuevos", tone: "emerald" as const },
  { label: "Tickets cerrados", value: "16", change: "94% cumplimiento", tone: "amber" as const },
];
