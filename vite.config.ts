import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { defineConfig as defineViteConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// 1. If we are running inside GitHub Actions, use a clean static build config
const isGithubActions = !!process.env.GITHUB_ACTIONS;

export default isGithubActions
  ? defineViteConfig({
      base: "/My_Portfolio/", // Matches your GitHub repo name
      plugins: [
        tanstackStart({
          prerender: {
            routes: ["/"], // Compiles your landing pages into static files
          },
        }),
      ],
    })
  // 2. Otherwise, keep the default Lovable setup active so the sandbox preview doesn't break
  : defineLovableConfig({
      tanstackStart: {
        server: {
          entry: "server",
        },
      },
    });