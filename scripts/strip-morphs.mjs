import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const [, , inPath, outPath] = process.argv;
const doc = await io.read(inPath);

let stripped = 0;
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const targets = prim.listTargets();
    if (targets.length === 0) continue;
    stripped += targets.length;
    for (const t of targets) prim.removeTarget(t);
  }
}
console.log(`Stripped ${stripped} morph targets across all primitives`);

await io.write(outPath, doc);
