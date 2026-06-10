import { useContent } from "../hooks/useContent";

const Footer = () => {
  const data = useContent("main");
  const site = data?.site;
  const footer = data?.footer;

  return (
    <footer className="w-full bg-[var(--bg-elev)] border-t border-[var(--border)] py-10 text-[var(--fg)]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-5 md:px-0">
        <div className="flex items-center gap-2">
          <img
            src={site?.logo || "/images/logo.webp"}
            alt="logo"
            className="w-7 h-7 object-contain"
          />
          <span className="text-sm opacity-70">
            © {site?.copyrightYear || ""} {site?.name || ""}
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm opacity-70">
          {footer?.quickLinks?.map((link) => {
            const external = /^https?:/.test(link.href);
            return (
              <a
                key={link.name}
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
