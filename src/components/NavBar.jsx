import { useLocation } from "react-router-dom";
import { navItems } from "../constants";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const { pathname } = useLocation();
  const onRoot = pathname === "/";
  const prefix = (href) => (onRoot || !href.startsWith("#") ? href : `/${href}`);

  return (
    <div className="w-full flex-center fixed z-50 top-0 left-0 md:p-0 px-5">
      <div className="container md:my-6 my-4 flex items-center justify-between">
        <a href={prefix("#home")} className="flex items-center gap-2 text-[var(--fg)]">
          <img
            src="/images/logo.webp"
            alt="logo"
            className="md:size-10 size-9 object-cover object-center"
          />
        </a>
        <div className="md:flex items-center gap-7 hidden">
          {navItems.map((item) => (
            <a
              key={item.name}
              className="text-base md:text-lg text-[var(--fg)] opacity-80 hover:opacity-100 transition-opacity"
              href={prefix(item.href)}
            >
              {item.name}
            </a>
          ))}
        </div>
        {/* Desktop-only theme toggle. Mobile gets one inside the side bar. */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
