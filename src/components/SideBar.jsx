import { useState } from "react";
import { useLocation } from "react-router-dom";
import { navItems } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const onRoot = pathname === "/";
  const prefix = (href) => (onRoot || !href.startsWith("#") ? href : `/${href}`);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  useGSAP(() => {
    const tl = gsap.timeline();

    if (isOpen) {
      tl.to(".side-bar-panel", {
        x: 0,
        opacity: 1,
        ease: "power2.inOut",
      });
      tl.to(
        ".side-bar-item",
        {
          opacity: 1,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        "<"
      );
    } else {
      tl.to(".side-bar-panel", {
        x: "100%",
        opacity: 0,
        ease: "power2.inOut",
      });
      tl.to(".side-bar-item", {
        opacity: 0,
      });
    }
  }, [isOpen]);

  return (
    <div className="md:hidden block">
      <button
        type="button"
        onClick={toggleSideBar}
        aria-label="Open menu"
        className="fixed z-[100] top-7 right-5"
      >
        <img src="/images/menu-icon.webp" alt="" className="invert-0 dark:invert" />
      </button>
      <div
        className="side-bar-panel fixed z-[100] -translate-x-[100%] w-screen h-dvh"
        style={{
          background: "color-mix(in srgb, var(--bg-elev) 92%, transparent)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          type="button"
          onClick={toggleSideBar}
          aria-label="Close menu"
          className="flex justify-end m-5 ml-auto"
        >
          <img src="/images/x.webp" alt="" />
        </button>
        <div className="mt-20 px-10">
          <div className="flex flex-col items-center gap-20">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="side-bar-item opacity-0 cursor-pointer hover:underline transition-all duration-700"
                onClick={toggleSideBar}
              >
                <a
                  className="text-2xl font-bold text-[var(--fg)]"
                  href={prefix(item.href)}
                >
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
