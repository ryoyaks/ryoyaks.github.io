import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// 只有兩個真正的目的地，所以不需要選單——一顆常駐的高對比按鈕就是導覽。
const NavBar = () => {
  return (
    <div className="w-full flex-center fixed z-50 top-0 left-0 md:p-0 px-5">
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
    </div>
  );
};

export default NavBar;
