import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Environment } from "@react-three/drei";
import { Model } from "../components/models/6YAbeta1";

const HeroExperience = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        <Model
          scale={isMobile ? [6.5, 6.5, 6.5] : [9, 9, 9]}
          position={isMobile ? [0, -7, 0] : [2, -9.5, 0]}
          rotation={[0, isMobile ? 0 : -0.5, 0]}
        />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
