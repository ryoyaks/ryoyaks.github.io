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

// 動畫走到蓋滿畫面的時間點。換頁排在這裡，但由 timer 觸發而非動畫 callback。
const SWAP_MS = 650;

// eslint-disable-next-line react/prop-types -- prop-types isn't used anywhere in this codebase
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [shownLocation, setShownLocation] = useState(location);
  const [label, setLabel] = useState(() => labelFor(location.pathname));
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  // 用 ref 而非 shownLocation 比對，effect 才不會被自己的換頁重新觸發、
  // 在動畫中途被 cleanup 砍掉。
  const shownPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === shownPathRef.current) return;
    shownPathRef.current = location.pathname;

    setLabel(labelFor(location.pathname));
    document.title = `${labelFor(location.pathname)} — RyoyakS`;

    const overlay = overlayRef.current;
    const text = textRef.current;

    if (prefersReducedMotion() || !overlay || !text) {
      setShownLocation(location);
      return;
    }

    // 分頁切到背景時瀏覽器會暫停 rAF，GSAP 隨之停擺。換頁掛在 timeline callback 上
    // 就會卡在網址已變、內容沒換的狀態；timer 在背景只會被節流，不會被停掉。
    const timer = setTimeout(() => {
      setShownLocation(location);
      window.scrollTo(0, 0);
    }, SWAP_MS);

    const tl = gsap.timeline();

    tl.set(overlay, { pointerEvents: "auto", yPercent: 100 })
      .set(text, { yPercent: 40, opacity: 0 })
      .to(overlay, { yPercent: 0, duration: 0.5, ease: "power3.inOut" })
      .to(text, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.2")
      .to(text, { yPercent: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, "+=0.15")
      .to(overlay, { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, "-=0.1")
      .set(overlay, { pointerEvents: "none" });

    return () => {
      clearTimeout(timer);
      tl.kill();
      // 導覽被下一次導覽打斷時，別留下一層看不見卻擋住點擊的 overlay。
      gsap.set(overlay, { pointerEvents: "none" });
    };
  }, [location]);

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
