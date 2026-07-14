import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  // This tells Vite to handle the subfolder path on your github.io URL
  base: process.env.GITHUB_ACTIONS ? "/My_Portfolio/" : "/",
  vite: {
    plugins: [
      // This forces the app to build as a static, serverless SPA for GitHub Pages
      nitro({
        preset: "github-pages",
        prerender: {
          routes: ["/"],
        },
      }),
    ],
  },
});