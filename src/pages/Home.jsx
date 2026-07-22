import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import CanvasErrorBoundary from "../components/CanvasErrorBoundary";
import HeroExperience from "../components/HeroExperience";
import SectionHeader from "../components/SectionHeader";
import { iconsList } from "../constants";
import { useContent } from "../hooks/useContent";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// main.json 的 tools.order 只有 icon key，這裡補上可讀的標籤。
const TOOL_LABELS = {
  blender: "Blender",
  photoshop: "Photoshop",
  illustrator: "Illustrator",
  clipstudiopaint: "Clip Studio",
  procreate: "Procreate",
  unity: "Unity",
  unreal: "Unreal",
  figma: "Figma",
};

// 巨型文字即圖像：整頁只有三種字級——Hero 的名字、區塊標題、內文。
const GIANT = "font-black uppercase leading-[0.84] tracking-[-0.035em]";
const RULE = "text-[11px] tracking-[0.25em] uppercase opacity-60";

const Home = () => {
  const heroRef = useRef(null);
  const main = useContent("main");
  const projects = useContent("projects");

  const hero = main?.hero;
  const about = main?.about;
  const status = main?.status;
  const tools = main?.tools;
  const contact = main?.contact;
  const featured = projects?.featured;
  const more = projects?.more || [];

  // 唯一的動效：Hero 進場。捲動治療層是第 5 階段的事，這裡刻意不做。
  useEffect(() => {
    if (reduceMotion() || !heroRef.current) return;
    const items = heroRef.current.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.09 }
    );
    return () => tween.kill();
  }, [hero]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView?.({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  };

  return (
    <main className="text-[var(--fg)]">
      {/* ——  Hero：身分。靜止截圖就是一張海報。 */}
      <section
        id="hero"
        ref={heroRef}
        className="min-h-dvh flex flex-col px-5 md:px-0 pt-24 md:pt-32 pb-6 md:pb-8"
      >
        <div className="container mx-auto flex-1 flex flex-col">
          <div
            data-reveal
            className={`flex items-baseline justify-between gap-4 border-b border-[var(--border)] pb-3 ${RULE}`}
          >
            <span>{hero?.eyebrow}</span>
            <span className="text-right">{hero?.roles}</span>
          </div>

          <div className="relative flex-1 flex flex-col justify-between gap-10 md:gap-0 pt-8 md:pt-12">
            {/* Avatar：被排進版面的元素，不是背景。有明確的框與尺寸，
                並與巨型文字有刻意的疊壓關係（文字在前）。 */}
            <div
              data-reveal
              className="order-2 self-end w-[62%] max-w-[240px]
                         md:order-none md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2
                         md:w-[32vw] md:max-w-[400px]"
            >
              <figure className="relative aspect-[3/4] overflow-hidden border border-[var(--fg)] bg-[var(--bg-elev)]">
                <figcaption className={`absolute left-3 top-3 z-10 ${RULE}`}>Avatar</figcaption>
                <div className="absolute inset-0">
                  <CanvasErrorBoundary>
                    <HeroExperience />
                  </CanvasErrorBoundary>
                </div>
              </figure>
            </div>

            <div className="order-1 relative z-10 md:pointer-events-none">
              <h1 data-reveal className={`${GIANT} text-[clamp(4rem,13vw,11rem)]`}>
                {hero?.name}
              </h1>
              {hero?.altNames && (
                <p data-reveal className="mt-4 text-xl md:text-3xl font-medium opacity-80">
                  {hero.altNames}
                </p>
              )}
            </div>

            {hero?.bigTitle && (
              <h2
                data-reveal
                className={`order-3 relative z-10 md:pointer-events-none ${GIANT} text-[clamp(2rem,8vw,8rem)]`}
              >
                {hero.bigTitle}
              </h2>
            )}
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-[var(--border)] pt-3 mt-8">
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className={`${RULE} flex items-center gap-2 hover:opacity-100 transition-opacity
                          focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fg)]`}
            >
              {hero?.exploreLabel || "Explore"}
              <span aria-hidden="true">↓</span>
            </button>
            <span className={RULE}>{hero?.flourish}</span>
          </div>
        </div>
      </section>

      {/* ——  01 About：是誰、在做什麼、接不接案 */}
      <section id="about" className="px-5 md:px-0 py-20 md:py-32">
        <div className="container mx-auto">
          <SectionHeader number="01" eyebrow="About" headline={about?.headline} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 border-t border-[var(--border)] pt-8">
            <div className="md:col-span-7">
              <p className="text-base md:text-xl leading-relaxed opacity-80 max-w-2xl">
                {about?.body}
              </p>
              {about?.tags?.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-7">
                  {about.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-[var(--border)] px-3 py-1 text-[11px] tracking-[0.15em] uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {status && (
              <div className="md:col-span-4 md:col-start-9 border border-[var(--border)] bg-[var(--bg-elev)] p-5 md:p-6 h-fit">
                <div className={RULE}>{status.eyebrow}</div>
                <div className="flex items-center gap-2 mt-4">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.active ? "bg-emerald-500" : "bg-[var(--fg-muted)]"
                    }`}
                  />
                  <span className="text-base font-semibold">{status.label}</span>
                </div>
                <p className="text-xs opacity-60 mt-2 leading-relaxed">{status.subLabel}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ——  02 Tools：八格網格，像規格表而不是圖示牆 */}
      <section id="tools" className="px-5 md:px-0 pb-20 md:pb-32">
        <div className="container mx-auto">
          <SectionHeader number="02" eyebrow="Tools" headline={tools?.eyebrow || "Tools I use"} />

          <div className="grid grid-cols-4 md:grid-cols-8 border-t border-l border-[var(--border)]">
            {(tools?.order || []).map((key) => {
              const icon = iconsList.find((i) => i.name === key);
              if (!icon) return null;
              return (
                <div
                  key={key}
                  className="border-r border-b border-[var(--border)] aspect-square
                             flex flex-col items-center justify-center gap-3 px-1
                             hover:bg-[var(--bg-elev)] transition-colors"
                >
                  <img
                    src={icon.image}
                    alt=""
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                  />
                  <span className="text-[10px] tracking-[0.15em] uppercase opacity-60 text-center">
                    {TOOL_LABELS[key] || key}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ——  03 Works：一個精選 ＋ 三個具名進行中 */}
      <section id="works" className="px-5 md:px-0 pb-20 md:pb-32">
        <div className="container mx-auto">
          <SectionHeader
            number="03"
            eyebrow="Works"
            headline="Things I'm building"
            caption={more.length > 0 ? `${more.length} in progress` : undefined}
          />

          {featured && (
            <Link
              to={featured.href}
              className="group block border border-[var(--border)] bg-[var(--bg-elev)]
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
            >
              <div className="grid md:grid-cols-12">
                <div className="md:col-span-8 relative aspect-video overflow-hidden border-b md:border-b-0 md:border-r border-[var(--border)]">
                  <video
                    src={featured.video}
                    poster={featured.poster}
                    autoPlay={!reduceMotion()}
                    controls={reduceMotion()}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-4 p-6 md:p-8 flex flex-col justify-between gap-8">
                  <div>
                    <div className={RULE}>Featured</div>
                    <div className="flex items-center gap-3 mt-3">
                      {featured.logo && (
                        <img src={featured.logo} alt="" className="h-9 w-9 object-contain" />
                      )}
                      <h3 className={`${GIANT} text-3xl md:text-4xl`}>{featured.name}</h3>
                    </div>
                    <p className="text-sm md:text-base opacity-70 mt-4 leading-relaxed">
                      {featured.tagline}
                    </p>
                  </div>

                  <div>
                    {featured.tags?.length > 0 && (
                      <ul className="flex flex-wrap gap-2">
                        {featured.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border border-[var(--border)] px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase opacity-70"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold group-hover:gap-3 transition-all">
                      {featured.ctaLabel || "Read more →"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {more.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[var(--border)] mt-6 md:mt-8">
              {more.map((project) => (
                <article
                  key={project.id}
                  className="border-r border-b border-[var(--border)] p-6 md:p-7
                             min-h-[170px] flex flex-col justify-between gap-6"
                >
                  <div>
                    <h4 className="text-lg md:text-xl font-bold leading-tight">{project.name}</h4>
                    <p className="text-sm opacity-70 mt-2 leading-relaxed">{project.tagline}</p>
                  </div>
                  {project.status === "wip" && (
                    <span className="self-start inline-flex items-center gap-2 border border-[var(--border)] px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      In progress
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ——  Contact：大型 CTA，交棒給 footer */}
      <section id="contact" className="px-5 md:px-0 pb-20 md:pb-28">
        <div className="container mx-auto border-t border-[var(--border)] pt-8">
          <div className={RULE}>{contact?.eyebrow || "Contact"}</div>

          {contact?.mailto && (
            <a
              href={`mailto:${contact.mailto}`}
              className={`block mt-4 whitespace-pre-line ${GIANT} text-[clamp(2.5rem,10vw,8.5rem)]
                          hover:opacity-60 transition-opacity
                          focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fg)]`}
            >
              {contact.label}
            </a>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-[var(--border)] mt-10 pt-5">
            <span className="text-sm opacity-60">{contact?.mailto}</span>
            <Link
              to="/links"
              className="text-sm font-semibold hover:opacity-60 transition-opacity
                         focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fg)]"
            >
              All links →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
