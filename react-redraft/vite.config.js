// /vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  base: "/ff/react-redraft/",        // <-- your GH Pages base
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index:  resolve(__dirname, "index.html"),  // main site
        weekly: resolve(__dirname, "weekly.html"), // weekly site
      },
    },
  },
});
