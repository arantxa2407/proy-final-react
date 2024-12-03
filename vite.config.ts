import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8081", // URL de tu backend
        changeOrigin: true,
        secure: false,
      },
      "/authenticate": {
        target: "http://localhost:8081", // Endpoint de autenticación
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
