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
        {/* Top-left identity — z-0 so the 3D avatar occludes it */}
        {hero && (
          <div className="md:pt-32 pt-24 relative z-0 pointer-events-none">
            <p className="text-lg md:text-2xl tracking-wide opacity-80">{hero.eyebrow}</p>
            <h1 className="font-black leading-[0.9] tracking-tight mt-2 text-7xl md:text-[12rem]">
              {hero.name}
            </h1>
            {hero.divider && (
              <div className="mt-2 text-5xl md:text-7xl font-black opacity-60 leading-none">
                {hero.divider}
              </div>
            )}
          </div>
        )}

        {/* 3D in front — overlaps text */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <CanvasErrorBoundary>
            <HeroExperience />
          </CanvasErrorBoundary>
        </div>

        {/* Bottom-right big title — also behind the avatar */}
        {hero?.bigTitle && (
          <div className="absolute bottom-12 right-0 z-0 w-full text-right pr-5 md:pr-0 pointer-events-none">
            <h2 className="font-black leading-[0.9] tracking-tight text-5xl md:text-[10rem]">
              {hero.bigTitle}
            </h2>
          </div>
        )}

        {/* Bottom-left Explore — z-20 stays clickable above the avatar */}
        {hero?.exploreLabel && (
          <a
            href="#links"
            className="absolute bottom-10 left-5 md:left-0 z-20 flex flex-col items-start gap-2"
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
