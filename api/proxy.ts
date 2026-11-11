import type { IncomingMessage, ServerResponse } from "node:http";

// Hosting adapter only: authentication and authorization remain in the backend.
// BACKEND_API_BASE_URL is server-only and is never defined in browser code.
export default async function proxy(
  req: IncomingMessage & {
    body?: unknown;
    query?: Record<string, string | string[]>;
  },
  res: ServerResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  const fail = (status: number, message: string) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message }));
  };
  try {
    const configured = process.env.BACKEND_API_BASE_URL?.trim();
    if (!configured) return fail(503, "API service is not configured.");
    const base = new URL(configured);
    if (
      base.protocol !== "https:" ||
      base.username ||
      base.password ||
      base.search ||
      base.hash
    )
      return fail(503, "API service is not configured.");
    const incoming = new URL(req.url ?? "/", "https://proxy.invalid");
    const paths = incoming.searchParams.getAll("path");
    const routePath = req.query?.path;
    const path =
      typeof routePath === "string"
        ? routePath
        : paths.length === 1
          ? paths[0]
          : incoming.pathname.startsWith("/api/")
            ? incoming.pathname.slice(5)
            : "";
    if (Array.isArray(routePath) || paths.length > 1)
      return fail(400, "Invalid API path.");
    if (
      !/^(?:auth|admin|platform-admin|health)(?:\/[a-zA-Z0-9-]+)*$/.test(path)
    )
      return fail(400, "Invalid API path.");
    if (!["GET", "POST", "PATCH", "HEAD", "OPTIONS"].includes(req.method ?? ""))
      return fail(405, "Method not allowed.");
    const destination = new URL(
      base.toString().replace(/\/+$/, "") + "/" + path,
    );
    incoming.searchParams.delete("path");
    destination.search = incoming.searchParams.toString();
    const headers = new Headers({ Accept: "application/json" });
    for (const name of ["content-type", "origin", "x-csrf-token"]) {
      const value = req.headers[name];
      if (typeof value === "string") headers.set(name, value);
    }
    const cookie = req.headers.cookie
      ?.split(";")
      .map((value) => value.trim())
      .find((value) => /^floraconnect_session=[a-f0-9]{64}$/.test(value));
    if (cookie) headers.set("cookie", cookie);
    let body: string | undefined;
    if (["POST", "PATCH"].includes(req.method ?? "")) {
      if (
        !String(req.headers["content-type"] ?? "")
          .toLowerCase()
          .startsWith("application/json")
      )
        return fail(415, "Send application/json.");
      if (req.body !== undefined) {
        body =
          typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      } else {
        const chunks: Buffer[] = [];
        let size = 0;
        for await (const chunk of req) {
          const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          size += bytes.length;
          if (size > 32768) return fail(413, "Request is too large.");
          chunks.push(bytes);
        }
        body = Buffer.concat(chunks).toString("utf8");
      }
      if (Buffer.byteLength(body ?? "") > 32768)
        return fail(413, "Request is too large.");
    }
    const response = await fetch(destination, {
      method: req.method,
      headers,
      body,
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    res.statusCode = response.status;
    for (const name of [
      "content-type",
      "retry-after",
      "x-frame-options",
      "content-security-policy",
    ]) {
      const value = response.headers.get(name);
      if (value) res.setHeader(name, value);
    }
    const cookies = response.headers.getSetCookie();
    if (cookies.length) res.setHeader("Set-Cookie", cookies);
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    // Do not reveal destination addresses, credentials, or upstream error details.
    fail(502, "Unable to reach the API service. Please try again shortly.");
  }
}
