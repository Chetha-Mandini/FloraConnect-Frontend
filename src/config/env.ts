export const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV
    ? "http://localhost:3001/api"
    : "https://flora-connect-backend-gules.vercel.app/api")
).replace(/\/+$/, "");
