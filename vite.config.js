import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// `base` MUST match the GitHub Pages subpath ("/middle-earth-wiki/").
// If you ever rename the repo, update this string.
export default defineConfig({
  base: "/middle-earth-wiki/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false
  }
});
