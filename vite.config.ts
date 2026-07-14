import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/My_Portfolio/", 
  plugins: [
    react(),
    tailwindcss(),
    tsConfigPaths()
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});