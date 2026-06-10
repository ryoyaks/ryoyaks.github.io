import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";

const VideoCard = ({ poster, src, className = "" }) => {
  const [active, setActive] = useState(false);
  const videoRef = useRef(null);
  const [containerRef, inView] = useInView("0px");

  const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  useEffect(() => {
    if (isTouch && inView) setActive(true);
    if (isTouch && !inView) setActive(false);
  }, [isTouch, inView]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => !isTouch && setActive(true)}
      onMouseLeave={() => !isTouch && setActive(false)}
    >
      <img
        src={poster}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}
      />
      {active && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default VideoCard;
