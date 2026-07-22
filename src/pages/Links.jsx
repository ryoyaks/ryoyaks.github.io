import LinkIcon from "../components/LinkIcon";
import { useContent } from "../hooks/useContent";

// 這是全站唯一的功能性頁面：觀眾來這裡是要辦事的（買本、看圖、贊助、聯絡）。
// 刻意不載入 3D，也不套用首頁的重動效。
const Links = () => {
  const links = useContent("links", []) || [];

  return (
    <main className="min-h-dvh px-5 md:px-0 pt-28 md:pt-36 pb-20 text-[var(--fg)]">
      <div className="container mx-auto">
        <header className="mb-8 md:mb-12">
          <p className="text-[11px] tracking-[0.2em] opacity-60 uppercase">Links</p>
          <h1 className="text-4xl md:text-7xl font-black leading-none tracking-tight mt-2">
            All my online presence
          </h1>
          {links.length > 0 && (
            <p className="text-xs opacity-50 mt-3">{links.length} destinations</p>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block active:scale-[0.98] transition-transform"
            >
              <LinkIcon icon={item} type="wide" />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Links;
