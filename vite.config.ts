import { resolve } from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [reactRefresh()],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  build: {
    rollupOptions: {
      input: {
        history: resolve(__dirname, "pages/history/index.html"),
        navigation: resolve(__dirname, "pages/navigation/index.html"),
        search: resolve(__dirname, "pages/search/index.html"),
        settings: resolve(__dirname, "pages/settings/index.html"),
        start: resolve(__dirname, "pages/start/index.html"),
        welcome: resolve(__dirname, "pages/welcome/index.html"),
        searchDialog: resolve(__dirname, "dialogs/search/index.html"),
      },
      output: {
        dir: "dist",
      },
    },
  },
});
