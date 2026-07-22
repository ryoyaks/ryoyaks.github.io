import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

// GitHub Pages 沒有伺服器端 rewrite。對未知路徑它會回傳 404.html，
// 只要那份檔案就是 SPA 入口，React Router 就能接手 location.pathname。
const dist = resolve(process.cwd(), "dist");
const index = resolve(dist, "index.html");

if (!existsSync(index)) {
  console.error("postbuild: dist/index.html not found — did vite build run?");
  process.exit(1);
}

copyFileSync(index, resolve(dist, "404.html"));
console.log("postbuild: wrote dist/404.html (SPA fallback for GitHub Pages)");
