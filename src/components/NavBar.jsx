import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// 全站導覽——與 hero 的字標導覽同一組目的地。錨點用絕對路徑（/#about），
// 這樣從任何頁面點擊都會回到首頁再捲動；/links 是獨立路由。
const LINKS = [
  { label: "ABOUT", href: "/#about" },
  { label: "LINKS", href: "/links", route: true },
  { label: "ARTS", href: "/#works" },
  { label: "PROJECTS", href: "/#works" },
  { label: "CONTACT", href: "/#contact" },
];

// 首頁的 G3 hero 自帶字標與導覽，全域列在 hero 範圍內會撞版——
// 因此在首頁捲過 hero（約一屏）前隱藏，捲過後才滑入；其他頁維持常駐。
const NavBar = () => {
  const { pathname } = useLocation();
  const overHero = pathname === "/";
  const [hidden, setHidden] = useState(overHero);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overHero) {
      setHidden(false);
      return;
    }
    const onScroll = () => setHidden(window.scrollY < window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  // 捲動離開 hero 時若選單開著，收起來，避免懸空。
  useEffect(() => {
    if (hidden) setMenuOpen(false);
  }, [hidden]);

  const linkClass =
    "text-[12px] tracking-[0.14em] uppercase text-[var(--fg)]/80 hover:text-[var(--fg)] transition-colors";

  const renderLink = (item, cls) =>
    item.route ? (
      <Link key={item.label} to={item.href} className={cls} onClick={() => setMenuOpen(false)}>
        {item.label}
      </Link>
    ) : (
      <a key={item.label} href={item.href} className={cls} onClick={() => setMenuOpen(false)}>
        {item.label}
      </a>
    );

  return (
    <header
      aria-label="Main"
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300
                  ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      {/* transparent, edge-hugging bar (hero style) — logo sits by the left seam,
         nav by the right seam; no solid background. */}
      <div className="w-full px-6 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[var(--fg)]" aria-label="RyoyakS">
          <img src="/images/logo.webp" alt="" className="md:size-9 size-8 object-contain" />
        </Link>

        {/* desktop: full link row */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Sections">
          {LINKS.map((item) => renderLink(item, linkClass))}
          <ThemeToggle />
        </nav>

        {/* mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="relative w-10 h-10 -mr-2 flex items-center justify-center text-[var(--fg)]
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block w-5 h-4">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform duration-300
                            ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] w-5 bg-current transition-opacity duration-200
                            ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 bottom-0 h-[1.5px] w-5 bg-current transition-transform duration-300
                            ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile dropdown menu */}
      <nav
        aria-label="Sections"
        className={`md:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md
                    transition-[max-height] duration-300 ${menuOpen ? "max-h-80" : "max-h-0"}`}
      >
        <div className="flex flex-col px-6 py-2">
          {LINKS.map((item) =>
            renderLink(item, `${linkClass} py-3 border-b border-[var(--border)] last:border-b-0`),
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
