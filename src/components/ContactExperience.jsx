import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Model } from "../components/models/6YAbeta1";
import { Environment } from "@react-three/drei";
import { useInView } from "../hooks/useInView";

const ContactExperience = () => {
  const [ref, inView] = useInView("200px");
  return (
    <div ref={ref} className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        frameloop={inView ? "always" : "never"}
      >
        <ambientLight intensity={5} color="#edac97" />
        <Environment preset="sunset" />

        <directionalLight position={[2, 0, 5]} intensity={5} color="#dc488d" />
        <pointLight position={[2, 0, -5]} intensity={2} color="#2727e9" />

        <Suspense fallback={null}>
          <Model
            scale={[2.5, 2.5, 2.5]}
            position={[0, -2, 0]}
            rotation={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ContactExperience;
