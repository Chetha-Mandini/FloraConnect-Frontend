import { describe, expect, it } from "vitest";
import { validateApiBaseUrl } from "./api-base";
import { apiEndpoints } from "./api";

describe("Public API configuration", () => {
  it("supports relative paths and explicitly configured HTTPS hosts", () => {
    expect(validateApiBaseUrl("/api/", true)).toBe("/api");
    expect(validateApiBaseUrl("https://api.example.test/api/", true)).toBe(
      "https://api.example.test/api",
    );
    expect(validateApiBaseUrl("http://localhost:3001/api", false)).toBe(
      "http://localhost:3001/api",
    );
  });
  it.each([
    "//evil.example/api",
    "javascript:alert(1)",
    "https://user:secret@example.test/api",
    "https://example.test/api?token=secret",
    "https://example.test/api#secret",
    "http://example.test/api",
    "http://localhost:3001/api",
  ])("rejects unsafe production API bases %s", (value) => {
    expect(() => validateApiBaseUrl(value, true)).toThrow();
  });
  it("rejects malformed identifiers and unsupported resource paths", () => {
    expect(() => apiEndpoints.admin.userStatus("../users")).toThrow();
    expect(() => apiEndpoints.admin.records("../secrets")).toThrow();
    expect(
      apiEndpoints.admin.userStatus("10c45050-d898-4b52-935f-bfa5b991d391"),
    ).toBe("/admin/users/10c45050-d898-4b52-935f-bfa5b991d391/status");
  });
});
