const Footer = () => {
  return (
    <footer className="w-full bg-[var(--bg-elev)] border-t border-[var(--border)] py-10 text-[var(--fg)]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-5 md:px-0">
        <div className="flex items-center gap-2">
          <img
            src="/images/logo.webp"
            alt="logo"
            className="w-7 h-7 object-contain"
          />
          <span className="text-sm opacity-70">© 2026 RyoyakS</span>
        </div>
        <div className="flex items-center gap-5 text-sm opacity-70">
          <a href="https://x.com/RyoyakS" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://www.pixiv.net/users/15708685" target="_blank" rel="noreferrer">Pixiv</a>
          <a href="mailto:ryoyaillust892763@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
