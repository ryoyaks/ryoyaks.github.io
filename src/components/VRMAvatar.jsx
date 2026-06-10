import { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer } from "three";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
} from "@pixiv/three-vrm-animation";

/**
 * Static VRM renderer (no animation). Loads the .vrm once.
 */
const StaticVRM = ({ url, scale, position, rotation }) => {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });
  const vrm = gltf?.userData?.vrm;

  useEffect(() => {
    if (!vrm) return;
    VRMUtils.rotateVRM0(vrm);
    VRMUtils.removeUnnecessaryVertices(vrm.scene);
    VRMUtils.removeUnnecessaryJoints(vrm.scene);
  }, [vrm]);

  useFrame((_, delta) => {
    if (vrm) vrm.update(delta);
  });

  if (!vrm) return null;
  return <primitive object={vrm.scene} scale={scale} position={position} rotation={rotation} />;
};

/**
 * VRM renderer with VRMA animation loaded from a separate URL.
 */
const AnimatedVRM = ({ url, animationUrl, scale, position, rotation }) => {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });
  const vrm = gltf?.userData?.vrm;

  const vrma = useLoader(GLTFLoader, animationUrl, (loader) => {
    loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
  });
  const vrmAnim = vrma?.userData?.vrmAnimations?.[0] || null;

  const mixerRef = useRef(null);

  useEffect(() => {
    if (!vrm) return;
    VRMUtils.rotateVRM0(vrm);
    VRMUtils.removeUnnecessaryVertices(vrm.scene);
    VRMUtils.removeUnnecessaryJoints(vrm.scene);
  }, [vrm]);

  useEffect(() => {
    if (!vrm || !vrmAnim) return;
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
  return <primitive object={vrm.scene} scale={scale} position={position} rotation={rotation} />;
};

/**
 * Top-level VRM avatar. Dispatches to a static or animated renderer so the
 * .vrm file isn't loaded twice when no VRMA is provided.
 *
 * Props:
 *  - url             (required)  Path to the .vrm file
 *  - animationUrl    (optional)  Path to a .vrma file
 *  - scale, position, rotation   Standard primitive transform
 */
const VRMAvatar = ({
  url,
  animationUrl = null,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  return animationUrl ? (
    <AnimatedVRM
      url={url}
      animationUrl={animationUrl}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  ) : (
    <StaticVRM url={url} scale={scale} position={position} rotation={rotation} />
  );
};

export default VRMAvatar;
