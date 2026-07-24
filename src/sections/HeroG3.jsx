import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuroraBackground from "../components/AuroraBackground";

// The locked "G3 shader (violet)" hero, ported 1:1 from the Pencil design.
// Everything is authored in a fixed 1440×900 coordinate space and the whole
// stage is scaled proportionally to the viewport (min(vw/1440, vh/900)),
// so every absolute position from the design is preserved exactly.
const W = 1440;
const H = 900;
const VIOLET = "#7b61ff";
const FG = "#bfbfbf";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// px helper — coordinates are literal design pixels inside the 1440×900 stage.
const abs = (x, y, extra = {}) => ({ position: "absolute", left: x, top: y, ...extra });

// 導覽標籤來自定案設計，接到真實目的地：站內錨點 + /links 路由。
const NAV = [
  { label: "ABOUT", to: "#about" },
  { label: "LINKS", to: "/links", route: true },
  { label: "ARTS", to: "#works" },
  { label: "PROJECTS", to: "#works" },
  { label: "CONTACT", to: "#contact" },
];
const NAV_LINK = { fontSize: 13, letterSpacing: "1.8px", color: "#fff", opacity: 0.85, textDecoration: "none" };

export default function HeroG3() {
  const [scale, setScale] = useState(1);
  const reduced = useRef(reduceMotion()).current;

  useEffect(() => {
    const fit = () =>
      setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section
      aria-label="Hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        overflow: "hidden",
        background: "#0a0a0a",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: W,
          height: H,
          position: "relative",
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          background: "linear-gradient(315deg, #1a1a1a 0%, #0a0a0a 100%)",
          fontFamily: "Satoshi, aeonik, sans-serif",
          color: FG,
        }}
      >
        {/* aurora shader background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <AuroraBackground reduced={reduced} />
        </div>

        {/* character — huge, only a slice reads */}
        <img
          src="/hero/yak-object.png"
          alt=""
          aria-hidden="true"
          style={{ ...abs(59, -511, { width: 1732, height: "auto", zIndex: 1, opacity: 0.92, mixBlendMode: "screen" }) }}
        />

        {/* top scrim */}
        <div style={{ ...abs(0, 0, { width: W, height: 120, zIndex: 2, background: "linear-gradient(180deg, #080607 0%, rgba(6,4,5,0) 100%)" }) }} />

        {/* portal doors + glowing violet seams */}
        <div style={{ ...abs(0, 0, { width: 24, height: H, zIndex: 6, background: "#141418" }) }} />
        <div style={{ ...abs(24, 0, { width: 2, height: H, zIndex: 6, background: VIOLET, boxShadow: `0 0 16px 1px ${VIOLET}cc` }) }} />
        <div style={{ ...abs(1416, 0, { width: 24, height: H, zIndex: 6, background: "#141418" }) }} />
        <div style={{ ...abs(1414, 0, { width: 2, height: H, zIndex: 6, background: VIOLET, boxShadow: `0 0 16px 1px ${VIOLET}cc` }) }} />

        {/* giant faint marquee — infinite left scroll */}
        <div style={{ ...abs(0, 574, { width: W, height: 300, zIndex: 3, overflow: "hidden" }) }}>
          <div
            className="g3-marq"
            style={{ display: "flex", width: "max-content", whiteSpace: "nowrap", fontFamily: "aeonik", fontWeight: 700, fontSize: 300, lineHeight: 1, color: "rgba(255,255,255,0.05)", letterSpacing: "-0.02em" }}
          >
            <span style={{ paddingRight: 120 }}>ILLUSTRATION&nbsp;&nbsp;MOCAP&nbsp;&nbsp;RIGGING&nbsp;&nbsp;TOOLING&nbsp;&nbsp;</span>
            <span style={{ paddingRight: 120 }}>ILLUSTRATION&nbsp;&nbsp;MOCAP&nbsp;&nbsp;RIGGING&nbsp;&nbsp;TOOLING&nbsp;&nbsp;</span>
          </div>
        </div>

        {/* hairline */}
        <div style={{ ...abs(43, 478, { width: 1354, height: 1, zIndex: 4, background: "rgba(255,255,255,0.15)" }) }} />

        {/* wordmark */}
        <div style={{ ...abs(18, 12, { zIndex: 7, display: "flex", alignItems: "flex-start", gap: 6 }) }}>
          <span style={{ fontFamily: "aeonik", fontWeight: 700, fontSize: 115, lineHeight: 1, letterSpacing: "-2px", color: "#fff" }}>RYS</span>
          <span style={{ fontSize: 18, color: "#fff" }}>©</span>
        </div>

        {/* nav */}
        <nav style={{ ...abs(1021, 53, { zIndex: 7, display: "flex", gap: 22 }) }} aria-label="Sections">
          {NAV.map((item) =>
            item.route ? (
              <Link key={item.label} to={item.to} style={NAV_LINK}>{item.label}</Link>
            ) : (
              <a key={item.label} href={item.to} style={NAV_LINK}>{item.label}</a>
            ),
          )}
        </nav>

        {/* logo mark */}
        <img src="/images/logo.webp" alt="RyoyakS" style={{ ...abs(1357, 364, { width: 83, height: 171, objectFit: "contain", zIndex: 7 }) }} />

        {/* side badge */}
        <div style={{ ...abs(0, 364, { width: 53, height: 171, zIndex: 7, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "12px 10px 14px" }) }}>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.1px", color: "#0a0a0a" }}>R.</span>
          <span style={{ fontSize: 12, color: "#0a0a0a", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Illustration</span>
        </div>

        {/* ML identity */}
        <div style={{ ...abs(73, 439, { zIndex: 7, width: 333, color: FG }) }}>
          <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>RyoyakS — [りょうや・六亞]</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginTop: 18 }}>illustration · 3d · tools</div>
          <div style={{ display: "flex", justifyContent: "space-between", width: 333, fontSize: 16, fontWeight: 500, marginTop: 6 }}>
            <span>Commissions, collabs, questions</span>
            <a href="mailto:ryoyaillust892763@gmail.com" style={{ color: FG, fontStyle: "italic" }}>Write</a>
          </div>
        </div>

        {/* kicker */}
        <div style={{ ...abs(44, 182, { zIndex: 7, fontSize: 13, fontWeight: 500, letterSpacing: "0.6px", color: "#8a8a8a" }) }}>
          ( ILLUSTRATION · MOCAP · RIG TOOLING )
        </div>

        {/* CREATIVE STUDIO block */}
        <div style={{ ...abs(48, 632, { zIndex: 7, fontFamily: "aeonik", fontWeight: 700, fontSize: 30, lineHeight: 1.08, letterSpacing: "-0.5px", color: "#f2f2f2" }) }}>
          CREATIVE<br />STUDIO
        </div>
        <p style={{ ...abs(48, 724, { zIndex: 7, width: 322, margin: 0, fontSize: 13, lineHeight: 1.5, color: "#8a8a8a" }) }}>
          One person — illustrating characters and building the tools that rig and animate them. From first concept to shipped software.
        </p>

        {/* spec card */}
        <div style={{ ...abs(1220, 726, { zIndex: 7, width: 172, background: "#141416", border: "1px solid #333", borderRadius: 4, padding: 12, display: "flex", flexDirection: "column", gap: 9 }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontWeight: 500, color: "#7a7a76" }}>
            <span style={{ letterSpacing: "1px" }}>SPEC</span><span style={{ letterSpacing: "0.5px" }}>v0.4</span>
          </div>
          <div style={{ fontFamily: "aeonik", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px", color: "#f2f2f2" }}>Projects</div>
          <div style={{ height: 1, background: "#333" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontWeight: 500, color: "#7a7a76" }}>
            <span style={{ letterSpacing: "1px" }}>STATUS</span><span style={{ letterSpacing: "0.5px", color: VIOLET, fontWeight: 700 }}>● LIVE</span>
          </div>
        </div>

        {/* numeral — rotated 90° (vertical, right edge) */}
        <div style={{ ...abs(1249, 286, { zIndex: 6, fontFamily: "aeonik", fontWeight: 700, fontSize: 88, letterSpacing: "-2px", color: "#4f4f57", transform: "rotate(-90deg)", transformOrigin: "center center" }) }}>006</div>

        {/* object caption */}
        <div style={{ ...abs(1311, 132, { zIndex: 7, fontSize: 9, fontWeight: 500, letterSpacing: "0.4px", lineHeight: 1.6, textAlign: "right" }) }}>
          <div style={{ color: "#c9c9c6" }}>SUBJECT · 006</div>
          <div style={{ color: "#7a7a76" }}>TORUS / CHROME</div>
          <div style={{ color: "#7a7a76" }}>RENDER PASS 04</div>
        </div>

        {/* bottom hairline */}
        <div style={{ ...abs(48, 838, { width: 1344, height: 1, zIndex: 4, background: "rgba(255,255,255,0.12)" }) }} />

        {/* colophon */}
        <div style={{ ...abs(59, 845, { zIndex: 7, fontSize: 9, fontWeight: 500, letterSpacing: "0.4px", lineHeight: 1.6, color: "#7a7a76", whiteSpace: "pre-line" }) }}>
          {"RYOYAKS STUDIO — ILLUSTRATION & RIG TOOLING\n六亞 RyoyakS · 2026 ©"}
        </div>

        {/* index carousel */}
        <div style={{ ...abs(0, 845, { width: W, zIndex: 7, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontSize: 13 }) }}>
          <span style={{ color: VIOLET }}>⟪</span>
          <span style={{ color: "#b0b0ae", fontWeight: 500, letterSpacing: "1px" }}>01 / 04</span>
          <span style={{ color: VIOLET }}>⟫</span>
        </div>
      </div>
    </section>
  );
}
