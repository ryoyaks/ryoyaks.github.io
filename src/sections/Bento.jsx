import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import SectionHeader from "../components/SectionHeader";
import VideoCard from "../components/VideoCard";
import { iconsList } from "../constants";
import { useContent } from "../hooks/useContent";

const isInternalRoute = (href) => href && href.startsWith("/") && !href.startsWith("//");

const Bento = () => {
  const gridRef = useRef(null);
  const main = useContent("main");
  const projects = useContent("projects", { featured: null, more: [] });

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !gridRef.current) return;

    const tiles = gridRef.current.querySelectorAll("[data-bento-tile]");
    gsap.fromTo(
      tiles,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }
    );
  }, [main, projects]);

  const about = main?.about;
  const status = main?.status;
  const tools = main?.tools;
  const contact = main?.contact;
  const featured = projects?.featured;
  const more = projects?.more || [];

  return (
    <section id="works" className="relative md:p-0 px-5 py-20 md:py-32 text-[var(--fg)]">
      <div className="container mx-auto">
        <SectionHeader number="02" eyebrow="Works" headline="About, work & tools" />

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[160px] gap-3 md:gap-4"
        >
          {/* About */}
          <div
            data-bento-tile
            id="about"
            className="md:col-span-3 md:row-span-2 bg-[var(--bg-elev)] border border-[var(--border)] rounded-md p-6 md:p-7 flex flex-col justify-between min-h-[260px]"
          >
            {about && (
              <>
                <div>
                  <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase">{about.eyebrow}</div>
                  <h3 className="text-xl md:text-2xl font-bold mt-2 leading-snug">
                    {about.headline}
                  </h3>
                  <p className="text-sm md:text-base opacity-70 mt-3 leading-relaxed">{about.body}</p>
                </div>
                <div className="flex gap-2 flex-wrap mt-4">
                  {about.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--border)] px-3 py-1 rounded-sm text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Featured */}
          {(() => {
            const featuredHref = featured?.href || "#works";
            const useRouterLink = isInternalRoute(featuredHref);
            const Tag = useRouterLink ? Link : "a";
            const tagProps = useRouterLink ? { to: featuredHref } : { href: featuredHref };
            return (
          <Tag
            data-bento-tile
            id="projects"
            {...tagProps}
            className="md:col-span-3 md:row-span-2 relative rounded-md overflow-hidden border border-[var(--border)] min-h-[260px] block group"
          >
            {featured && (
              <>
                <video
                  src={featured.video}
                  poster={featured.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Left + right edge fades to theme bg (frame the video) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to right, var(--bg) 0%, var(--bg) 8%, transparent 35%)",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to left, var(--bg) 0%, var(--bg) 8%, transparent 35%)",
                  }}
                />
                {/* Stronger bottom + top darkening so header and CTA stay readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/55 pointer-events-none" />
                <div className="relative z-10 h-full p-6 md:p-7 flex flex-col justify-between text-[var(--fg)]">
                  <div>
                    <div className="text-[10px] tracking-[0.2em] opacity-80 uppercase">Featured Project</div>
                    {featured.logo ? (
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={featured.logo}
                          alt={featured.name}
                          className="h-10 md:h-12 w-10 md:w-12 object-contain"
                        />
                        <h3 className="text-2xl md:text-3xl font-black">{featured.name}</h3>
                      </div>
                    ) : (
                      <h3 className="text-2xl md:text-3xl font-black mt-2">{featured.name}</h3>
                    )}
                    <p className="text-sm opacity-90 mt-3 max-w-md leading-relaxed">{featured.tagline}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                    {featured.ctaLabel || "Read more →"}
                  </div>
                </div>
              </>
            )}
          </Tag>
            );
          })()}

          {/* Tools */}
          <div
            data-bento-tile
            id="tools"
            className="md:col-span-3 bg-[var(--bg-elev)] border border-[var(--border)] rounded-md p-5 md:p-6"
          >
            {tools && (
              <>
                <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase">{tools.eyebrow}</div>
                <div className="flex gap-3 md:gap-4 mt-3 items-center flex-wrap">
                  {tools.order?.map((key) => {
                    const icon = iconsList.find((i) => i.name === key);
                    if (!icon) return null;
                    return (
                      <div
                        key={key}
                        className="w-11 h-11 rounded-md overflow-hidden flex items-center justify-center bg-[var(--bg)] border border-[var(--border)] tool-shine"
                      >
                        <img src={icon.image} alt={icon.name} className="w-7 h-7 object-contain" />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Status */}
          <div
            data-bento-tile
            className="md:col-span-2 bg-[var(--bg-elev)] border border-[var(--border)] rounded-md p-5 md:p-6"
          >
            {status && (
              <>
                <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase">{status.eyebrow}</div>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.active ? "bg-emerald-400" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm font-semibold">{status.label}</span>
                </div>
                <p className="text-xs opacity-60 mt-1">{status.subLabel}</p>
              </>
            )}
          </div>

          {/* Contact CTA */}
          <a
            data-bento-tile
            id="contact"
            href={contact?.mailto ? `mailto:${contact.mailto}` : "#"}
            className="md:col-span-1 rounded-md p-5 md:p-6 flex flex-col justify-between bg-[var(--fg)] text-[var(--bg)]"
          >
            {contact && (
              <>
                <div className="text-[10px] tracking-[0.2em] opacity-70 uppercase">{contact.eyebrow}</div>
                <div className="text-xl md:text-2xl font-black leading-tight whitespace-pre-line">
                  {contact.label}
                </div>
              </>
            )}
          </a>
        </div>

        {/* More projects sub-grid */}
        {more.length > 0 && (
          <div className="mt-12 md:mt-16">
            <div className="flex justify-between items-end mb-5">
              <div className="text-[11px] tracking-[0.2em] opacity-60 uppercase">More work</div>
              <div className="text-xs opacity-40">{more.length} in the pipeline</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {more.map((p) => (
                <div
                  key={p.id}
                  className={`border border-dashed border-[var(--border)] rounded-md p-5 md:p-6 min-h-[120px] flex flex-col justify-between ${
                    p.placeholder ? "opacity-60" : ""
                  }`}
                >
                  <div>
                    <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase">
                      {p.placeholder ? "TBD" : "Project"}
                    </div>
                    <h4 className="text-base md:text-lg font-bold mt-2">{p.name}</h4>
                    <p className="text-xs md:text-sm opacity-60 mt-1 leading-relaxed">{p.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Bento;
