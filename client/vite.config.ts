import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = process.env as NodeJS.ProcessEnv & { VITE_DEV_HOST?: string };

  console.log(
    `Mode: ${mode}, VITE_DEV_HOST: ${env.VITE_DEV_HOST || "localhost"}`
  );

  return {
    plugins: [react()],
    server: {
      host: env.VITE_DEV_HOST || "localhost",
      port: 5173,
      proxy: {
        "/api/v1": {
          target: "http://blabla-server:8000",
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
