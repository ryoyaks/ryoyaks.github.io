import HeroExperience from "../components/HeroExperience";

const Hero = () => {
  return (
    <section
      id="home"
      className="w-screen h-dvh overflow-hidden relative md:p-0 px-5 text-[var(--fg)]"
    >
      <div className="container mx-auto relative w-full h-full">
        <div className="md:pt-40 pt-28 max-w-[45%] md:max-w-[45%] relative z-10">
          <p className="text-xs md:text-sm tracking-[0.25em] opacity-60">HELLO, I&apos;M</p>
          <h1 className="font-black leading-[0.95] mt-2 text-6xl md:text-9xl text-[var(--fg)]">
            RyoyakS
          </h1>
          <p className="mt-5 text-base md:text-xl leading-relaxed text-[var(--fg-muted)]">
            Illustrator · 3D Creator
            <br />
            VR / CV / HCI Developer
          </p>
          <div className="mt-7 flex gap-3 flex-wrap">
            <a
              href="#links"
              className="bg-[var(--fg)] text-[var(--bg)] px-5 py-2.5 rounded-md text-sm font-semibold"
            >
              Explore ↓
            </a>
            <a
              href="https://github.com/ryoyaks"
              target="_blank"
              rel="noreferrer"
              className="border border-[var(--border)] text-[var(--fg)] px-5 py-2.5 rounded-md text-sm"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="absolute inset-0 z-0">
          <HeroExperience />
        </div>

        <div className="absolute bottom-8 left-5 md:left-0 text-[11px] tracking-[0.2em] opacity-50">
          ↓ SCROLL
        </div>
      </div>
    </section>
  );
};

export default Hero;
