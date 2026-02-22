import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { Model } from "../components/models/2026YA";
import { Environment } from "@react-three/drei";

const HeroExperience = () => {
  return (
    <Canvas 
      // 建議 fov 設在 50~75 之間，位置放在 Z 軸 (最後一個數字)
      camera={{ position: [0, 0, 5], fov: 50 }}> 
      
      <ambientLight intensity={5} color="#edac97" />
      <Environment preset="sunset" />

      {/* 修正燈光方向，讓它從前方照向模型 */}
      <directionalLight position={[2, 0, 5]} intensity={5} color="#dc488d" />
      <pointLight position={[2, 0, -5]} intensity={2} color="#2727e9" /> 

      <Suspense fallback={null}>
        <Model 
          scale={[9, 9, 9]}   
          position={[2, -9.5 , 0]} 
          rotation={[0, -0.5, 0]} 
        />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
