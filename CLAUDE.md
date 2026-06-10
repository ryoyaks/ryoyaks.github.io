# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project Context

Personal portfolio site for RyoyakS, deployed to GitHub Pages at `ryoyaks.github.io`. Single-page React 19 app using Vite, Tailwind v4, and React Three Fiber for in-page 3D.

**Note:** `README.md` is leftover from the upstream fork (`GourangaDasSamrat/My-Personal-Portfolio`) and is mostly inaccurate for this repo (wrong author, references scripts/files that don't exist here like `npm run format`, `.env.example`). Don't treat it as authoritative — use this file and the actual code.

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (default port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint over the project |
| `npm run deploy` | Builds and publishes `dist/` to GitHub Pages via `gh-pages` |

No test runner is configured.

### Architecture

The whole site is one route (`/`) that renders sections top-to-bottom; `*` falls through to `NotFound`. The render order is the source of truth for page order — see `src/App.jsx`:

```
NavBar → Sidebar → Hero → Linktree → Bento → Footer
```

**Sections vs components.** `src/sections/` holds the page-level blocks (`Hero`, `Linktree`, `Bento`). `src/components/` holds reusable UI and the 3D scenes (`HeroExperience`) and their GLB-backed model wrappers (`src/components/models/`). A section typically composes a `TitleHeader` plus one or more components and pulls its data from `src/constants/index.js`. Note: `About`, `TechStack`, `Projects`, and `Contact` were collapsed into individual Bento tiles for a more cohesive hub layout.

**Barrel import.** `src/sections/index.js` re-exports both sections and a few components (`NavBar`, `Sidebar`, `Loader`, `Footer`). `App.jsx` imports everything from `./sections` — when adding a new section/component used by `App`, export it from this barrel.

**Data is centralized.** `src/constants/index.js` drives `navItems`, `iconsList` (image paths for the TechStack marquee and Linktree icons), and `linkList` (the Linktree entries). Icons are referenced by string key via an `iconMap` lookup built from `iconsList`. To add a Linktree entry: add an icon to `iconsList`, add an entry to `linkList[0].links`, then add the key to the order array in `src/sections/Linktree.jsx`.

### 3D models — important gotchas

- Models are loaded with `useGLTF('/<name>.glb')` from **`public/`** (e.g. `public/6YAbeta1.glb`, referenced as `/6YAbeta1.glb`). They live at the repo root of `public/`, not under `public/models/`.
- Model React wrappers in `src/components/models/` are auto-generated by `npx gltfjsx`. If a model file changes, regenerate the wrapper rather than hand-editing it.
- **Git LFS is intentionally not used** for the GLBs. Recent commit history (`fix: total removal of LFS...`, `flat: force binary upload without LFS`) reflects fighting with this — `.glb` files must be committed as real binaries. Do not re-introduce LFS or `.gitattributes` rules for `*.glb`.
- `vite.config.js` sets `assetsInlineLimit: 0` so large binaries are never inlined as base64, and `base: "./"` so built asset paths are relative (required for GH Pages deploy from a subpath).
- Hero is the only `<Canvas>` on the page. About and Contact each had their own canvas in the upstream fork; both were removed for performance.

### Styling

Tailwind v4 via `@tailwindcss/vite`. All custom design tokens, fonts (`Aeonik` family loaded from `public/fonts/`), keyframes, and named utility/component classes (`gradient-sphere`, `marquee`, `flex-center`, `*-gradient-box`, etc.) are declared in `src/index.css` using `@theme` / `@layer`. Prefer extending existing tokens and component classes there rather than introducing a separate config file.

### Theming

Dark/light dual theme. Tokens declared as CSS custom properties in `src/index.css` under `:root` and `:root[data-theme="light"]`. An inline script in `index.html` sets `<html data-theme>` before React hydrates to avoid a theme flash. Components read tokens through arbitrary-value Tailwind classes like `bg-[var(--bg-elev)]` and `text-[var(--fg)]`. The `useTheme()` hook (`src/hooks/useTheme.js`) flips the attribute and persists to `localStorage.theme`.

### Contact

There is no contact form. The Bento section's Contact tile opens `mailto:ryoyaillust892763@gmail.com` directly. The original `@emailjs/browser`, `zod`, `react-hook-form`, `@hookform/resolvers`, and `react-google-recaptcha` dependencies are no longer installed.
