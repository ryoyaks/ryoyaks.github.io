import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const dist = resolve(process.cwd(), "dist");
const problems = [];

const indexPath = resolve(dist, "index.html");
const notFoundPath = resolve(dist, "404.html");

if (!existsSync(indexPath)) problems.push("dist/index.html is missing");
if (!existsSync(notFoundPath)) problems.push("dist/404.html is missing");

if (problems.length === 0) {
  const index = readFileSync(indexPath, "utf8");
  const notFound = readFileSync(notFoundPath, "utf8");

  if (index !== notFound) {
    problems.push("dist/404.html differs from dist/index.html");
  }
  if (/(?:src|href)="\.\//.test(index)) {
    problems.push('index.html uses relative asset paths ("./") — vite base must be "/"');
  }
  if (!/(?:src|href)="\/assets\//.test(index)) {
    problems.push("index.html has no absolute /assets/ reference");
  }
}

if (problems.length > 0) {
  for (const p of problems) console.error(`check-build: ${p}`);
  process.exit(1);
}

console.log("check-build: OK");
