import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 本站部署在網域根目錄（user site）。"./" 是給子路徑部署用的，
  // 在巢狀路由下會把 /assets 解析成 /projects/assets 而載入失敗。
  base: "/",
  build: {
    assetsInlineLimit: 0, // 確保大檔案不會被轉成 base64 導致崩潰
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: false,
  },
});