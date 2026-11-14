import { validateApiBaseUrl } from "./src/config/api-base.ts";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), [
    "VITE_API_BASE_URL",
    "API_PROXY_TARGET",
  ]);
  const publicBase = validateApiBaseUrl(
    env.VITE_API_BASE_URL ?? "",
    mode === "production",
  );
  const target = env.API_PROXY_TARGET?.trim();
  if (target) {
    const url = new URL(target);
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !["http:", "https:"].includes(url.protocol)
    )
      throw new Error("Invalid API_PROXY_TARGET configuration.");
  }
  const proxy = target ? { "/api": { target, changeOrigin: true } } : undefined;
  return {
    // Explicitly expose only the public API base. Other VITE_* variables cannot leak into the bundle.
    envPrefix: [],
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(publicBase),
    },
    plugins: [react(), tailwindcss()],
    server: {
      proxy,
    },
    preview: {
      proxy,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});
