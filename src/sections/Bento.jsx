import { useEffect, useRef } from "react";
import gsap from "gsap";
import SectionHeader from "../components/SectionHeader";
import VideoCard from "../components/VideoCard";
import { iconsList } from "../constants";

const TOOL_ORDER = [
  "blender", "photoshop", "illustrator", "clipstudiopaint", "procreate",
  "unity", "unreal", "figma", "mrtk", "quest", "openxr",
];

const Bento = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !gridRef.current) return;

    const tiles = gridRef.current.querySelectorAll("[data-bento-tile]");
    gsap.fromTo(
      tiles,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
      }
    );
  }, []);

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
            <div>
              <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase">ABOUT</div>
              <h3 className="text-xl md:text-2xl font-bold mt-2 leading-snug">
                A multi-disciplinary creator from Taiwan
              </h3>
              <p className="text-sm md:text-base opacity-70 mt-3 leading-relaxed">
                {/* PLACEHOLDER — user writes bio later */}
                I draw, sculpt and code. My day moves between Procreate, Blender, and Python — character illustration on one screen, motion-capture research on the other.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap mt-4">
              <span className="border border-[var(--border)] px-3 py-1 rounded-sm text-xs">Illustration</span>
              <span className="border border-[var(--border)] px-3 py-1 rounded-sm text-xs">3D / VRM</span>
              <span className="border border-[var(--border)] px-3 py-1 rounded-sm text-xs">CV · HCI</span>
              <span className="border border-[var(--border)] px-3 py-1 rounded-sm text-xs">Open to commissions</span>
            </div>
          </div>

          {/* Featured · SyncRig */}
          <div
            data-bento-tile
            id="projects"
            className="md:col-span-3 md:row-span-2 relative rounded-md overflow-hidden border border-[var(--border)] min-h-[260px]"
          >
            <VideoCard
              poster="/syncrig-poster.webp"
              src="/syncrig-demo.webm"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20 pointer-events-none" />
            <div className="relative z-10 h-full p-6 md:p-7 flex flex-col justify-between text-white">
              <div>
                <div className="text-[10px] tracking-[0.2em] opacity-80 uppercase">Featured Project</div>
                <h3 className="text-2xl md:text-3xl font-black mt-2">SyncRig</h3>
                <p className="text-sm opacity-90 mt-3 max-w-md leading-relaxed">
                  Open-source motion-capture &amp; 3D pose reference for creators. Drop in a photo, video, or webcam — get an editable 3D pose. Exports to Blender, broadcasts via VMC.
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://github.com/ryoyaks/SyncRig"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-black px-4 py-2 rounded-md text-xs font-semibold"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://github.com/ryoyaks/SyncRig/releases/latest"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-white/40 px-4 py-2 rounded-md text-xs"
                >
                  Latest Release ↗
                </a>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div
            data-bento-tile
            id="tools"
            className="md:col-span-3 bg-[var(--bg-elev)] border border-[var(--border)] rounded-md p-5 md:p-6"
          >
            <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase">Tools I Use</div>
            <div className="flex gap-3 md:gap-4 mt-3 items-center flex-wrap">
              {TOOL_ORDER.map((key) => {
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
          </div>

          {/* Status */}
          <div
            data-bento-tile
            className="md:col-span-2 bg-[var(--bg-elev)] border border-[var(--border)] rounded-md p-5 md:p-6"
          >
            <div className="text-[10px] tracking-[0.2em] opacity-60 uppercase">Status</div>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold">Open for commissions</span>
            </div>
            <p className="text-xs opacity-60 mt-1">Email or Marshmallow for inquiries</p>
          </div>

          {/* Contact CTA */}
          <a
            data-bento-tile
            id="contact"
            href="mailto:ryoyaillust892763@gmail.com"
            className="md:col-span-1 rounded-md p-5 md:p-6 flex flex-col justify-between bg-[var(--fg)] text-[var(--bg)]"
          >
            <div className="text-[10px] tracking-[0.2em] opacity-70 uppercase">Contact</div>
            <div className="text-xl md:text-2xl font-black leading-tight">
              Get in
              <br />
              touch →
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Bento;
