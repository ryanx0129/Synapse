import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(rootDirectory, "src"),
      "@seed": path.resolve(rootDirectory, "seed"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["tests/e2e/**", "**/node_modules/**", "**/dist/**"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
