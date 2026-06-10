import { navItems } from "../constants";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  return (
    <div className="w-full flex-center fixed z-50 top-0 left-0 md:p-0 px-5">
      <div className="container md:my-6 my-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 text-[var(--fg)]">
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
              className="text-sm text-[var(--fg)] opacity-80 hover:opacity-100 transition-opacity"
              href={item.href}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contact"
            className="bg-[var(--accent)] text-white font-semibold py-2 px-4 rounded-full text-sm hidden md:inline-block"
          >
            Hire Me
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
