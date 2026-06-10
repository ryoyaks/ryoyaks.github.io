import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva, useControls, button } from "leva";
import { Model } from "./models/6YAbeta1";
import { useTheme } from "../hooks/useTheme";

const isDebug =
  import.meta.env.DEV ||
  (typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1");

const ENV_PRESETS = [
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "city",
  "park",
  "lobby",
];

const LIGHT_DEFAULTS = {
  dark: {
    preset: "city",
    ambient: 3.0,
    key: 1.3,
    fill: 5.0,
    envIntensity: 1.1,
    exposure: 0.7,
  },
  light: {
    preset: "apartment",
    ambient: 1.5,
    key: 1.0,
    fill: 2.0,
    envIntensity: 0.7,
    exposure: 0.85,
  },
};

const CAMERA_DEFAULTS = {
  desktop: { position: [-0.24, 0.22, 4.75], target: [-1.05, 0.01, -0.18], fov: 90 },
  mobile: { position: [0, 0, 5], target: [0, 0, 0], fov: 90 },
};

// Lives inside Canvas: keeps the three.js camera + leva in sync.
// In debug, OrbitControls is active and feeds live position into leva.
// In prod, just applies defaults via useEffect; no OrbitControls renders.
const CameraBridge = ({ position, target, fov, setMonitor, cameraRef, orbitRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera, cameraRef]);

  useEffect(() => {
    camera.position.fromArray(position);
    camera.fov = fov;
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
  }, [camera, position, target, fov]);

  if (!isDebug) return null;

  return (
    <OrbitControls
      makeDefault
      enableDamping
      target={target}
      ref={(c) => {
        orbitRef.current = c;
      }}
      onChange={(e) => {
        const c = e.target.object;
        setMonitor({
          position: `${c.position.x.toFixed(2)}, ${c.position.y.toFixed(2)}, ${c.position.z.toFixed(2)}`,
        });
      }}
    />
  );
};

const HeroExperience = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const cameraRef = useRef(null);
  const orbitRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const avatarDefaults = isMobile
    ? { scale: 7, posX: 2, posY: -9.5, posZ: 0, rotY: -0.5 }
    : { scale: 10, posX: 1.9, posY: -9.7, posZ: -2.4, rotY: -0.25 };

  const cameraDefaults = isMobile ? CAMERA_DEFAULTS.mobile : CAMERA_DEFAULTS.desktop;
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

  const [cam, setCam] = useControls(
    "Camera",
    () => ({
      position: {
        value: cameraDefaults.position.map((v) => v.toFixed(2)).join(", "),
        editable: false,
        label: "pos (drag)",
      },
      fov: { value: cameraDefaults.fov, min: 20, max: 120, step: 1 },
      snapshot: button(() => {
        const c = cameraRef.current;
        const oc = orbitRef.current;
        if (!c) {
          console.warn("[snapshot] camera not ready");
          return;
        }
        const round = (v) => Math.round(v * 100) / 100;
        const out = {
          position: [round(c.position.x), round(c.position.y), round(c.position.z)],
          target: oc
            ? [round(oc.target.x), round(oc.target.y), round(oc.target.z)]
            : [0, 0, 0],
          fov: Math.round(c.fov),
        };
        const txt = JSON.stringify(out);
        console.log("[Camera snapshot]", out);
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(txt);
          console.log("→ copied to clipboard");
        }
      }),
    }),
    { collapsed: true },
    [isMobile]
  );

  const lights = useControls(
    `Lights (${theme})`,
    {
      preset: { value: lightDefaults.preset, options: ENV_PRESETS },
      ambient: { value: lightDefaults.ambient, min: 0, max: 5, step: 0.05 },
      key: { value: lightDefaults.key, min: 0, max: 5, step: 0.1 },
      fill: { value: lightDefaults.fill, min: 0, max: 5, step: 0.1 },
      envIntensity: { value: lightDefaults.envIntensity, min: 0, max: 3, step: 0.05 },
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
        camera={{ position: cameraDefaults.position, fov: cam.fov }}
        gl={{ toneMappingExposure: lights.exposure }}
      >
        <ambientLight intensity={lights.ambient} color="#ffffff" />
        <Environment preset={lights.preset} environmentIntensity={lights.envIntensity} />
        <directionalLight position={[2, 2, 5]} intensity={lights.key} color="#ffffff" />
        <directionalLight position={[-3, 2, -2]} intensity={lights.fill} color="#ffffff" />
        <CameraBridge
          position={cameraDefaults.position}
          target={cameraDefaults.target}
          fov={cam.fov}
          setMonitor={setCam}
          cameraRef={cameraRef}
          orbitRef={orbitRef}
        />
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
