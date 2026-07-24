import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// 只有兩個真正的目的地，所以不需要選單——一顆常駐的高對比按鈕就是導覽。
// 首頁的 G3 hero 自帶字標與導覽，全域列在 hero 範圍內會撞版——
// 因此在首頁捲過 hero（約一屏）前隱藏，捲過後才滑入；其他頁維持常駐。
const NavBar = () => {
  const { pathname } = useLocation();
  const overHero = pathname === "/";
  const [hidden, setHidden] = useState(overHero);

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

  return (
    <nav
      aria-label="Main"
      className={`w-full flex-center fixed z-50 top-0 left-0 md:p-0 px-5
                  transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container md:my-6 my-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[var(--fg)]" aria-label="RyoyakS">
          <img
            src="/images/logo.webp"
            alt=""
            className="md:size-10 size-9 object-cover object-center"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/links"
            className="px-4 py-2 rounded-md text-sm md:text-base font-semibold
                       bg-[var(--fg)] text-[var(--bg)]
                       hover:opacity-85 transition-opacity
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-[var(--fg)]"
          >
            Links
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
