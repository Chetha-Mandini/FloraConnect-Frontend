import { apiEndpoints } from "../../config/api";
import { apiBaseUrl } from "../../config/env";
import { clearLoginSession } from "../../features/auth/login-session";

export type Role =
  | "SUPER_ADMIN"
  | "PLATFORM_ADMIN"
  | "ORGANIZATION_ADMIN"
  | "ORGANIZATION_MEMBER"
  | "FLORIST"
  | "GROWER"
  | "USER";
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  emailVerified: boolean;
  mustChangePassword: boolean;
  accountType: string;
  phone?: string;
  address?: string;
}
export interface AuthSession {
  user: AuthUser;
  csrfToken: string;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
let csrfToken = "";
export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
      credentials: "include",
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal
        ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)])
        : AbortSignal.timeout(15000),
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError(
      "Unable to reach FloraConnect. Please try again shortly.",
      0,
    );
  }
  const data =
    response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) clearLoginSession();
    throw new ApiError(
      data?.message ?? "The request could not be completed. Please try again.",
      response.status,
    );
  }
  if (path === apiEndpoints.auth.password || path === apiEndpoints.auth.logout)
    clearLoginSession();
  if (data?.csrfToken) csrfToken = data.csrfToken;
  return data as T;
}
export const destinationFor = (role: Role) =>
  role === "SUPER_ADMIN"
    ? "/admin"
    : role === "PLATFORM_ADMIN"
      ? "/platform-admin"
      : "/account";
export async function logout() {
  await api(apiEndpoints.auth.logout, { method: "POST", body: {} });
  clearLoginSession();
  csrfToken = "";
}
