import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: true, // Crucial if you test visibility classes like .hidden or no-print
  },
  define: {
    // Expose the version from package.json
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
