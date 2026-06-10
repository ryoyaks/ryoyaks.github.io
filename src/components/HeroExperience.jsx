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

  // Tuned defaults. Open leva in dev (or ?debug=1 in prod) to re-tune.
  const defaults = isMobile
    ? { scale: 6, posX: 0, posY: -6, posZ: -2, rotY: 0 }
    : { scale: 8, posX: 2, posY: -8.1, posZ: -2.4, rotY: -0.25 };

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
      fov: { value: 90, min: 20, max: 120, step: 1 },
      orbit: { value: false, label: "Drag to orbit" },
    },
    { collapsed: true }
  );

  const lights = useControls(
    "Lights",
    {
      ambient: { value: 3.0, min: 0, max: 5, step: 0.05 },
      key: { value: 1.3, min: 0, max: 5, step: 0.1 },
      fill: { value: 5.0, min: 0, max: 5, step: 0.1 },
      envIntensity: { value: 1.1, min: 0, max: 2, step: 0.05 },
      exposure: { value: 0.7, min: 0.1, max: 2, step: 0.05 },
    },
    { collapsed: true }
  );

  return (
    <>
      <Leva
        hidden={!isDebug}
        collapsed={false}
        titleBar={{ position: { x: 0, y: 80 } }}
      />
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
