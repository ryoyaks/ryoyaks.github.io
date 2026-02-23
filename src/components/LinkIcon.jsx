// src/components/LinkIcon.jsx

import React from 'react';



const LinkIcon = ({ icon, type = "square" }) => {

  const displaySrc = icon?.icon || icon?.image;



  // 統一外殼樣式：h-full 讓它跟旁邊的方形一樣高

  const baseClass = "w-full h-full bg-black-200  border-white/5 transition-all duration-500 group overflow-hidden flex items-center";



  // const baseClass = "w-full bg-black-200 border border-white/5 rounded-xl  transition-all duration-200 group overflow-hidden flex items-center";




 if (type === "square") {

    return (

      // 正方形保持 1:1

      <div className={`${baseClass} aspect-square rounded-xl justify-center hover:-translate-y-2`}>

        <img src={displaySrc} alt={icon?.name} className="md:size-30 size-25 object-contain" />

      </div>

    );

  }
  if (type === "small") {

    return (

      // 正方形保持 1:1

      <div className={`${baseClass} aspect-square justify-center hover:-translate-y-2`}>

        <img src={displaySrc} alt={icon?.name} className="md:size-8 size-12 object-contain" />

      </div>

    );

  }


  if (type === "wide") {

    /**

     * 重點：如果你的 wide 橫跨了 N 個網格，比例就要設為 [N / 1]

     * 假設你的 wide 在父層設了 col-span-3 (橫跨三個方格)

     * 那麼比例設為 aspect-[3/1]，它的高度就會「絕對精準」地等於旁邊的正方形。

     */

    return (

      <div className={`${baseClass} aspect-[3/1] rounded-xl justify-between px-6 hover:-translate-y-1`}>

        <div className="flex items-center gap-4">

          <img src={displaySrc} alt={icon?.name} className="md:size-24 size-20 object-contain" />

          <span className="text-white font-medium text-bold md:text-xl">{icon?.displayName}</span>

        </div>

        <img src="/images/arrowupright.svg" className="size-4 opacity-30 group-hover:opacity-100 transition-all" />

      </div>

    );

  }



  // 處理 type="full" (如果是像原本的大方塊但要維持特定比例)

  if (type === "full") {

    return (

      <div className={`${baseClass}  aspect-[2/1] rounded-xl justify-center p-4 hover:-translate-y-1`}>

        <img src={displaySrc} alt={icon?.name} className="md:size-60 size-56 object-contain" />

      </div>

    );

  }



  return null;

};



// 必須有這一行，且不能在註解內

export default LinkIcon;
