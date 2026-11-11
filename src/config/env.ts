import { validateApiBaseUrl } from "./api-base";
// This value is public. Database credentials and delivery tokens belong only in the backend.
export const apiBaseUrl = validateApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? "",
  import.meta.env.PROD,
);
