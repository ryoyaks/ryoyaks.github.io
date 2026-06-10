

import React from 'react';



const LinkIcon = ({ icon, type = "square" }) => {

  const displaySrc = icon?.icon || icon?.image;



  // 統一外殼樣式：h-full 讓它跟旁邊的方形一樣高

  const baseClass = "w-full h-full bg-[var(--bg-elev)] border border-[var(--border)] transition-all duration-300 group overflow-hidden flex items-center";



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

      <div className={`${baseClass} aspect-[5/1] rounded-md hover:-translate-y-1 relative`}>

        {/* Background icon — flush against the left edge, vertically centred */}
        <img
          src={displaySrc}
          alt=""
          className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-auto object-contain pointer-events-none"
        />

        {/* 40% black mask over the whole tile for legibility */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* Text + arrow — right portion, padded so it never sits on the icon */}
        <div className="relative h-full w-full flex items-center justify-between pl-[35%] pr-4">

          <div className="flex flex-col min-w-0">
            <span className="text-white font-semibold text-lg md:text-xl leading-tight truncate">{icon?.displayName}</span>
            {icon?.subLabel && (
              <span className="text-white/70 text-sm md:text-base mt-0.5 leading-tight truncate">{icon.subLabel}</span>
            )}
          </div>

          <img src="/images/arrowupright.svg" className="size-4 md:size-5 opacity-50 group-hover:opacity-100 transition-all shrink-0 invert" />

        </div>

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
