import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva, useControls } from "leva";
import { Model } from "./models/6YAbeta1";

const isDebug =
  import.meta.env.DEV ||
  (typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1");

const HeroExperience = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Defaults match the static config we'd ship without leva.
  const defaults = isMobile
    ? { scale: 6.5, posX: 0, posY: -7, posZ: 0, rotY: 0 }
    : { scale: 9, posX: 2, posY: -9.5, posZ: 0, rotY: -0.5 };

  const avatar = useControls(
    "Avatar",
    {
      scale: { value: defaults.scale, min: 1, max: 20, step: 0.1 },
      posX: { value: defaults.posX, min: -10, max: 10, step: 0.1 },
      posY: { value: defaults.posY, min: -20, max: 5, step: 0.1 },
      posZ: { value: defaults.posZ, min: -10, max: 10, step: 0.1 },
      rotY: { value: defaults.rotY, min: -Math.PI, max: Math.PI, step: 0.05 },
    },
    { collapsed: true }
  );

  const camera = useControls(
    "Camera",
    {
      camX: { value: 0, min: -10, max: 10, step: 0.1 },
      camY: { value: 0, min: -10, max: 10, step: 0.1 },
      camZ: { value: 5, min: 1, max: 20, step: 0.1 },
      fov: { value: 50, min: 20, max: 90, step: 1 },
      orbit: { value: false, label: "Drag to orbit" },
    },
    { collapsed: true }
  );

  const lights = useControls(
    "Lights",
    {
      ambient: { value: 0.6, min: 0, max: 3, step: 0.05 },
      key: { value: 1.2, min: 0, max: 5, step: 0.1 },
      fill: { value: 0.4, min: 0, max: 5, step: 0.1 },
      envIntensity: { value: 0.5, min: 0, max: 2, step: 0.05 },
      exposure: { value: 0.7, min: 0.1, max: 2, step: 0.05 },
    },
    { collapsed: true }
  );

  return (
    <>
      <Leva hidden={!isDebug} collapsed={false} />
      <Canvas
        camera={{ position: [camera.camX, camera.camY, camera.camZ], fov: camera.fov }}
        gl={{ toneMappingExposure: lights.exposure }}
      >
        <ambientLight intensity={lights.ambient} color="#ffffff" />
        <Environment preset="city" environmentIntensity={lights.envIntensity} />
        <directionalLight position={[2, 2, 5]} intensity={lights.key} color="#ffffff" />
        <directionalLight position={[-3, 2, -2]} intensity={lights.fill} color="#ffffff" />
        {camera.orbit && <OrbitControls makeDefault />}
        <Suspense fallback={null}>
          <Model
            scale={[avatar.scale, avatar.scale, avatar.scale]}
            position={[avatar.posX, avatar.posY, avatar.posZ]}
            rotation={[0, avatar.rotY, 0]}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default HeroExperience;
