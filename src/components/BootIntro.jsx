import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { releaseIntro } from "../lib/intro";

// Boot-log preloader in the studio's spec/render language. Types a short init
// sequence, then the black terminal curtain slides up to reveal the hero — and
// releaseIntro() fires as it lifts so the hero's pull-apart plays on the reveal.
const LINES = [
  { k: "init aurora.shader", v: "ok" },
  { k: "compile violet.frag", v: "ok" },
  { k: "rig subject_006", v: "ok" },
  { k: "mount sections", v: "ok" },
  { k: "commissions", v: "OPEN" },
  { k: "status", v: "● LIVE" },
];

export default function BootIntro() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const head = root.querySelector(".boot-head");
    const lines = root.querySelectorAll(".boot-line");
    const cursor = root.querySelector(".boot-cursor");

    gsap.set([head, ...lines], { opacity: 0, y: 8 });

    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    tl.to(head, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" })
      .to(lines, { opacity: 1, y: 0, duration: 0.22, stagger: 0.13, ease: "power1.out" }, 0.25)
      .to(cursor, { opacity: 0, duration: 0.3, repeat: 3, yoyo: true }, ">-0.1")
      .call(releaseIntro, undefined, "+=0.15")
      .to(root, { yPercent: -100, duration: 0.75, ease: "power4.inOut" }, "<0.03");

    const fallback = setTimeout(releaseIntro, 4000); // safety if the tl is cut
    return () => {
      tl.kill();
      clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={rootRef} className="boot-overlay" aria-hidden="true">
      <div className="boot-term">
        <div className="boot-head">
          <span className="boot-brand">RYOYAKS STUDIO</span>
          <span className="boot-sub">v0.4 · boot sequence</span>
        </div>
        <div className="boot-body">
          {LINES.map((l) => (
            <div key={l.k} className="boot-line">
              <span className="boot-key">
                <span className="boot-caret">&gt;</span> {l.k}
              </span>
              <span className="boot-dots" />
              <span className={`boot-val ${l.v === "ok" ? "" : "boot-val-hi"}`}>{l.v}</span>
            </div>
          ))}
        </div>
        <div className="boot-foot">
          <span className="boot-caret">&gt;</span> <span className="boot-cursor">▊</span>
        </div>
      </div>
    </div>
  );
}
