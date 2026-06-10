import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer } from "three";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
} from "@pixiv/three-vrm-animation";

/**
 * Loads a VRM file (.vrm or .glb with VRMC_vrm) and renders the humanoid
 * scene. Optionally loads a .vrma animation and plays it on loop.
 *
 * Props:
 *  - url            (required)  Path to the .vrm file.
 *  - animationUrl   (optional)  Path to a .vrma file. When provided, the
 *                               animation is bound to the VRM humanoid and
 *                               played in a loop.
 *  - scale, position, rotation  Standard primitive transform.
 */
const VRMAvatar = ({
  url,
  animationUrl = null,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });
  const vrm = gltf?.userData?.vrm;

  const vrma = useLoader(
    GLTFLoader,
    animationUrl || url,
    (loader) => {
      loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
    }
  );
  const vrmAnim =
    animationUrl && vrma?.userData?.vrmAnimations?.[0]
      ? vrma.userData.vrmAnimations[0]
      : null;

  const mixerRef = useRef(null);

  useEffect(() => {
    if (!vrm) return;
    VRMUtils.rotateVRM0(vrm);
    VRMUtils.removeUnnecessaryVertices(vrm.scene);
    VRMUtils.removeUnnecessaryJoints(vrm.scene);
  }, [vrm]);

  useEffect(() => {
    if (!vrm || !vrmAnim) {
      mixerRef.current = null;
      return;
    }
    const mixer = new AnimationMixer(vrm.scene);
    const clip = createVRMAnimationClip(vrmAnim, vrm);
    mixer.clipAction(clip).play();
    mixerRef.current = mixer;
    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [vrm, vrmAnim]);

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
    if (vrm) vrm.update(delta);
  });

  if (!vrm) return null;
  return (
    <primitive object={vrm.scene} scale={scale} position={position} rotation={rotation} />
  );
};

export default VRMAvatar;
