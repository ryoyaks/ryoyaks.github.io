import HeroExperience from "../components/HeroExperience";
import CanvasErrorBoundary from "../components/CanvasErrorBoundary";
import { useContent } from "../hooks/useContent";

const Hero = () => {
  const data = useContent("main");
  const hero = data?.hero;

  return (
    <section
      id="home"
      className="w-screen h-dvh overflow-hidden relative text-[var(--fg)] film-noise"
    >
      {/* Subtle radial bloom from upper-right corner — fullscreen */}
      <div className="absolute inset-0 z-0 pointer-events-none hero-bloom" />

      {/* Background marquee — huge faded repeating text, fullscreen */}
      {hero?.marquee && (
        <div className="absolute inset-0 z-0 overflow-hidden flex items-center pointer-events-none">
          <div className="whitespace-nowrap leading-none font-black tracking-tight text-[10rem] md:text-[18rem] opacity-[0.06] hero-marquee">
            {`${hero.marquee} · `.repeat(6)}
          </div>
        </div>
      )}

      {/* 3D Canvas — fullscreen, escapes the container max-width */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <CanvasErrorBoundary>
          <HeroExperience />
        </CanvasErrorBoundary>
      </div>

      <div className="container mx-auto relative w-full h-full px-5 md:px-0">
        {/* Top-left identity — z-0 so the 3D avatar occludes it */}
        {hero && (
          <div className="md:pt-32 pt-24 relative z-0 pointer-events-none">
            <p className="text-lg md:text-2xl tracking-wide opacity-80">{hero.eyebrow}</p>
            <h1 className="font-black leading-[0.9] tracking-tight mt-2 text-6xl md:text-[9rem]">
              {hero.name}
            </h1>

            {/* Three-line meta block under the name */}
            <div className="mt-10 md:mt-16 space-y-1">
              {hero.altNames && (
                <div className="text-2xl md:text-4xl font-bold tracking-wide opacity-85">
                  {hero.altNames}
                </div>
              )}
              {hero.roles && (
                <div className="text-sm md:text-lg tracking-[0.25em] uppercase opacity-60">
                  {hero.roles}
                </div>
              )}
              {hero.flourish && (
                <div className="text-xl md:text-2xl opacity-40 pt-1">
                  {hero.flourish}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom-right big title — IN FRONT of the avatar */}
        {hero?.bigTitle && (
          <div className="absolute bottom-8 md:bottom-12 right-0 z-20 w-full text-right pr-5 md:pr-0 pointer-events-none">
            <h2 className="font-black leading-[0.9] tracking-tight text-3xl md:text-[7.5rem]">
              {hero.bigTitle}
            </h2>
          </div>
        )}

        {/* Bottom-left Explore — pushed higher on mobile so it clears bigTitle */}
        {hero?.exploreLabel && (
          <a
            href="#links"
            className="absolute bottom-32 md:bottom-10 left-5 md:left-0 z-20 flex flex-col items-start gap-2"
          >
            <span className="text-base md:text-xl tracking-[0.15em] opacity-80">{hero.exploreLabel}</span>
            <span className="text-2xl animate-bounce">↓</span>
          </a>
        )}
      </div>
    </section>
  );
};

export default Hero;
