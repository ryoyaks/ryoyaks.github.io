import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

// 轉場不是額外糊上的裝飾層，它就是新頁標題的到場。
const LABELS = {
  "/": "RYOYAKS",
  "/links": "LINKS",
  "/projects/syncrig": "SYNCRIG",
};

const labelFor = (pathname) => LABELS[pathname] ?? "404";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// eslint-disable-next-line react/prop-types -- prop-types isn't used anywhere in this codebase
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [shownLocation, setShownLocation] = useState(location);
  const [label, setLabel] = useState(() => labelFor(location.pathname));
  const overlayRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (location.pathname === shownLocation.pathname) return;

    setLabel(labelFor(location.pathname));

    const overlay = overlayRef.current;
    const text = textRef.current;

    if (prefersReducedMotion() || !overlay || !text) {
      setShownLocation(location);
      return;
    }

    const tl = gsap.timeline();

    tl.set(overlay, { pointerEvents: "auto", yPercent: 100 })
      .set(text, { yPercent: 40, opacity: 0 })
      .to(overlay, { yPercent: 0, duration: 0.5, ease: "power3.inOut" })
      .to(text, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.2")
      .add(() => {
        setShownLocation(location);
        window.scrollTo(0, 0);
      })
      .to(text, { yPercent: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, "+=0.15")
      .to(overlay, { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, "-=0.1")
      .set(overlay, { pointerEvents: "none" });

    return () => {
      tl.kill();
    };
  }, [location, shownLocation]);

  return (
    <>
      <div
        ref={overlayRef}
        data-testid="page-transition-overlay"
        aria-hidden="true"
        className="fixed inset-0 z-[200] pointer-events-none flex items-center
                   justify-center overflow-hidden bg-[var(--fg)]"
        style={{ transform: "translateY(100%)" }}
      >
        <span
          ref={textRef}
          className="font-black tracking-tight leading-none text-[var(--bg)]
                     text-[18vw] md:text-[14vw]"
        >
          {label}
        </span>
      </div>

      {children(shownLocation)}
    </>
  );
};

export default PageTransition;
