export function validateApiBaseUrl(value: string, production: boolean): string {
  const base = value.trim().replace(/\/+$/, "") || "/api";
  if (/^\/(?!\/)[a-zA-Z0-9/_-]+$/.test(base)) return base;
  try {
    const url = new URL(base);
    if (url.username || url.password || url.search || url.hash)
      throw new Error();
    if (
      url.protocol !== "https:" &&
      !(
        url.protocol === "http:" &&
        !production &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
      )
    )
      throw new Error();
    return url.toString().replace(/\/+$/, "");
  } catch {
    throw new Error(
      "Configure a relative API path or an HTTPS VITE_API_BASE_URL without credentials or query parameters.",
    );
  }
}
