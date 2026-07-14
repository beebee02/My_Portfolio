import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/My_Portfolio/", 
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});