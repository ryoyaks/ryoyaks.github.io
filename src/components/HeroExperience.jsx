import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva, useControls } from "leva";
import { Model } from "./models/6YAbeta1";
import { useTheme } from "../hooks/useTheme";

const isDebug =
  import.meta.env.DEV ||
  (typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1");

const LIGHT_DEFAULTS = {
  dark: { ambient: 3.0, key: 1.3, fill: 5.0, envIntensity: 1.1, exposure: 0.7 },
  light: { ambient: 1.5, key: 1.0, fill: 2.0, envIntensity: 0.7, exposure: 0.85 },
};

const HeroExperience = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const avatarDefaults = isMobile
    ? { scale: 9, posX: 2, posY: -9.5, posZ: 0, rotY: -0.5 }
    : { scale: 10, posX: 1.9, posY: -9.7, posZ: -2.4, rotY: -0.25 };

  const lightDefaults = LIGHT_DEFAULTS[theme] ?? LIGHT_DEFAULTS.dark;

  const avatar = useControls(
    "Avatar",
    {
      scale: { value: avatarDefaults.scale, min: 1, max: 20, step: 0.1 },
      posX: { value: avatarDefaults.posX, min: -10, max: 10, step: 0.1 },
      posY: { value: avatarDefaults.posY, min: -20, max: 5, step: 0.1 },
      posZ: { value: avatarDefaults.posZ, min: -10, max: 10, step: 0.1 },
      rotY: { value: avatarDefaults.rotY, min: -Math.PI, max: Math.PI, step: 0.05 },
    },
    { collapsed: true },
    [isMobile]
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
    `Lights (${theme})`,
    {
      ambient: { value: lightDefaults.ambient, min: 0, max: 5, step: 0.05 },
      key: { value: lightDefaults.key, min: 0, max: 5, step: 0.1 },
      fill: { value: lightDefaults.fill, min: 0, max: 5, step: 0.1 },
      envIntensity: { value: lightDefaults.envIntensity, min: 0, max: 2, step: 0.05 },
      exposure: { value: lightDefaults.exposure, min: 0.1, max: 2, step: 0.05 },
    },
    { collapsed: true },
    [theme]
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
