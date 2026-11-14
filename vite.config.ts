import { validateApiBaseUrl } from "./src/config/api-base.ts";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { execFileSync } from "node:child_process";

function gitValue(args: string[]) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

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
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "deployment-build-info",
        apply: "build",
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "build-info.json",
            source: JSON.stringify({
              commit:
                process.env.VERCEL_GIT_COMMIT_SHA ||
                gitValue(["rev-parse", "HEAD"]),
              branch:
                process.env.VERCEL_GIT_COMMIT_REF ||
                gitValue(["branch", "--show-current"]),
              builtAt: new Date().toISOString(),
            }),
          });
        },
      },
    ],
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
