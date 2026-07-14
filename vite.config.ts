import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // This tells Nitro to build for Vercel when deploying, but keeps local preview working!
  nitro: process.env.VERCEL ? true : false, 
  tanstackStart: {
    server: { entry: "server" },
  },
});