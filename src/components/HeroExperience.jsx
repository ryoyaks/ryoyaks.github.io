import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Environment } from "@react-three/drei";
import VRMAvatar from "./VRMAvatar";
import { useContent } from "../hooks/useContent";

const HeroExperience = () => {
  const [isMobile, setIsMobile] = useState(false);
  const main = useContent("main");
  const avatar = main?.avatar;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!avatar) return null;

  const cfg = isMobile ? avatar.mobile : avatar.desktop;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ toneMappingExposure: 0.65 }}
    >
      <ambientLight intensity={0.6} color="#ffffff" />
      <Environment preset="city" environmentIntensity={0.5} />
      <directionalLight position={[2, 2, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#ffffff" />
      <Suspense fallback={null}>
        <VRMAvatar
          url={avatar.url}
          animationUrl={avatar.animation || null}
          scale={cfg?.scale ?? 1}
          position={cfg?.position ?? [0, 0, 0]}
          rotation={cfg?.rotation ?? [0, 0, 0]}
        />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
