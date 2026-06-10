import HeroExperience from "../components/HeroExperience";
import CanvasErrorBoundary from "../components/CanvasErrorBoundary";
import { useContent } from "../hooks/useContent";

const Hero = () => {
  const data = useContent("main");
  const hero = data?.hero;

  return (
    <section
      id="home"
      className="w-screen h-dvh overflow-hidden relative md:p-0 px-5 text-[var(--fg)]"
    >
      <div className="container mx-auto relative w-full h-full">
        <div className="md:pt-40 pt-24 max-w-full md:max-w-[45%] relative z-10">
          {hero && (
            <>
              <p className="text-xs md:text-sm tracking-[0.25em] opacity-60">{hero.eyebrow}</p>
              <h1 className="font-black leading-[0.95] mt-2 text-6xl md:text-9xl text-[var(--fg)]">
                {hero.name}
              </h1>
              <p className="mt-5 text-base md:text-xl leading-relaxed text-[var(--fg-muted)]">
                {hero.subtitle?.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < hero.subtitle.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className="mt-7 flex gap-3 flex-wrap">
                {hero.ctas?.map((cta) => {
                  const external = /^https?:/.test(cta.href);
                  return (
                    <a
                      key={cta.label}
                      href={cta.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className={
                        cta.variant === "solid"
                          ? "bg-[var(--fg)] text-[var(--bg)] px-5 py-2.5 rounded-md text-sm font-semibold"
                          : "border border-[var(--border)] text-[var(--fg)] px-5 py-2.5 rounded-md text-sm"
                      }
                    >
                      {cta.label}
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="absolute inset-0 z-0">
          <CanvasErrorBoundary>
            <HeroExperience />
          </CanvasErrorBoundary>
        </div>

        {hero?.scrollHint && (
          <div className="absolute bottom-8 left-5 md:left-0 text-[11px] tracking-[0.2em] opacity-50">
            {hero.scrollHint}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
