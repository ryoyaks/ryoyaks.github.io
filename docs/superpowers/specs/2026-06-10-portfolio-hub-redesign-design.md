# Portfolio hub redesign — design spec

**Date:** 2026-06-10
**Status:** Draft for review

## Why we're doing this

The current site (forked from `GourangaDasSamrat/My-Personal-Portfolio`) is a generic dev-portfolio template. It carries fork-residue (fake project carousel, unused Twitter embed), busy decoration (animated glow spheres, marquee, multi-color gradients), and no clear primary purpose. Visitors can't quickly answer "who is this person and where do I find their work?"

We're redesigning the page so it works as an **entry hub** for two audiences:

- **A — Illustration commission clients** — need to see the work, the marketplaces (Melonbooks / 黑市兔 / 買動漫), and a contact path.
- **C — 3D / VTuber / 二次創作 community** — need socials (Pixiv / Fanbox / Twitter / YouTube / Twitch), the character/3D presence, and ways to support (Fanbox / PayPal).

Developer identity (VR / CV / HCI) is *not* dropped — it's surfaced through the featured project (`SyncRig`), which serendipitously sits between all three identities (built by an illustrator, uses CV, integrates with VTuber rigs).

The page is **a hub, not a gallery**. Visitors should leave for an external destination (Pixiv, Melonbooks, GitHub, etc.) within ~10 seconds if they came with intent.

## Out of scope

- Writing About-section bio copy (user will write later; spec uses placeholder text).
- Multi-language i18n (the site is implicitly Chinese + English mixed today — keep that).
- Replacing the 3D character model.
- Reintroducing a true projects gallery (explicit anti-goal — this is a hub).

## Page structure

Top-to-bottom render order:

```
NavBar
Hero            (3D centerpiece, simplified, the only 3D Canvas on the page)
01 / Links      (full-width grid — improved Linktree, kept conceptually)
02 / Bento      (About · SyncRig Featured · Tools · Status · Contact CTA)
Footer
```

Sections that go away from the current site:
- `Projects` (carousel with 7 fake fork slides) — replaced by SyncRig in Bento.
- `TwitterFeed` component — was never wired into `App.jsx`; delete the file.
- `About` 's secondary `<Canvas>` (3D model duplicate) — removed.
- `Contact` 's tertiary `<Canvas>` (3D model duplicate) — removed.
- `TechStack` section as a standalone marquee — collapsed into the Tools tile inside Bento.

### Anchor IDs for in-page navigation

- Hero section: `id="home"`
- Links section: `id="links"`
- Bento section: `id="works"`, with **inner anchors** on individual tiles: Featured (`id="featured"`), Tools (`id="tools"`), Contact (`id="contact"`).

### Hero

Replaces `src/sections/Hero.jsx`.

Layout: split, text-left (≈45% width on desktop, full width on mobile with model overlapping background), 3D right.

Content:
- Eyebrow: `HELLO, I'M` (small, tracked, low opacity)
- Display name: `RyoyakS` (huge, weight 900, gradient-on-light-mode / solid-on-dark)
- Subtitle (two lines):
  - `Illustrator · 3D Creator`
  - `VR / CV / HCI Developer`
- Two CTAs: `Explore ↓` (scroll to Bento) and `View on GitHub ↗` (link to github.com/ryoyaks)
- Scroll hint at bottom-left: `↓ SCROLL`

3D model:
- Same `Model` component from `src/components/models/6YAbeta1.jsx`.
- Position adjusted so the model sits clearly to the right of the text block, not overlapping the headline.
- Background spheres: keep as accent but **static** (no `wander-left` / `wander-right` keyframes), smaller, lower opacity.
- The "CONTENT CREATOR" tagline + bouncing arrow GIF + loader.gif overlay are all removed.

### 01 / Links

Replaces `src/sections/Linktree.jsx`. **Kept as full-width grid** per user direction. The section header pattern is shared with the Bento section (numbered eyebrow + large headline).

- Section eyebrow: `01 / LINKS`
- Headline: `All my online presence`
- Right-side caption: e.g. `12 destinations`
- Grid: 6-column on desktop, 3-column on tablet, 2-column on mobile. Each link tile is `aspect-[3/1]` (wide rectangle) and contains: icon, display name, sub-label (`@handle` or purpose). Hover lifts the tile.

Order of links (single source of truth in `src/constants/index.js`):

| # | name | sub-label | category |
|---|---|---|---|
| 1 | Twitter (X) | @RyoyakS | social |
| 2 | Pixiv | 15708685 | social |
| 3 | Fanbox | @ryoyaks | support |
| 4 | YouTube | @RyoyakS | media |
| 5 | Twitch | streams | media |
| 6 | Facebook | RyoyakS2nd | social |
| 7 | Melonbooks | りょりょや | shop |
| 8 | 買動漫 | 六六六亞 | shop |
| 9 | 黑市兔 | doujin | shop |
| 10 | Marshmallow | 留言給我 | contact |
| 11 | PayPal | 買杯咖啡給我 | support |
| 12 | Email | 委託 / 聯絡 | contact |

The sub-label is a new field — extend the `linkList[0].links` entries with `subLabel: string` and render it under `displayName` in `LinkIcon` for `type="wide"`.

### 02 / Bento

New section: `src/sections/Bento.jsx`. CSS grid, 6 columns on desktop, single column stacked on mobile.

Tiles, in DOM order (matters for keyboard/screen-reader traversal):

1. **About** — col-span 3, row-span 2.
   - Eyebrow `ABOUT`
   - Headline (1 line)
   - 2-3 sentence bio (placeholder text in this spec; user fills later)
   - Skill chips: `Illustration`, `3D / VRM`, `CV · HCI`, `Open to commissions`
2. **Featured · SyncRig** — col-span 3, row-span 2.
   - Eyebrow `★ FEATURED PROJECT`
   - Title `SyncRig`
   - 2-3 sentence description (from SyncRig README — mocap & 3D pose tool, exports to Blender, broadcasts via VMC)
   - **Background video preview** (see Video integration below)
   - Two CTAs: `GitHub ↗` (link to github.com/ryoyaks/SyncRig), `Latest Release ↗`
3. **Tools** — col-span 3, row-span 1.
   - Eyebrow `TOOLS I USE`
   - Inline row of 7 icons: Blender, Photoshop, Illustrator, Clipstudio, Unity, Unreal, Figma
   - Icon hover: shine sweep (existing `@keyframes shine`) + 4px lift
4. **Status** — col-span 2, row-span 1.
   - Eyebrow `STATUS`
   - Green dot + `Open for commissions`
   - Sub-line: `Email or Marshmallow for inquiries`
5. **Contact** — col-span 1, row-span 1.
   - Pink/blue gradient background (only place gradients live in dark mode)
   - Eyebrow `CONTACT`
   - Large arrow CTA → opens `mailto:` (no form — the form is removed)

### Footer

Keep `src/components/Footer.jsx` structurally but simplify:
- Logo
- Three quick links: Twitter · Pixiv · Email
- `© 2026 RyoyakS`

## Video integration (SyncRig featured tile)

User-selected approach: **option ii — static thumbnail, hover-to-play**.

- Static thumbnail = a JPEG/WebP poster extracted from the demo video (first frame or a key frame around 1s in).
- On hover (desktop) / on intersection-observer 50% threshold (mobile, since hover doesn't exist), swap the poster `<img>` for an `<video autoplay muted loop playsinline preload="metadata">`.
- Video source: `public/syncrig-demo.webm` (re-encoded from the 22 MB MP4 to ≤ 5 MB WebM VP9 at ~720p, no audio).
- Original `.mp4` (22 MB) does **not** go into `public/` — it stays in `.superpowers/brainstorm/_local_asset/` (gitignored).
- The `preload="metadata"` keeps the page light until the user hovers; on mobile we trigger load only when the card scrolls into view.

Encoding command (run once, manual):
```sh
ffmpeg -i ".superpowers/brainstorm/_local_asset/syncRig demo.mp4" \
  -an -c:v libvpx-vp9 -b:v 0 -crf 35 -vf "scale=-2:720" \
  public/syncrig-demo.webm
# Plus a poster:
ffmpeg -i ".superpowers/brainstorm/_local_asset/syncRig demo.mp4" \
  -ss 00:00:01 -vframes 1 -vf "scale=-2:720" public/syncrig-poster.webp
```

## Color and theme — dark + light dual mode

User-selected approach: **palette C (Editorial Dark) AND D (Light / Cream) as user-switchable themes**.

### Theme tokens

Declared in `src/index.css` `@theme` block as CSS custom properties, with `[data-theme="light"]` overrides on `:root` or `<html>`:

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#0d0d12` | `#f4f0e8` |
| `--bg-elev` | `#15131d` (cards) | `#ffffff` (cards) |
| `--fg` | `#fdfdfd` | `#1a1a1a` |
| `--fg-muted` | `#fdfdfd` @ 65% | `#1a1a1a` @ 65% |
| `--border` | `#fdfdfd` @ 10% | `#1a1a1a` @ 12% |
| `--accent` | `#ff28d5` (kept for one role: Contact CTA gradient + Status dot) | same |
| `--accent-secondary` | `#1c34ff` (kept only for SyncRig featured tile gradient) | same |

Editorial Dark loses most of the existing decoration:
- **No** gradient text on display headlines (solid `--fg`).
- **No** rounded `gradient-border` cards. Cards become flat with thin `1px` `--border` line.
- **Two** glow spheres remain in Hero only, **static** (no `wander-*` keyframes), each ≤ 30% opacity.
- Gradients survive in exactly two places: the SyncRig featured tile background and the Contact CTA tile background.

Light / Cream mirrors the structure: same layout, same spacing, just inverted tokens. The 3D model's Hero lighting needs re-tuning because the model was lit for a dark background — see Implementation notes.

### Theme toggle

- Toggle lives in the NavBar (right of the existing `Hire Me` button) as a small sun/moon icon button.
- Persisted to `localStorage` under key `theme` (values `dark` / `light`).
- First paint reads `localStorage.theme` ?? `prefers-color-scheme` (system preference) and sets `<html data-theme="...">` synchronously *before* React hydrates (via a tiny inline script in `index.html`) to avoid a theme flash.

## Motion / animation policy

Less is more. Three motions on the whole page:

1. **3D character idle animation** (Hero) — unchanged from current implementation, plays continuously.
2. **Bento tile entrance** — when the Bento section's first tile crosses 30% of viewport, the 5 tiles fade-and-rise in with `stagger: 0.08s, duration: 0.5s, ease: power2.out`. Uses GSAP (already a dep).
3. **Tool icon hover** — the existing `@keyframes shine` (light sweep across the icon) plus a 4px `translateY(-4px)` lift on hover. Only on the 7 tool icons inside the Tools tile.

What's removed:
- `@keyframes wander-left` / `wander-right` (sphere drifting)
- `@keyframes marquee` (horizontal scroll of tool icons)
- `flower` animation on the About flower SVG
- `animate-bounce` on the Hero down-arrow
- Most CSS `transition`s on hover-translate (kept only on link tiles and tool icons)

`prefers-reduced-motion: reduce` disables (2) and (3); (1) is the 3D model's own animation and is governed by R3F.

## Files added / removed / changed

### Added

- `src/sections/Bento.jsx` — the new dashboard section.
- `src/hooks/useTheme.js` — `useTheme()` hook reading `<html data-theme>` and writing back, plus `localStorage` sync.
- `src/components/ThemeToggle.jsx` — sun/moon button rendered inside NavBar.
- `src/components/VideoCard.jsx` — small wrapper that renders `<img>` poster by default and swaps to `<video>` on hover/inview. Used by the SyncRig featured tile.
- `public/syncrig-demo.webm` — encoded preview, ≤ 5 MB.
- `public/syncrig-poster.webp` — static thumbnail.

### Removed

- `src/sections/Projects.jsx` — fork carousel placeholder. Delete.
- `src/components/Carousel.jsx` — only used by Projects. Delete.
- `src/components/TwitterFeed.jsx` — never used. Delete.
- `src/components/ContactForm.jsx` — replaced by mailto link in Bento Contact tile. Delete (and drop deps in next clean-up: `@emailjs/browser`, `react-google-recaptcha`, `react-hook-form`, `@hookform/resolvers`, `zod` — only if no other code uses them; verify before removing from `package.json`).
- `src/components/GradientSpheres.jsx` — **kept**, used by Hero. Simplified: drop the `wander-*` keyframe animations from `src/index.css`; the spheres become two static blurred divs.
- `src/sections/TechStack.jsx` — folded into Bento Tools tile. Delete.
- `src/sections/About.jsx` — folded into Bento About tile. Delete.
- `src/sections/Contact.jsx` — folded into Bento Contact tile. Delete.
- `src/components/ContactExperience.jsx` — only used by Contact section. Delete.
- `src/components/Loader.jsx` — leftover; `App.jsx` already doesn't import it. Delete.
- `src/App.css` — Vite boilerplate, not imported anywhere. Delete.
- `public/images/loader.gif`, `public/images/quote.png` — unreferenced after these removals. Delete.

### Changed

- `src/App.jsx` — collapse to: `NavBar`, `Sidebar`, `Hero`, `Linktree`, `Bento`, `Footer`. Lazy boundary applies to Bento and below. `NotFound` route stays.
- `src/sections/Hero.jsx` — see Hero spec above.
- `src/sections/Linktree.jsx` — keep grid logic, but pull header pattern (eyebrow + headline) into a shared `SectionHeader` component (see below).
- `src/components/LinkIcon.jsx` — render `subLabel` under `displayName` for `type="wide"`.
- `src/components/TitleHeader.jsx` — replaced by `SectionHeader.jsx` (same behavior, less ornament, supports the new `eyebrow` style).
- `src/components/NavBar.jsx` — add ThemeToggle button.
- `src/index.css` — replace the long `@layer components` block. Token CSS variables; minimal utility classes (`.flex-center` stays). Remove `wander-*`, `marquee`, `shine` (we keep shine but move it to a JS-scoped class), gradient-box helpers, sphere/box presets, etc.
- `src/constants/index.js` — add `subLabel` field to each link entry; remove `slides` (no longer used); update `navItems` to the new IA: `[{name:"Home",href:"#home"}, {name:"Links",href:"#links"}, {name:"Featured",href:"#featured"}, {name:"Tools",href:"#tools"}, {name:"Contact",href:"#contact"}]`.
- `vite.config.js` — unchanged (`assetsInlineLimit: 0` still matters for the WebM and GLB).

### Shared component to introduce

- `src/components/SectionHeader.jsx`:
  ```jsx
  // <SectionHeader number="01" title="Links" caption="12 destinations" />
  ```
  Renders `01 / LINKS` eyebrow + display headline + optional right-side caption. Used by Links and Bento sections so they look consistent.

## Implementation notes

- **3D lighting under Light mode**: the Hero scene currently uses `ambientLight intensity={5} color="#edac97"` plus a pink `directionalLight`. On a cream background the warm lighting may wash the model out. Plan: keep the directional pink for character but add a cool fill light only when `data-theme="light"`. Concretely, pass `theme` from the `useTheme()` hook to `HeroExperience` and conditionally set ambient color/intensity.
- **The `useGLTF` morph target warnings** are still expected after our earlier GLB optimization. The wrapper references `morphTargetDictionary`/`morphTargetInfluences` that are now empty; R3F treats undefined as no-op. Don't regenerate the wrapper for this redesign.
- **mailto: tracking** — the Contact CTA opens `mailto:ryoyaillust892763@gmail.com` (the existing email in `linkList`). No analytics, no form.
- **Mobile breakpoint**: the Bento collapses to a single column at `<md` (768px). The Featured tile keeps the video-on-hover behavior on desktop only; on mobile the video plays once when the tile crosses 50% of the viewport (uses the existing `useInView` hook).
- **Performance budget**: total transferred on first scroll (above the fold + Linktree + Bento) should remain comparable to today's ~3.7 MB after the prior optimization round. The video adds ≤ 5 MB but only after user hovers, so first-paint is unaffected.

## Verification (when implementation is done)

- Load page in dark mode (default). Hero shows 3D model, name, subtitle, CTAs. No "CONTENT CREATOR" text. No bouncing arrow GIF. No moving spheres.
- Click theme toggle. Page transitions to cream. 3D model still readable (not washed out). Persisted in `localStorage`.
- Reload page. Theme persists.
- Scroll to `01 / LINKS`. 12 link tiles, each with icon, display name, sub-label. Hover lifts a tile.
- Scroll to `02 / BENTO`. Tiles fade-in staggered. About tile shows placeholder bio. Featured tile shows SyncRig static poster. Hovering the Featured tile swaps to looping video. Tools tile: hovering an icon makes the shine sweep across.
- Click Contact tile → opens email client.
- Open page on a phone. Hero stacks. Links go to 2 columns. Bento collapses to one column. SyncRig video plays when it scrolls into view (no hover available).
- Run `npm run build`; no errors; main bundle size hasn't ballooned (within ~10% of current).
- DevTools network: confirm `syncrig-demo.webm` is **not** requested on first paint.
- `prefers-reduced-motion: reduce` set in DevTools → Bento entrance and shine animations disabled; 3D character idle continues.
