// scripts/optimize-vrm.mjs
// Optimize a VRM file (geometry + textures) while preserving VRMC_vrm and
// VRMC_materials_mtoon extension data — gltf-transform's own loader drops
// unknown extensions, so we read them from the source GLB binary, run the
// optimizer, then patch them back into the output GLB.
//
// Usage:
//   node scripts/optimize-vrm.mjs <input.vrm> <output.vrm>

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error("Usage: node scripts/optimize-vrm.mjs <input.vrm> <output.vrm>");
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

const outDir = dirname(output);
if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const GLB_MAGIC = 0x46546c67;     // 'glTF'
const CHUNK_JSON = 0x4e4f534a;    // 'JSON'

function readGlbJson(buf) {
  const magic = buf.readUInt32LE(0);
  if (magic !== GLB_MAGIC) throw new Error("Not a GLB file (magic mismatch)");
  const totalLen = buf.readUInt32LE(8);
  let off = 12;
  const jsonLen = buf.readUInt32LE(off); off += 4;
  const chunkType = buf.readUInt32LE(off); off += 4;
  if (chunkType !== CHUNK_JSON) throw new Error("First chunk is not JSON");
  const jsonStr = buf.subarray(off, off + jsonLen).toString("utf-8");
  return { json: JSON.parse(jsonStr), jsonOffset: off, jsonLen, totalLen };
}

function patchGlbJson(originalBuf, newJsonObj) {
  const { jsonOffset, jsonLen } = readGlbJson(originalBuf);
  let jsonStr = JSON.stringify(newJsonObj);
  // GLB JSON chunk must be aligned to 4-byte boundary; pad with spaces.
  while (jsonStr.length % 4 !== 0) jsonStr += " ";
  const newJsonBytes = Buffer.from(jsonStr, "utf-8");

  const binPortion = originalBuf.subarray(jsonOffset + jsonLen);
  const newTotalLen = 12 + 8 + newJsonBytes.length + binPortion.length;

  const out = Buffer.alloc(newTotalLen);
  out.writeUInt32LE(GLB_MAGIC, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(newTotalLen, 8);
  out.writeUInt32LE(newJsonBytes.length, 12);
  out.writeUInt32LE(CHUNK_JSON, 16);
  newJsonBytes.copy(out, 20);
  binPortion.copy(out, 20 + newJsonBytes.length);
  return out;
}

// 1. Extract VRMC extensions from source
console.log(`→ Reading source: ${input}`);
const sourceBuf = readFileSync(input);
const { json: sourceJson } = readGlbJson(sourceBuf);

const VRMC_KEYS = [
  "VRMC_vrm",
  "VRMC_materials_mtoon",
  "VRMC_springBone",
  "VRMC_node_constraint",
  "VRMC_vrm_animation",
];
const preserved = {};
for (const key of VRMC_KEYS) {
  if (sourceJson.extensions?.[key]) {
    preserved[key] = sourceJson.extensions[key];
    console.log(`  • Found ${key}`);
  }
}
if (Object.keys(preserved).length === 0) {
  console.warn("  ! No VRMC extensions found in source — output will not be a VRM");
}

// 2. Write source as .glb so gltf-transform recognises it
const tmpSource = `${output}.src.glb`;
const tmpOpt = `${output}.opt.glb`;
writeFileSync(tmpSource, sourceBuf);

console.log(`→ Optimizing geometry + textures (Meshopt, 512px textures, 0.5 simplify)`);
try {
  execSync(
    `npx gltf-transform optimize "${tmpSource}" "${tmpOpt}" ` +
      `--compress meshopt --texture-compress webp --texture-size 512 ` +
      `--simplify-ratio 0.5 --flatten false --join false --palette false --prune false`,
    { stdio: "inherit" }
  );
} catch (e) {
  unlinkSync(tmpSource);
  throw e;
}

// 3. Re-inject VRMC extensions
console.log(`→ Re-injecting VRMC extensions`);
const optBuf = readFileSync(tmpOpt);
const { json: optJson } = readGlbJson(optBuf);
optJson.extensions = optJson.extensions || {};
optJson.extensionsUsed = optJson.extensionsUsed || [];
for (const [key, data] of Object.entries(preserved)) {
  optJson.extensions[key] = data;
  if (!optJson.extensionsUsed.includes(key)) optJson.extensionsUsed.push(key);
}
const patched = patchGlbJson(optBuf, optJson);
writeFileSync(output, patched);

// 4. Cleanup
unlinkSync(tmpSource);
unlinkSync(tmpOpt);

const finalKB = Math.round(patched.length / 1024);
console.log(`\nDone: ${output} (${finalKB} KB)`);
console.log(`Preserved extensions: ${Object.keys(preserved).join(", ") || "(none)"}`);
