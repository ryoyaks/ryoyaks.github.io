import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { Model } from "../components/models/6YAbeta1";
import { useTheme } from "../hooks/useTheme";

const HeroExperience = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight
        intensity={isLight ? 2.5 : 5}
        color={isLight ? "#fdfdfd" : "#edac97"}
      />
      <Environment preset={isLight ? "city" : "sunset"} />
      <directionalLight
        position={[2, 0, 5]}
        intensity={isLight ? 2 : 5}
        color={isLight ? "#ffffff" : "#dc488d"}
      />
      <pointLight
        position={[2, 0, -5]}
        intensity={isLight ? 1 : 2}
        color={isLight ? "#9ca3af" : "#2727e9"}
      />
      <Suspense fallback={null}>
        <Model scale={[9, 9, 9]} position={[2, -9.5, 0]} rotation={[0, -0.5, 0]} />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
