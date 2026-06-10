// scripts/encode-video.mjs
// Encode a source MP4 from _local_asset/ (or anywhere) into a web-friendly
// WebM (VP9, 720p, no audio, ≤ ~5 MB) plus a WebP poster frame.
//
// Usage:
//   node scripts/encode-video.mjs <input> <output-basename-no-ext>
//
// Example (for SyncRig demo video):
//   node scripts/encode-video.mjs "_local_asset/syncRig demo.mp4" public/media/syncrig/demo
//
// Produces:
//   public/media/syncrig/demo.webm
//   public/media/syncrig/demo-poster.webp
//
// Requires `ffmpeg` on PATH.

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [, , input, outputBase] = process.argv;

if (!input || !outputBase) {
  console.error(
    "Usage: node scripts/encode-video.mjs <input> <output-basename-no-ext>\n" +
      'Example: node scripts/encode-video.mjs "_local_asset/foo.mp4" public/media/syncrig/foo'
  );
  process.exit(1);
}

if (!existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

const outDir = dirname(outputBase);
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const webm = `${outputBase}.webm`;
const poster = `${outputBase}-poster.webp`;

console.log(`→ Encoding WebM: ${webm}`);
execSync(
  `ffmpeg -y -i "${input}" -an -c:v libvpx-vp9 -b:v 0 -crf 35 -vf "scale=-2:720" "${webm}"`,
  { stdio: "inherit" }
);

console.log(`→ Extracting poster: ${poster}`);
execSync(
  `ffmpeg -y -ss 00:00:01 -i "${input}" -frames:v 1 -vf "scale=-2:720" "${poster}"`,
  { stdio: "inherit" }
);

console.log("\nDone. Reference these paths in your content JSON:");
console.log(`  poster: ${webm.replace(/^public/, "")}`);
console.log(`  video:  ${webm.replace(/^public/, "")}`);
console.log(`  (replace 'public/' prefix in the JSON, it gets served from /)`);
