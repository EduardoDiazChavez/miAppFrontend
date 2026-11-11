export type UserRole = "Cliente" | "Usuario" | "Supervisor" | "Administrador";

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
};
