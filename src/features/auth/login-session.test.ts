import { describe, expect, it, vi, afterEach } from "vitest";
import {
  getLoginSession,
  rememberLoginSession,
  clearLoginSession,
} from "./login-session";
import type { AuthUser } from "../../services/api/auth";

afterEach(() => {
  vi.useRealTimers();
  clearLoginSession();
});
describe("Server login handoff", () => {
  it("expires rather than treating cached roles as permanent authorization", () => {
    vi.useFakeTimers();
    rememberLoginSession({ name: "Admin", role: "SUPER_ADMIN" } as AuthUser);
    expect(getLoginSession()?.role).toBe("SUPER_ADMIN");
    vi.advanceTimersByTime(30_000);
    expect(getLoginSession()).toBeNull();
  });
  it("clears the handoff when the account is signed out", () => {
    rememberLoginSession({ name: "Admin" } as AuthUser);
    clearLoginSession();
    expect(getLoginSession()).toBeNull();
  });
});
