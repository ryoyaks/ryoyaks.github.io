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
        {/* Top-left identity */}
        {hero && (
          <div className="md:pt-32 pt-24 relative z-10">
            <p className="text-sm md:text-base tracking-wide opacity-80">{hero.eyebrow}</p>
            <h1 className="font-black leading-[0.95] mt-2 text-6xl md:text-8xl">
              {hero.name}
            </h1>
            {hero.divider && (
              <div className="mt-1 text-4xl md:text-6xl font-black opacity-70 leading-none">
                {hero.divider}
              </div>
            )}
          </div>
        )}

        {/* 3D background */}
        <div className="absolute inset-0 z-0">
          <CanvasErrorBoundary>
            <HeroExperience />
          </CanvasErrorBoundary>
        </div>

        {/* Bottom-right big title — the "稱謂" */}
        {hero?.bigTitle && (
          <div className="absolute bottom-12 right-0 z-10 w-full text-right pr-5 md:pr-0 pointer-events-none">
            <h2 className="font-black leading-[0.9] tracking-tight text-5xl md:text-8xl lg:text-9xl">
              {hero.bigTitle}
            </h2>
          </div>
        )}

        {/* Bottom-left Explore */}
        {hero?.exploreLabel && (
          <a
            href="#links"
            className="absolute bottom-10 left-5 md:left-0 z-10 flex flex-col items-start gap-2"
          >
            <span className="text-xs md:text-sm tracking-[0.15em] opacity-80">{hero.exploreLabel}</span>
            <span className="text-xl animate-bounce">↓</span>
          </a>
        )}
      </div>
    </section>
  );
};

export default Hero;
