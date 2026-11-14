import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import proxy from "../../../api/proxy";

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("BACKEND_API_BASE_URL", "https://private-api.example.test/api");
  vi.stubEnv("VITE_API_URL", "");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
async function call(path = "auth/me", method = "GET", body?: unknown) {
  const req = Object.assign(Readable.from([]), {
    url: `/api/proxy?path=${encodeURIComponent(path)}`,
    method,
    headers: {
      cookie:
        "floraconnect_session=" +
        "a".repeat(64) +
        "; unrelated_cookie=private-value",
      origin: "https://frontend.example.test",
      "x-csrf-token": "csrf-test",
      "content-type": "application/json",
    },
    body,
  });
  const res = { statusCode: 200, setHeader: vi.fn(), end: vi.fn() };
  await proxy(
    req as unknown as IncomingMessage,
    res as unknown as ServerResponse,
  );
  return res;
}
describe("Environment configured same-origin API proxy", () => {
  it("forwards session, origin and CSRF headers to only the configured backend", async () => {
    fetchMock.mockResolvedValue(
      new Response("{}", {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie":
            "floraconnect_session=test; HttpOnly; Secure; SameSite=Lax",
        },
      }),
    );
    const res = await call("auth/login", "POST", {
      email: "user@example.test",
      password: "test-password",
    });
    const [destination, options] = fetchMock.mock.calls[0];
    expect(destination.toString()).toBe(
      "https://private-api.example.test/api/auth/login",
    );
    expect(options.headers.get("origin")).toBe("https://frontend.example.test");
    expect(options.headers.get("x-csrf-token")).toBe("csrf-test");
    expect(options.headers.get("cookie")).toContain("floraconnect_session=");
    expect(options.headers.get("cookie")).not.toContain("unrelated_cookie");
    expect(options.redirect).toBe("error");
    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      expect.stringContaining("HttpOnly"),
    ]);
  });
  it("accepts rewritten query metadata while retaining only API paths", async () => {
    fetchMock.mockResolvedValue(new Response("{}"));
    const req = Object.assign(Readable.from([]), {
      url: "/api/auth/me",
      method: "GET",
      headers: {},
      query: { path: "auth/me" },
    });
    const res = { statusCode: 200, setHeader: vi.fn(), end: vi.fn() };
    await proxy(
      req as unknown as IncomingMessage,
      res as unknown as ServerResponse,
    );
    expect(fetchMock.mock.calls[0][0].toString()).toBe(
      "https://private-api.example.test/api/auth/me",
    );
  });
  it.each([
    "../.env",
    "https://evil.example",
    "//evil.example",
    "auth/../admin",
    "auth/me?token=bad",
  ])("refuses arbitrary destinations and paths %s", async (path) => {
    expect((await call(path)).statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("fails closed without backend configuration", async () => {
    vi.stubEnv("BACKEND_API_BASE_URL", "");
    expect((await call()).statusCode).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([
    "https://legacy-api.example.test",
    "https://legacy-api.example.test/api",
    "https://legacy-api.example.test/api/",
  ])("supports the existing VITE_API_URL setting: %s", async (configured) => {
    vi.stubEnv("BACKEND_API_BASE_URL", "");
    vi.stubEnv("VITE_API_URL", configured);
    fetchMock.mockResolvedValue(new Response("{}"));
    expect((await call()).statusCode).toBe(200);
    expect(fetchMock.mock.calls[0][0].toString()).toBe(
      "https://legacy-api.example.test/api/auth/me",
    );
  });
  it("prefers the private upstream setting over the legacy setting", async () => {
    vi.stubEnv("VITE_API_URL", "https://legacy-api.example.test/api");
    fetchMock.mockResolvedValue(new Response("{}"));
    await call();
    expect(fetchMock.mock.calls[0][0].toString()).toBe(
      "https://private-api.example.test/api/auth/me",
    );
  });
  it.each([
    "/api",
    "http://legacy-api.example.test/api",
    "https://user:secret@legacy-api.example.test/api",
    "https://legacy-api.example.test/api?token=secret",
    "https://legacy-api.example.test/api#secret",
  ])(
    "does not bypass upstream validation for legacy configuration %s",
    async (configured) => {
      vi.stubEnv("BACKEND_API_BASE_URL", "");
      vi.stubEnv("VITE_API_URL", configured);
      expect((await call()).statusCode).toBe(503);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("does not mask an invalid preferred setting with the legacy fallback", async () => {
    vi.stubEnv("BACKEND_API_BASE_URL", "http://insecure.example.test/api");
    vi.stubEnv("VITE_API_URL", "https://legacy-api.example.test/api");
    expect((await call()).statusCode).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects embedded backend credentials without revealing them", async () => {
    vi.stubEnv(
      "BACKEND_API_BASE_URL",
      "https://user:secret@private-api.example.test/api",
    );
    const res = await call();
    expect(res.statusCode).toBe(503);
    expect(JSON.stringify(res.end.mock.calls)).not.toContain("secret");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("limits mutation bodies before contacting the backend", async () => {
    expect(
      (await call("auth/register", "POST", { name: "a".repeat(33000) }))
        .statusCode,
    ).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("returns safe upstream failures", async () => {
    fetchMock.mockRejectedValue(
      new Error("private-api.example.test private detail"),
    );
    const res = await call();
    expect(res.statusCode).toBe(502);
    expect(JSON.stringify(res.end.mock.calls)).not.toContain("private-api");
  });
});
