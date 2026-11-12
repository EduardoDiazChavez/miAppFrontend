import type { SessionUser, UserRole } from "../types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const roleMap: Record<string, UserRole> = {
  CLIENT: "Cliente",
  OPERATOR: "Usuario",
  SUPERVISOR: "Supervisor",
  ADMIN: "Administrador",
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que la API esté iniciada.",
      0,
    );
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : "La solicitud no pudo completarse.";
    const details =
      body && typeof body === "object" && "details" in body ? body.details : undefined;
    throw new ApiError(message, response.status, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type ApiUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
};

export function toSessionUser(user: ApiUser): SessionUser {
  const role = roleMap[user.role];
  if (!role) {
    throw new ApiError("El servidor devolvió un rol que no es compatible.", 500);
  }

  return {
    name: user.name,
    email: user.email,
    role,
    ...(user.organizationId ? { organizationId: user.organizationId } : {}),
  };
}

export function getHomeForRole(role: UserRole) {
  return role === "Cliente" ? "/cliente" : "/dashboard";
}

export function notifySessionChanged() {
  window.dispatchEvent(new Event("miapp:session-changed"));
}
