import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import React, { Suspense } from "react";
import GradientSpheres from "../components/GradientSpheres";
import { Model } from "../components/models/2026YA";
import TitleHeader from "../components/TitleHeader";
import LinkIcon from "../components/LinkIcon";
import { linkSections } from "../constants"; 

import { Environment } from "@react-three/drei";
/**
 * About 組件：採用 Bento Grid 佈局，展示創作者簡介、3D 模型與社交動態
 */
const About = () => {
  // 將陣列轉成以 name 為 key 的物件，方便直接 index 存取
  const links = linkSections[0].links.reduce((acc, link) => {
    acc[link.name] = link;
    return acc;
  }, {});
  return (
    <section id="about" className="flex-center relative md:p-0 px-5">
      {/* 背景裝飾：流動感漸層球體 */}
      <GradientSpheres
        sphere1Class="about-gradient-sphere about-sphere-1"
        sphere2Class="about-gradient-sphere about-sphere-2"
      />

      <div className="container w-full h-full md:my-40 my-20 relative z-10">
        {/* 區塊標題：數字編號與主副標題 */}
        <TitleHeader
          title="About Me"
          number="01"
          text="Passionate Creator, Lifelong Learner"
        />

        <div className="md:mt-20 mt-10">
          {/* 主佈局：使用 12 欄格狀系統 */}
          <div className="grid grid-cols-12 md:grid-rows-3 gap-5">
            
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
                    I am a digital artist and multi-disciplinary content creator 
                    specializing in character illustration. Beyond 2D art, I leverage 
                    Blender, Unity, and Unreal Engine to bridge the gap between 
                    illustration and 3D/interactive media.
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
            {/* LINKS start */}
            {/* --- Link 區塊 (佔 8 欄) --- */}
            <div className="md:col-span-12 col-span-12 row-span-1">
              <div className="bg-black-300 rounded-2xl p-7 h-full flex flex-col">
                {/* 標題與副標題 */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-white text-2xl font-bold italic uppercase leading-none">Links</h1>
                  <p className="text-white-500 text-sm hidden md:block">Follow Me On</p>
                </div>
                
                {/* Grid 容器 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow content-start">
                  {[
                    "twitter", "facebook", "pixiv", "youtube", "twitch", 
                    "fanbox", "myacg", "melonbooks", "marshmallow", "paypal"
                  ].map((key) => {
                    const item = links[key];
                    if (!item) return null;

                    // 判斷 Case
                    let type = "square"; // 預設 Case 1
                    let colSpan = "col-span-1";

                    if (key === "fanbox") {
                      type = "full";     // Case 3: 長型完整 Icon
                      colSpan = "sm:col-span-2 col-span-2"; // 佔兩格
                    } else if (key === "myacg") {
                      type = "wide";     // Case 2: 文字 + Icon
                      colSpan = "sm:col-span-2 col-span-2"; // 佔兩格
                    }

                    return (
                      <a 
                        key={key} 
                        href={item.href} 
                        target="_blank" 
                        rel="noreferrer"
                        // 動態切換 col-span，確保長方形能佔兩格
                        className={`block active:scale-95 transition-transform ${colSpan}`}
                      >
                        <LinkIcon icon={item} type={type} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LINKS end */}
 

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;




//  {/* --- 中間區塊：設計與開發技能說明 (各佔 6 欄) --- */}
//             <div className="md:col-span-6 col-span-12 row-span-1">
//               <div className="bg-black-300 rounded-2xl p-7 w-full h-full">
//                 <div className="flex flex-col h-full justify-center gap-2">
//                   <h1 className="gradient-title md:text-3xl text-2xl font-medium">
//                     Web Design & Dev
//                   </h1>
//                   <p className="md:text-xl text-white-600">
//                     Cleanly Designed, Conversion-focused, and built for easy updates.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="md:col-span-6 col-span-12 row-span-1">
//               <div className="bg-black-300 rounded-2xl p-7 w-full h-full">
//                 <div className="flex flex-col h-full justify-center gap-2">
//                   <h1 className="gradient-title md:text-3xl text-2xl font-medium">
//                     UX UI Design
//                   </h1>
//                   <p className="md:text-xl text-white-600">
//                     Seamless web or mobile app design to wow your users.
//                   </p>
//                 </div>
//               </div>
//             </div>