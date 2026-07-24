import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import AuroraBackground from "../components/AuroraBackground";

// The locked "G3 shader (violet)" hero — flexible, edge-anchored layout.
// Elements pin to the viewport corners/edges and scale fluidly (see the
// .g3h-* rules in index.css), so the composition fills any screen rather
// than being letterboxed inside a fixed 1440×900 stage.
const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 導覽標籤來自定案設計，接到真實目的地：站內錨點 + /links 路由。
const NAV = [
  { label: "ABOUT", to: "#about" },
  { label: "LINKS", to: "/links", route: true },
  { label: "ARTS", to: "#works" },
  { label: "PROJECTS", to: "#works" },
  { label: "CONTACT", to: "#contact" },
];

export default function HeroG3() {
  const reduced = reduceMotion();
  const rootRef = useRef(null);
  const badgeRef = useRef(null);
  const markRef = useRef(null);

  // Perf: the aurora is a full-screen fragment shader — expensive to redraw
  // every frame. Only run it while the hero is actually on screen; once it
  // scrolls away we stop the render loop entirely (frameloop="never").
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Intro (art-yakushev "pull-apart"): the side badge and the mark start
  // together at centre, then separate outward to their edges while the rest
  // fades in. Uses fromTo with viewport-derived offsets (not measured) so it
  // is immune to StrictMode's double-invoke, and useLayoutEffect so the
  // hidden content never flashes before the animation is set up.
  useLayoutEffect(() => {
    const badge = badgeRef.current;
    const mark = markRef.current;
    if (!badge || !mark) return;

    const rest = rootRef.current.querySelectorAll(
      ".g3h-el:not(.g3h-badge):not(.g3h-mark), .g3h-char, .g3h-marqwrap, .g3h-hair, .g3h-scrim",
    );

    if (reduced) {
      gsap.set([badge, mark], { yPercent: -50, x: 0 });
      gsap.set(rest, { opacity: 1 });
      return;
    }

    const half = window.innerWidth / 2;
    const badgeFrom = half - 34; // badge (home: left edge) → just left of centre
    const markFrom = -(half - 88); // mark (home: right edge) → just right of centre

    gsap.set([badge, mark], { yPercent: -50 });
    gsap.set(rest, { opacity: 0 });

    const tl = gsap.timeline();
    tl.fromTo(badge, { x: badgeFrom }, { x: 0, duration: 1.1, ease: "power3.inOut" }, 0.3)
      .fromTo(mark, { x: markFrom }, { x: 0, duration: 1.1, ease: "power3.inOut" }, 0.3)
      .to(rest, { opacity: 1, duration: 0.65, stagger: 0.05, ease: "power2.out" }, "-=0.4");

    return () => tl.kill();
  }, [reduced]);

  return (
    <section className="g3h" aria-label="Hero" ref={rootRef}>
      {/* full-bleed background */}
      <div className="g3h-aurora">
        <AuroraBackground reduced={reduced} active={onScreen} />
        <div className="g3h-veil" />
      </div>
      <div className="g3h-door-l" /><div className="g3h-seam-l" />
      <div className="g3h-door-r" /><div className="g3h-seam-r" />

      {/* character — centred, bleeds top/bottom, sits in the aurora */}
      <img className="g3h-char" src="/hero/yak-object.png" alt="" aria-hidden="true" />

      {/* giant faint marquee — infinite left scroll */}
      <div className="g3h-marqwrap">
        <div className="g3h-marqtrack g3-marq">
          <span>ILLUSTRATION&nbsp;&nbsp;MOCAP&nbsp;&nbsp;RIGGING&nbsp;&nbsp;TOOLING&nbsp;&nbsp;</span>
          <span>ILLUSTRATION&nbsp;&nbsp;MOCAP&nbsp;&nbsp;RIGGING&nbsp;&nbsp;TOOLING&nbsp;&nbsp;</span>
        </div>
      </div>

      <div className="g3h-scrim" />
      <div className="g3h-hair" />

      {/* corners + edges */}
      <div className="g3h-el g3h-wordmark"><b>RYS</b><i>©</i></div>

      <nav className="g3h-el g3h-nav" aria-label="Sections">
        {NAV.map((item) =>
          item.route ? (
            <Link key={item.label} to={item.to}>{item.label}</Link>
          ) : (
            <a key={item.label} href={item.to}>{item.label}</a>
          ),
        )}
      </nav>

      <div className="g3h-el g3h-kicker">( ILLUSTRATION · MOCAP · RIG TOOLING )</div>

      <div className="g3h-el g3h-caption">
        <div className="a">SUBJECT · 006</div>
        <div className="b">TORUS / CHROME</div>
        <div className="b">RENDER PASS 04</div>
      </div>

      <div className="g3h-el g3h-badge" ref={badgeRef}><b>R.</b><s>Illustration</s></div>

      <div className="g3h-el g3h-id">
        <div className="nm">RyoyakS — [りょうや・六亞]</div>
        <div className="rl">illustration · 3d · tools</div>
        <div className="ml">
          <span>Commissions, collabs, questions</span>
          <a href="mailto:ryoyaillust892763@gmail.com" style={{ fontStyle: "italic", color: "#bfbfbf" }}>Write</a>
        </div>
      </div>

      <div className="g3h-el g3h-creative">
        <h2>CREATIVE<br />STUDIO</h2>
        <p>One person — illustrating characters and building the tools that rig and animate them. From first concept to shipped software.</p>
      </div>

      <div className="g3h-el g3h-num">006</div>
      <img className="g3h-el g3h-mark" src="/images/logo.webp" alt="RyoyakS" ref={markRef} />

      <div className="g3h-el g3h-spec">
        <div className="r"><span>SPEC</span><span>v0.4</span></div>
        <div className="t">Projects</div>
        <div className="d" />
        <div className="r"><span>STATUS</span><span className="live">● LIVE</span></div>
      </div>

      <div className="g3h-el g3h-colophon">{"RYOYAKS STUDIO — ILLUSTRATION & RIG TOOLING\n六亞 RyoyakS · 2026 ©"}</div>

      <div className="g3h-el g3h-index">
        <span className="v">⟪</span>
        <span className="c">01 / 04</span>
        <span className="v">⟫</span>
      </div>
    </section>
  );
}
