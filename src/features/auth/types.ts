export type UserRole = "Cliente" | "Asesor" | "Admin" | "Super admin";

export const adminUserRoles: UserRole[] = ["Admin", "Super admin"];
export const internalUserRoles: UserRole[] = ["Asesor", ...adminUserRoles];

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
};
