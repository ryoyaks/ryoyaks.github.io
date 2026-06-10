import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";

const ROOTS = ["public/images", "public/images/icon"];

async function convertDir(dir) {
  const entries = await readdir(dir);
  for (const name of entries) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) continue;
    if (extname(name).toLowerCase() !== ".png") continue;
    const out = join(dir, basename(name, ".png") + ".webp");
    await sharp(p).webp({ quality: 80 }).toFile(out);
    const outS = await stat(out);
    console.log(`${p} ${(s.size / 1024).toFixed(1)}KB -> ${out} ${(outS.size / 1024).toFixed(1)}KB`);
  }
}

for (const root of ROOTS) await convertDir(root);
