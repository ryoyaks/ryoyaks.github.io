import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import React, { Suspense } from "react";
import GradientSpheres from "../components/GradientSpheres";
import { Model } from "../components/models/6YAbeta1";
import TitleHeader from "../components/TitleHeader";

import { Environment } from "@react-three/drei";
/**
 * About 組件：採用 Bento Grid 佈局，展示創作者簡介、3D 模型與社交動態
 */
const About = () => {

  return (
    <section id="about" className="flex-center relative md:p-0 px-5">
      {/* 背景裝飾：流動感漸層球體 */}
      <GradientSpheres
        sphere1Class="about-gradient-sphere about-sphere-1"
        sphere2Class="about-gradient-sphere about-sphere-2"
      />

      <div className="container w-full h-full  relative z-10">
        {/* 區塊標題：數字編號與主副標題 */}
        <TitleHeader
          title="About Me"
          number="02"
          text="Creator, Who interetested in Everything"
        />

        <div className="md:mt-20 mt-10">
          {/* 主佈局：使用 12 欄格狀系統 */}
          <div className="grid grid-cols-12 md:grid-rows-1 gap-5">
            
            {/* --- 左上區塊：個人品牌簡介 (佔 7 欄) --- */}
            <div className="md:col-span-7 col-span-12 row-span-1">
              <div className="bg-black-300 rounded-2xl p-7 w-full h-full">
                <div>
                  <img
                    src="/images/flower.svg"
                    alt="flower"
                    className="md:w-32 w-16 flower"
                  />
                </div>
                <div className="mt-5">
                  <h1 className="text-blue-50 md:text-5xl text-3xl font-bold">
                    RyoyakS
                  </h1>
                  <p className="md:text-2xl mt-2 leading-relaxed text-white-600">
                    A digital artist and multi-disciplinary content creator 
                    specializing in character illustration. .
                  </p>
                </div>
              </div>
            </div>
            {/* --- 右上區塊：3D 模型展示區 (佔 5 欄) --- */}
            <div className="md:col-span-5 col-span-12 row-span-1">
              <div className="bg-[#282828] hover:cursor-grab rounded-2xl w-full md:h-full h-60 overflow-hidden">
                <div className="w-full h-full">
                  <Canvas 
                        // 建議 fov 設在 50~75 之間，位置放在 Z 軸 (最後一個數字)
                        camera={{ position: [0, 0, 5], fov: 50 }}> 
                        
                        <ambientLight intensity={5} color="#5c8be9" />
                        <Environment preset="sunset" />
                  
                        {/* 修正燈光方向，讓它從前方照向模型 */}
                        <directionalLight position={[2, -5, 5]} intensity={5} color="#838383" />
                        <pointLight position={[2, -5, -5]} intensity={2} color="#1818b9" /> 

                        <Suspense fallback={null}>
                          <Model 
                            scale={[13, 13, 13]}   
                            position={[1, -13.5 , 0]} 
                            rotation={[0, -0.3, 0]} 
                          />
                        </Suspense>
                      </Canvas>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;


