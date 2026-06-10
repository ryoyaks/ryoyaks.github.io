import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { NeutralToneMapping } from "three";
import { Model } from "./models/6YAbeta1";

const HeroExperience = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Unlit baked-toon model — no scene lights, no environment.
  // NeutralToneMapping with exposure < 1 dims the baked colors closer to Blender preview.
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ toneMapping: NeutralToneMapping, toneMappingExposure: 0.7 }}
    >
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
