import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@/styles/common/_variables.scss";
    `,
      },
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") },
      { find: "@root", replacement: resolve(__dirname, "../") },
    ],
  },
  plugins: [vue()],
  server: {
    port: 7999,
    host: "0.0.0.0",
    proxy: {
      "/api/geoserver": {
        target: "http://119.96.101.77:8081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/arcgis": {
        target: "http://202.99.220.101:18399",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, ""),
      },
    },
  },
});
