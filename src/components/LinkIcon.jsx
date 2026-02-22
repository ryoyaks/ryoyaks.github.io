// src/components/LinkIcon.jsx
import React from 'react';

const LinkIcon = ({ icon, type = "square" }) => {
  const displaySrc = icon?.icon || icon?.image;

  // 統一外殼樣式：h-full 讓它跟旁邊的方形一樣高
  const baseClass = "w-full h-full bg-black-200 border border-white/5 rounded-xl transition-all duration-500 group overflow-hidden";

  if (type === "square") {
    return (
      <div className={`${baseClass} aspect-square flex items-center justify-center hover:-translate-y-2`}>
        <img src={displaySrc} alt={icon?.name} className="md:size-12 size-8 object-contain" />
      </div>
    );
  }

  if (type === "wide") {
    return (
      <div className={`${baseClass} flex items-center justify-between px-6 hover:-translate-y-1`}>
        <div className="flex items-center gap-4">
          <img src={displaySrc} alt={icon?.name} className="size-8 object-contain" />
          <span className="text-white font-medium italic">{icon?.displayName}</span>
        </div>
        <img src="/images/arrowupright.svg" className="size-4 opacity-30 group-hover:opacity-100 transition-all" />
      </div>
    );
  }

  if (type === "full") {
    return (
      <div className={`${baseClass} flex items-center justify-center p-4 hover:-translate-y-1`}>
        <img src={displaySrc} alt={icon?.name} className="w-full h-full object-contain" />
      </div>
    );
  }

  return null;
};

// 必須有這一行，且不能在註解內
export default LinkIcon;