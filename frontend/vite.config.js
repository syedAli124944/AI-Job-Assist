import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // required so the dev server is reachable from inside Docker
    port: 5173,
  },
});
