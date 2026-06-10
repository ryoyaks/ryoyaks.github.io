import VideoCard from "../components/VideoCard";
import { useContent } from "../hooks/useContent";

const SyncRig = () => {
  const data = useContent("syncrig");

  if (!data) {
    return <section className="min-h-dvh" />;
  }

  const {
    hero,
    problem,
    howItWorks,
    features,
    useCases,
    demo,
    tutorials,
    integrations,
    updates,
    pricing,
    faq,
    waitlist,
  } = data;

  return (
    <main className="relative md:p-0 px-5 pt-28 md:pt-32 pb-20 md:pb-32 text-[var(--fg)]">
      <div className="container mx-auto">

        {/* 1. Product Hero */}
        {hero && (
          <section className="relative h-[60vh] md:h-[70vh] min-h-[420px] overflow-hidden rounded-md border border-[var(--border)] mb-16 md:mb-24">
            <video
              src={hero.video}
              poster={hero.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "75% center" }}
            />
            {/* Strong left-to-right gradient so headline reads against video */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none" />
            {/* Light bottom fade for the CTAs */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 text-white">
              <div className="text-[10px] md:text-xs tracking-[0.3em] opacity-80 uppercase">{hero.eyebrow}</div>
              <div className="flex items-center gap-4 mt-3">
                {hero.logo && (
                  <img
                    src={hero.logo}
                    alt="SyncRig"
                    className="h-14 md:h-20 w-14 md:w-20 object-contain"
                  />
                )}
                <div className="text-3xl md:text-5xl font-black tracking-tight">SyncRig</div>
              </div>
              <h1 className="text-3xl md:text-6xl font-black mt-4 leading-tight max-w-3xl">{hero.headline}</h1>
              <p className="text-sm md:text-lg opacity-90 mt-4 max-w-2xl leading-relaxed">{hero.body}</p>
              <div className="flex gap-3 mt-6 flex-wrap">
                {hero.ctas?.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={
                      cta.variant === "solid"
                        ? "bg-white text-black px-5 py-2.5 rounded-md font-semibold text-sm"
                        : "border border-white/40 px-5 py-2.5 rounded-md text-sm"
                    }
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2. Problem */}
        {problem && (
          <section className="mb-16 md:mb-24 max-w-3xl">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{problem.eyebrow}</div>
            <h2 className="text-2xl md:text-4xl font-black mt-3 leading-tight">{problem.headline}</h2>
            <p className="text-base md:text-lg opacity-75 mt-4 leading-relaxed">{problem.body}</p>
          </section>
        )}

        {/* 3. How it works */}
        {howItWorks && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{howItWorks.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-8 md:mb-10">{howItWorks.headline}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {howItWorks.steps?.map((s) => (
                <div key={s.n} className="border border-[var(--border)] rounded-md p-6 md:p-7 bg-[var(--bg-elev)]">
                  <div className="text-3xl md:text-4xl font-black opacity-30">{s.n}</div>
                  <h3 className="text-lg md:text-xl font-bold mt-3">{s.title}</h3>
                  <p className="text-sm opacity-70 mt-2 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Features */}
        {features && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{features.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-8 md:mb-10">{features.headline}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {features.items?.map((f) => (
                <div
                  key={f.title}
                  className={`border border-[var(--border)] rounded-md p-5 md:p-6 bg-[var(--bg-elev)] ${
                    f.planned ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base md:text-lg font-bold">{f.title}</h3>
                    {f.planned && (
                      <span className="text-[10px] tracking-[0.2em] uppercase opacity-60">Planned</span>
                    )}
                  </div>
                  <p className="text-sm opacity-70 mt-2 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Use cases — grid of poster-backed video cards */}
        {useCases && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{useCases.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-8 md:mb-10 max-w-3xl">{useCases.headline}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {useCases.items?.map((u) => (
                <div
                  key={u.id}
                  className="relative aspect-video rounded-md overflow-hidden border border-[var(--border)] group"
                >
                  {u.video && u.poster && (
                    <VideoCard poster={u.poster} src={u.video} className="absolute inset-0" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                  <div className="relative z-10 h-full p-5 md:p-7 flex flex-col justify-end text-white">
                    {u.placeholder && (
                      <div className="text-[10px] tracking-[0.2em] opacity-70 uppercase mb-2">Placeholder video</div>
                    )}
                    <h3 className="text-lg md:text-2xl font-black">{u.title}</h3>
                    <p className="text-sm opacity-85 mt-2 max-w-md leading-relaxed">{u.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Demo */}
        {demo && (
          <section id="syncrig-demo" className="mb-16 md:mb-24 scroll-mt-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{demo.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-8">{demo.headline}</h2>
            <div className="relative aspect-video rounded-md overflow-hidden border border-[var(--border)] bg-black">
              <VideoCard poster={demo.poster} src={demo.video} className="absolute inset-0" />
            </div>
            {demo.caption && <p className="text-sm opacity-60 mt-3">{demo.caption}</p>}
          </section>
        )}

        {/* 7. Tutorials — placeholder slots for many videos */}
        {tutorials && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{tutorials.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3">{tutorials.headline}</h2>
            {tutorials.subline && <p className="text-sm md:text-base opacity-70 mt-2 max-w-2xl">{tutorials.subline}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-8">
              {tutorials.items?.map((t) => (
                <div
                  key={t.id}
                  className={`border border-[var(--border)] rounded-md overflow-hidden bg-[var(--bg-elev)] ${
                    t.placeholder ? "opacity-70" : ""
                  }`}
                >
                  <div className="relative aspect-video bg-black">
                    {t.poster && (
                      <img src={t.poster} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    )}
                    {t.placeholder && (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.2em] uppercase text-white/80">
                        Coming soon
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="text-sm md:text-base font-bold leading-snug">{t.title}</h3>
                    {t.duration && <div className="text-xs opacity-50 mt-1">{t.duration}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Integrations */}
        {integrations && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{integrations.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-8">{integrations.headline}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {integrations.items?.map((i) => (
                <div
                  key={i.name}
                  className={`border border-[var(--border)] rounded-md p-4 md:p-5 ${
                    i.status === "Roadmap" ? "opacity-60" : ""
                  }`}
                >
                  <div className="text-sm md:text-base font-bold">{i.name}</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase mt-1 opacity-60">{i.status}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. Updates / changelog placeholder */}
        {updates && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{updates.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3">{updates.headline}</h2>
            {updates.subline && <p className="text-sm md:text-base opacity-70 mt-2 max-w-2xl">{updates.subline}</p>}
            <div className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {updates.items?.map((u) => (
                <div key={u.id} className={`py-5 md:py-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 ${u.placeholder ? "opacity-60" : ""}`}>
                  <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase md:w-24 md:flex-shrink-0">{u.date}</div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold">{u.title}</h3>
                    {u.body && <p className="text-sm opacity-70 mt-1 leading-relaxed">{u.body}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. Pricing placeholder */}
        {pricing && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{pricing.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-3">{pricing.headline}</h2>
            <p className="text-base opacity-70 max-w-2xl leading-relaxed">{pricing.body}</p>
          </section>
        )}

        {/* 11. FAQ */}
        {faq && (
          <section className="mb-16 md:mb-24">
            <div className="text-[10px] tracking-[0.3em] opacity-60 uppercase">{faq.eyebrow}</div>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-8">{faq.headline}</h2>
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {faq.items?.map((item) => (
                <details key={item.q} className="group py-4 md:py-5">
                  <summary className="cursor-pointer list-none flex justify-between items-center text-base md:text-lg font-semibold">
                    {item.q}
                    <span className="text-xl opacity-50 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm md:text-base opacity-70 mt-3 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* 12. Waitlist CTA */}
        {waitlist && (
          <section
            id="syncrig-waitlist"
            className="scroll-mt-24 rounded-md bg-[var(--fg)] text-[var(--bg)] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="max-w-md">
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-70">{waitlist.eyebrow}</div>
              <h2 className="text-2xl md:text-3xl font-black mt-2 leading-tight">{waitlist.headline}</h2>
              <p className="text-sm md:text-base opacity-75 mt-2">{waitlist.body}</p>
            </div>
            <a
              href={`mailto:${waitlist.mailto}${waitlist.mailtoSubject ? `?subject=${encodeURIComponent(waitlist.mailtoSubject)}` : ""}`}
              className="bg-[var(--bg)] text-[var(--fg)] px-6 py-3 rounded-md font-semibold text-sm whitespace-nowrap"
            >
              {waitlist.ctaLabel || "Notify me →"}
            </a>
          </section>
        )}
      </div>
    </main>
  );
};

export default SyncRig;
