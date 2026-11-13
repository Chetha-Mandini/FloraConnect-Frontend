import type { AuthUser } from "../../services/api/auth";

// Short-lived, memory-only handoff from a successful server login. No token or
// role is read from localStorage, URL parameters, or editable persisted state.
let recentLogin: { user: AuthUser; at: number } | null = null;
export function rememberLoginSession(user: AuthUser) {
  recentLogin = { user, at: Date.now() };
}
export function getLoginSession(): AuthUser | null {
  return recentLogin && Date.now() - recentLogin.at < 30_000
    ? recentLogin.user
    : null;
}
export function clearLoginSession() {
  recentLogin = null;
}
