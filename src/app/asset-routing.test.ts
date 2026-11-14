import { describe, expect, it } from "vitest";
import deployment from "../../vercel.json";

describe("SPA deployment routing", () => {
  const fallback = deployment.rewrites.find(
    (rule) => rule.destination === "/index.html",
  )!;
  const matches = new RegExp(`^${fallback.source}$`);
  it.each(["/admin", "/admin/users", "/login", "/register", "/flowers", "/"])(
    "serves the SPA for %s",
    (path) => {
      expect(matches.test(path)).toBe(true);
    },
  );
  it.each([
    "/api/auth/me",
    "/api",
    "/assets/outdated.js",
    "/assets",
    "/startup.js",
    "/images/missing.png",
    "/fonts/missing.woff2",
  ])("does not turn missing API/static resources into HTML: %s", (path) => {
    expect(matches.test(path)).toBe(false);
  });
});
