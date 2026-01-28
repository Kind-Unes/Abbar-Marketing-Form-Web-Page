import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use DEPLOY_TARGET=gh to build with GitHub Pages base
const base =
  process.env.DEPLOY_TARGET === "gh" ? "/abbartec-marketing-landingpage/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
});
