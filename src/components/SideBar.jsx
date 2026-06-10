import { useState } from "react";
import { useLocation } from "react-router-dom";
import { navItems } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ThemeToggle from "./ThemeToggle";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const onRoot = pathname === "/";
  const prefix = (href) => (onRoot || !href.startsWith("#") ? href : `/${href}`);

  const toggleSideBar = () => setIsOpen(!isOpen);

  useGSAP(() => {
    const tl = gsap.timeline();
    if (isOpen) {
      tl.to(".side-bar-panel", { x: 0, opacity: 1, ease: "power2.inOut" });
      tl.to(".side-bar-item", { opacity: 1, stagger: 0.05, ease: "power2.inOut" }, "<");
    } else {
      tl.to(".side-bar-panel", { x: "100%", opacity: 0, ease: "power2.inOut" });
      tl.to(".side-bar-item", { opacity: 0 });
    }
  }, [isOpen]);

  return (
    <div className="md:hidden block">
      <button
        type="button"
        onClick={toggleSideBar}
        aria-label="Open menu"
        className="fixed z-[100] top-6 right-5 text-[var(--fg)] p-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-elev)]/80 backdrop-blur"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      <div
        className="side-bar-panel fixed z-[100] -translate-x-[100%] w-screen h-dvh"
        style={{
          background: "color-mix(in srgb, var(--bg-elev) 92%, transparent)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex justify-between items-center m-5">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleSideBar}
            aria-label="Close menu"
            className="text-[var(--fg)] p-1.5 rounded-md border border-[var(--border)]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <div className="mt-12 px-10">
          <div className="flex flex-col items-center gap-12">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="side-bar-item opacity-0 cursor-pointer hover:underline transition-all duration-700"
                onClick={toggleSideBar}
              >
                <a className="text-2xl font-bold text-[var(--fg)]" href={prefix(item.href)}>
                  {item.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
