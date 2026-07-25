import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { releaseIntro } from "../lib/intro";

// A cluster of retro Win95-style error/dialog popups (Y2K aesthetic, violet
// palette). They pop in stacked; the front loader window runs the boot log +
// progress bar. At 100% every window snaps shut and the hero's pull-apart takes
// over (via releaseIntro).
const WINDOWS = [
  { id: "w1", title: "ERROR", variant: "", x: 58, y: 66, w: 250, rot: -5, icon: "X", msg: "NO SIGNAL", btns: ["RETRY", "CANCEL"] },
  { id: "w2", title: "STUDIO.SYS", variant: "dark", x: 540, y: 52, w: 268, rot: 4, icon: "!", msg: "CREATIVE OVERLOAD", btns: ["OK"] },
  { id: "w3", title: "SUBJECT_006.PNG", variant: "", x: 44, y: 336, w: 208, rot: -3, thumb: true },
  { id: "w4", title: "COMMISSIONS.EXE", variant: "dark", x: 236, y: 456, w: 288, rot: 3, msg: "OPEN FOR WORK", btns: ["ACCEPT", "LATER"] },
  { id: "w5", title: "ERROR", variant: "dark", x: 626, y: 396, w: 244, rot: -5, msgBig: "CONTINUE?", btns: ["YES"] },
  { id: "w6", title: "WARNING", variant: "", x: 702, y: 214, w: 188, rot: 6, icon: "!", msg: "STAY WEIRD", btns: ["OK"] },
];

const LOG = [
  ["init aurora.shader", "ok"],
  ["rig subject_006", "ok"],
  ["mount sections", "ok"],
];

export default function BootIntro() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = root.querySelector(".boot-stage");
    const wins = gsap.utils.toArray(root.querySelectorAll(".boot-win"));
    const fill = root.querySelector(".boot-fill");
    const pct = root.querySelector(".boot-pct");
    const live = root.querySelector(".boot-live");

    // scale the fixed 960×680 stage down to fit small viewports
    const fit = () => {
      const s = Math.min(1, (window.innerWidth - 32) / 960, (window.innerHeight - 32) / 680);
      stage.style.transform = `scale(${s})`;
    };
    fit();
    window.addEventListener("resize", fit);

    // explicit initial state per window (rotation kept while opacity/scale animate)
    wins.forEach((w) =>
      gsap.set(w, { rotation: Number(w.dataset.rot) || 0, transformOrigin: "50% 50%", opacity: 0, scale: 0.82 }),
    );
    gsap.set(live, { opacity: 0 });

    const progress = { p: 0 };
    const onUpdate = () => {
      fill.style.width = progress.p + "%";
      pct.textContent = Math.round(progress.p) + "%";
    };

    // absolute time positions — no relative "<"/">" so nothing clobbers the reveal
    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    tl.to(wins, { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(1.5)", stagger: 0.08 }, 0.1);
    tl.to(progress, { p: 100, duration: 1.5, ease: "power1.inOut", onUpdate }, 0.95);
    tl.to(live, { opacity: 1, duration: 0.22 }, 2.5);
    tl.call(releaseIntro, undefined, 2.95); // windows snap shut → hero pull-apart begins
    tl.to(wins, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in", stagger: { each: 0.045, from: "end" } }, 2.95);
    tl.to(root, { opacity: 0, duration: 0.32 }, 3.12);

    const fallback = setTimeout(releaseIntro, 6000); // safety if the tl is cut
    return () => {
      tl.kill();
      clearTimeout(fallback);
      window.removeEventListener("resize", fit);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={rootRef} className="boot-overlay" aria-hidden="true">
      <div className="boot-stage">
        {WINDOWS.map((w) => (
          <div
            key={w.id}
            className={`boot-win ${w.variant}`}
            data-rot={w.rot}
            style={{ left: w.x, top: w.y, width: w.w }}
          >
            <div className="boot-bar">
              <span className="boot-title">{w.title}</span>
              <span className="boot-x">X</span>
            </div>
            <div className="boot-content">
              {w.thumb ? (
                <img className="boot-thumb" src="/images/logo.webp" alt="" />
              ) : w.msgBig ? (
                <div className="boot-msg big">{w.msgBig}</div>
              ) : (
                <div className="boot-row">
                  {w.icon && <span className="boot-icon">{w.icon}</span>}
                  <span className="boot-msg">{w.msg}</span>
                </div>
              )}
            </div>
            {w.btns && (
              <div className="boot-btns">
                {w.btns.map((b) => (
                  <span key={b} className="boot-btn">{b}</span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* front loader window — the log + progress bar */}
        <div className="boot-win boot-loader" data-rot="0" style={{ left: 320, top: 206, width: 340 }}>
          <div className="boot-bar">
            <span className="boot-title">RYOYAKS_STUDIO.SYS</span>
            <span className="boot-x">X</span>
          </div>
          <div className="boot-content">
            <div className="boot-log">
              {LOG.map(([k, v]) => (
                <div key={k}>&gt; {k} <b>{v}</b></div>
              ))}
            </div>
            <div className="boot-load-label">LOADING...</div>
            <div className="boot-meter">
              <div className="boot-track"><div className="boot-fill" /></div>
              <span className="boot-pct">0%</span>
            </div>
            <div className="boot-live"><span className="dot" /> LIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
