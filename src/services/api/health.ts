import { apiEndpoints } from "../../config/api";
import { apiBaseUrl } from "../../config/env";

export async function checkApiHealth(signal: AbortSignal): Promise<void> {
  const response = await fetch(`${apiBaseUrl}${apiEndpoints.health}`, {
    signal,
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  const health: unknown = await response.json();
  if (
    !health ||
    typeof health !== "object" ||
    !("status" in health) ||
    health.status !== "ok" ||
    !("service" in health) ||
    health.service !== "FloraConnect API"
  ) {
    throw new Error("Unexpected health response");
  }
}
