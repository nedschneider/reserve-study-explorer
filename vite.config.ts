import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// For GitHub Pages project sites, set base to "/<repo-name>/".
// When deploying to a custom domain or user.github.io root, set base to "/".
const repoName = "reserve-study-explorer";

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
