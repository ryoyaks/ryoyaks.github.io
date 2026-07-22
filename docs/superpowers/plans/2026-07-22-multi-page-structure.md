# 多頁結構與頁面轉場 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 ryoyaks.com 從「單一路由攤平頁」改成真正的多頁網站，且站內任何導覽都經過巨型文字轉場。

**Architecture:** 先修好 GitHub Pages 的 SPA 路由基建（`base` 與 404 fallback），再把 Linktree 從首頁抽成獨立的 `/links` 路由並把 Hero 改為 lazy（讓 `/links` 不下載 three.js），接著重寫 NavBar 為路由導覽並刪除 SideBar，最後加入攔截路由變更的轉場層。每個任務結束時網站都可部署。

**Tech Stack:** React 19、Vite 6、react-router-dom 6.30、Tailwind v4、GSAP 3.14（`@gsap/react`）、Vitest ＋ Testing Library（本計畫新增）。

**對應規格：** [`docs/superpowers/specs/2026-07-22-multi-page-interaction-redesign-design.md`](../specs/2026-07-22-multi-page-interaction-redesign-design.md) 第 4–9 節、第 18 節階段 1–3。

## Global Constraints

- 分支：`redesign/multi-page`。不要合併回 `main`。
- `vite.config.js` 的 `build.assetsInlineLimit: 0` **必須保留**（大型二進位不得被 base64 內嵌）。
- 不得為 `*.glb` 引入 Git LFS 或 `.gitattributes` 規則。
- `/projects/syncrig` 路徑**不得改名**。
- **所有站內導覽必須使用 react-router 的 `<Link>`**，不得用原生 `<a href="/...">`。外部連結仍用 `<a target="_blank" rel="noreferrer">`。
- `/links` 頁面**不得載入任何 3D 資產或 three.js**。
- 所有新動效必須在 `prefers-reduced-motion: reduce` 時降級。
- 安裝相依套件時必須加 `--legacy-peer-deps`（`@react-three/*` 為 rc 版，CI 的 `npm ci` 亦使用此旗標）。
- 每個任務結束時 `npm run test` 與 `npm run build` 皆須通過。
- `npm run lint` **在本分支開始前就已有 129 個既有錯誤**（多數是 `src/components/models/6YAbeta1.jsx`
  這個 gltfjsx 自動產生檔上的 `react/no-unknown-property` 誤判，另有 `useTheme.js` 的 `no-empty`
  與 `Bento.jsx` 未使用的 `VideoCard` import）。因此標準是**不得新增 lint 錯誤**，
  而非讓整個 lint 變綠。驗證方式：`npx eslint <本任務改動或新增的檔案>` 必須零錯誤。
  既有錯誤不在本計畫範圍內，不要順手修（見 CLAUDE.md 第 3 節）。
- 本計畫**不處理**：首頁區塊重構、治療層動效、avatar 平面化與 LookAt、`/lab/:slug`。那些屬規格第 18 節階段 4–6，另開計畫。

---

## File Structure

| 檔案 | 責任 |
|---|---|
| `vite.config.js` | 建置設定 ＋ Vitest 設定（單一來源） |
| `src/test/setup.js` | 測試環境墊片：`matchMedia`、`fetch`、DOM 清理 |
| `scripts/postbuild.js` | 建置後把 `dist/index.html` 複製成 `dist/404.html` |
| `scripts/check-build.js` | 斷言建置產物：404 fallback 存在、資源路徑為絕對 |
| `src/App.jsx` | 路由表（匯出可測試的 `AppRoutes`）＋ Router ＋ 轉場層 |
| `src/pages/Links.jsx` | `/links` 頁面。只有連結，零 3D |
| `src/components/NavBar.jsx` | 路由導覽：logo → `/`、Links 按鈕 → `/links`、ThemeToggle |
| `src/components/PageTransition.jsx` | 攔截路由變更的巨型文字轉場層 |
| `src/test/*.test.jsx` | 路由與轉場行為測試 |

**刪除**：`src/components/SideBar.jsx`、`src/sections/Linktree.jsx`、`public/_redirects`。

---

## Task 1: 建立 Vitest 測試環境

沒有測試框架就無法驗證後續任務。此任務不改動任何產品行為。

**Files:**
- Modify: `package.json`（devDependencies ＋ scripts）
- Modify: `vite.config.js`（新增 `test` 區塊）
- Create: `src/test/setup.js`
- Create: `src/test/setup.test.jsx`

**Interfaces:**
- Consumes: 無
- Produces: `npm run test` 指令；`src/test/setup.js` 提供 `window.matchMedia` 墊片與預設 `fetch` stub（回傳 `json() -> null`），後續所有測試皆依賴此檔。

- [ ] **Step 1: 安裝測試相依套件**

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event --legacy-peer-deps
```

預期：安裝成功，`package.json` 的 `devDependencies` 出現這六個套件。

- [ ] **Step 2: 在 `vite.config.js` 加入 test 區塊**

完整檔案內容：

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./", // 確保資源從根目錄讀取
  build: {
    assetsInlineLimit: 0, // 確保大檔案不會被轉成 base64 導致崩潰
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: false,
  },
});
```

注意：`base` 這一步先不動，Task 2 才改。

- [ ] **Step 3: 建立測試墊片**

建立 `src/test/setup.js`：

```js
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// jsdom 的 matchMedia 實作不完整，而 Bento 與 HeroExperience 都會呼叫它
// （前者查 prefers-reduced-motion，後者查斷點）。
export const stubMatchMedia = (matches = () => false) => {
  window.matchMedia = (query) => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
};

beforeEach(() => {
  // 每則測試重設，避免某則覆寫 reduced-motion 後污染後續測試。
  stubMatchMedia();

  // useContent 會 fetch /content/*.json。預設回傳 null，讓元件走各自的
  // fallback 分支；個別測試可用 vi.stubGlobal 覆寫成真實資料。
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(null) }))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});
```

- [ ] **Step 4: 寫一個會失敗的測試**

建立 `src/test/setup.test.jsx`：

```jsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import SectionHeader from "../components/SectionHeader";

test("測試環境可以渲染專案元件", () => {
  render(
    <SectionHeader number="01" eyebrow="Links" headline="All my online presence" />
  );

  expect(screen.getByText(/01 \/ Links/)).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "All my online presence" })
  ).toBeInTheDocument();
});

test("matchMedia 墊片存在", () => {
  expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(false);
});
```

- [ ] **Step 5: 加入 npm scripts**

在 `package.json` 的 `scripts` 中加入兩行（保留既有的 dev/build/lint/preview/predeploy/deploy）：

```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 6: 執行測試，確認通過**

Run: `npm run test`

預期輸出包含：

```
 ✓ src/test/setup.test.jsx (2 tests)

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

若 `SectionHeader` 那則失敗且訊息是找不到文字，先執行 `npx vitest run --reporter=verbose` 看實際渲染的 DOM。

- [ ] **Step 7: 確認 lint 與 build 未被破壞**

Run: `npm run lint && npm run build`
預期：兩者皆成功結束，`dist/` 產生。

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test/
git commit -m "test: add vitest + testing library harness

jsdom lacks a usable matchMedia and Bento/HeroExperience both query it,
so the setup file stubs it alongside a default fetch stub for useContent.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: 修正 GitHub Pages 的 SPA 路由基建

**這是既有缺陷，與本次改版無關地已經壞了。** `public/_redirects` 是 Netlify 慣例，GitHub Pages 完全忽略；`base: "./"` 會產出相對資源路徑，在巢狀路由下解析錯誤。修好之前，多頁架構不可能運作。

**Files:**
- Modify: `vite.config.js:9`（`base` 由 `"./"` 改 `"/"`）
- Modify: `package.json`（`build` script、新增 `verify:build`）
- Create: `scripts/postbuild.js`
- Create: `scripts/check-build.js`
- Modify: `.github/workflows/deploy.yml`（build 後新增驗證步驟）
- Delete: `public/_redirects`

**Interfaces:**
- Consumes: 無
- Produces: `npm run verify:build` 指令，斷言 `dist/404.html` 存在且與 `dist/index.html` 相同、且資源路徑為絕對路徑。Task 3 之後的每次建置都應通過它。

- [ ] **Step 1: 建立建置後複製 404 的腳本**

建立 `scripts/postbuild.js`：

```js
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// GitHub Pages 沒有伺服器端 rewrite。對未知路徑它會回傳 404.html，
// 只要那份檔案就是 SPA 入口，React Router 就能接手 location.pathname。
const dist = resolve(process.cwd(), "dist");
const index = resolve(dist, "index.html");

if (!existsSync(index)) {
  console.error("postbuild: dist/index.html not found — did vite build run?");
  process.exit(1);
}

copyFileSync(index, resolve(dist, "404.html"));
console.log("postbuild: wrote dist/404.html (SPA fallback for GitHub Pages)");
```

- [ ] **Step 2: 建立建置產物驗證腳本**

建立 `scripts/check-build.js`：

```js
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");
const problems = [];

const indexPath = resolve(dist, "index.html");
const notFoundPath = resolve(dist, "404.html");

if (!existsSync(indexPath)) problems.push("dist/index.html is missing");
if (!existsSync(notFoundPath)) problems.push("dist/404.html is missing");

if (problems.length === 0) {
  const index = readFileSync(indexPath, "utf8");
  const notFound = readFileSync(notFoundPath, "utf8");

  if (index !== notFound) {
    problems.push("dist/404.html differs from dist/index.html");
  }
  if (/(?:src|href)="\.\//.test(index)) {
    problems.push('index.html uses relative asset paths ("./") — vite base must be "/"');
  }
  if (!/(?:src|href)="\/assets\//.test(index)) {
    problems.push("index.html has no absolute /assets/ reference");
  }
}

if (problems.length > 0) {
  for (const p of problems) console.error(`check-build: ${p}`);
  process.exit(1);
}

console.log("check-build: OK");
```

- [ ] **Step 3: 接上 npm scripts**

`package.json` 的 `scripts` 改成（只列出變動與新增的兩行）：

```json
    "build": "vite build && node scripts/postbuild.js",
    "verify:build": "node scripts/check-build.js",
```

- [ ] **Step 4: 執行驗證，確認它會失敗**

Run: `npm run build && npm run verify:build`

預期：build 成功並印出 `postbuild: wrote dist/404.html`，接著 verify **失敗**：

```
check-build: index.html uses relative asset paths ("./") — vite base must be "/"
```

這證明檢查腳本真的抓得到問題。

- [ ] **Step 5: 修正 vite base**

`vite.config.js` 中：

```js
  base: "./", // 確保資源從根目錄讀取
```

改為：

```js
  // 本站部署在網域根目錄（user site）。"./" 是給子路徑部署用的，
  // 在巢狀路由下會把 /assets 解析成 /projects/assets 而載入失敗。
  base: "/",
```

- [ ] **Step 6: 重新建置並確認驗證通過**

Run: `npm run build && npm run verify:build`

預期最後一行：

```
check-build: OK
```

- [ ] **Step 7: 移除失效的 Netlify redirects**

```bash
git rm public/_redirects
```

理由：GitHub Pages 不讀這個檔案，留著會讓人誤以為 SPA fallback 已經處理好了。

- [ ] **Step 8: 把驗證加進 CI**

`.github/workflows/deploy.yml` 中，在 `Build` 步驟之後、`Publish to gh-pages branch` 之前插入：

```yaml
      - name: Verify build output
        run: npm run verify:build
```

- [ ] **Step 9: 確認測試與 lint 未被破壞**

Run: `npm run lint && npm run test`
預期：皆通過。

- [ ] **Step 10: Commit**

```bash
git add vite.config.js package.json scripts/ .github/workflows/deploy.yml
git commit -m "fix(deploy): serve SPA routes on GitHub Pages

_redirects is a Netlify convention that GitHub Pages ignores, and base
was './' which resolves /assets as /projects/assets on nested routes.
Deep links to /projects/syncrig 404 today; this fixes that and adds a
build-output check so it cannot silently regress.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 11: 手動驗證深層連結**

```bash
npm run build && npm run preview
```

在瀏覽器直接開啟 `http://localhost:4173/projects/syncrig`（不要從首頁點進去）。
預期：頁面正常渲染，開發者工具的 Network 分頁沒有 404。

---

## Task 3: 把 Linktree 抽成 `/links` 路由，並讓 Hero 改為 lazy

`Hero` 目前是靜態 import，會把 three.js 打進主 chunk，導致 `/links` 也得下載 3D。改為 lazy 才能滿足規格的成功標準第 3 條。

**Files:**
- Create: `src/pages/Links.jsx`
- Modify: `src/App.jsx`
- Modify: `src/sections/index.js`
- Modify: `src/sections/Hero.jsx:76`（`#links` 死錨點）
- Delete: `src/sections/Linktree.jsx`
- Create: `src/test/routes.test.jsx`

**Interfaces:**
- Consumes: `src/test/setup.js`（Task 1）
- Produces:
  - `src/App.jsx` 具名匯出 `AppRoutes`，簽名 `({ location }: { location?: Location }) => JSX.Element`，內部渲染 `<Routes location={location}>`。Task 5 的轉場層會傳入 `location`。
  - `src/pages/Links.jsx` 預設匯出 `Links`，無 props，渲染 `<h1>All my online presence</h1>`。

- [ ] **Step 1: 寫會失敗的路由測試**

建立 `src/test/routes.test.jsx`：

```jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { AppRoutes } from "../App";

// R3F 的 Canvas 在 jsdom 沒有 WebGL 可用，替換成佔位元素。
vi.mock("../components/HeroExperience", () => ({
  default: () => <div data-testid="hero-canvas" />,
}));

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );

test("/links 渲染樞紐頁", async () => {
  renderAt("/links");

  expect(
    await screen.findByRole("heading", { name: /all my online presence/i })
  ).toBeInTheDocument();
});

test("/links 不渲染任何 3D canvas", async () => {
  renderAt("/links");

  await screen.findByRole("heading", { name: /all my online presence/i });
  expect(screen.queryByTestId("hero-canvas")).not.toBeInTheDocument();
});

test("/ 渲染 Hero 而非樞紐頁", async () => {
  renderAt("/");

  expect(await screen.findByTestId("hero-canvas")).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: /all my online presence/i })
  ).not.toBeInTheDocument();
});

test("未知路徑渲染 NotFound", async () => {
  renderAt("/definitely-not-a-page");

  expect(await screen.findByText("404")).toBeInTheDocument();
});
```

- [ ] **Step 2: 執行測試，確認失敗**

Run: `npm run test`
預期：FAIL，訊息類似 `The requested module '../App' does not provide an export named 'AppRoutes'`。

- [ ] **Step 3: 建立 `/links` 頁面**

建立 `src/pages/Links.jsx`：

```jsx
import LinkIcon from "../components/LinkIcon";
import { useContent } from "../hooks/useContent";

// 這是全站唯一的功能性頁面：觀眾來這裡是要辦事的（買本、看圖、贊助、聯絡）。
// 刻意不載入 3D，也不套用首頁的重動效。
const Links = () => {
  const links = useContent("links", []) || [];

  return (
    <main className="min-h-dvh px-5 md:px-0 pt-28 md:pt-36 pb-20 text-[var(--fg)]">
      <div className="container mx-auto">
        <header className="mb-8 md:mb-12">
          <p className="text-[11px] tracking-[0.2em] opacity-60 uppercase">Links</p>
          <h1 className="text-4xl md:text-7xl font-black leading-none tracking-tight mt-2">
            All my online presence
          </h1>
          {links.length > 0 && (
            <p className="text-xs opacity-50 mt-3">{links.length} destinations</p>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block active:scale-[0.98] transition-transform"
            >
              <LinkIcon icon={item} type="wide" />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Links;
```

- [ ] **Step 4: 重寫 `src/App.jsx`**

完整檔案內容：

```jsx
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import { NavBar, Sidebar } from "./sections";

// Hero 帶進整個 three.js／R3F。必須 lazy，否則 /links 也會下載 3D。
const Hero = lazy(() => import("./sections/Hero"));
const Links = lazy(() => import("./pages/Links"));
const Bento = lazy(() => import("./sections/Bento"));
const SyncRig = lazy(() => import("./sections/SyncRig"));
const Footer = lazy(() => import("./components/Footer"));

const Shell = ({ children }) => (
  <>
    <NavBar />
    <Sidebar />
    <Suspense fallback={null}>
      {children}
      <Footer />
    </Suspense>
  </>
);

export const AppRoutes = ({ location }) => (
  <Routes location={location}>
    <Route
      path="/"
      element={
        <Shell>
          <Hero />
          <Bento />
        </Shell>
      }
    />
    <Route
      path="/links"
      element={
        <Shell>
          <Links />
        </Shell>
      }
    />
    <Route
      path="/projects/syncrig"
      element={
        <Shell>
          <SyncRig />
        </Shell>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <Router>
    <div className="min-h-screen">
      <AppRoutes />
    </div>
  </Router>
);

export default App;
```

- [ ] **Step 5: 移除 Linktree 與其 barrel 匯出**

```bash
git rm src/sections/Linktree.jsx
```

`src/sections/index.js` 改為：

```js
export { default as Sidebar } from "../components/SideBar";
export { default as NavBar } from "../components/NavBar";
export { default as Hero } from "./Hero";
```

注意檔名大小寫：磁碟上是 `SideBar.jsx`（大寫 B）。CI 跑在 Linux 上，大小寫不符會直接建置失敗。

- [ ] **Step 6: 修正 Hero 的死錨點**

`src/sections/Hero.jsx` 第 76 行：

```jsx
            href="#links"
```

改為：

```jsx
            href="#works"
```

理由：Linktree 已離開首頁，`#links` 不再存在；`#works` 是 Bento 區段的 id，仍在首頁上。

- [ ] **Step 7: 執行測試，確認通過**

Run: `npm run test`

預期輸出包含：

```
 ✓ src/test/routes.test.jsx (4 tests)
```

- [ ] **Step 8: 驗證 /links 真的不含 three.js**

```bash
npm run build && npm run verify:build
```

接著確認 three.js 被切到獨立 chunk 而非入口 chunk：

```bash
grep -l "WebGLRenderer" dist/assets/*.js
```

預期：印出一個或多個 chunk 檔名。接著確認 `dist/index.html` 的 `<script>` 所指的入口檔**不在**上面那份清單裡：

```bash
grep -o 'src="/assets/[^"]*"' dist/index.html
```

若入口檔名出現在 `grep -l` 的結果中，代表 lazy 沒生效，回頭檢查 Step 4 的 import。

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(routes): split the link hub out to /links

Hero becomes lazy so the hub does not pull three.js. The Explore anchor
on the home page pointed at #links, which no longer exists there; it now
points at #works.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: 重寫 NavBar 為路由導覽，刪除 SideBar

現行 NavBar 與 SideBar 都用錨點（`#home`／`#about`／`#projects`／`#contact`）加一個 `prefix()` hack，多頁下失效；且都用原生 `<a>`，會觸發整頁重載，讓 Task 5 的轉場不可能發生。

**Files:**
- Modify: `src/components/NavBar.jsx`（整檔重寫）
- Delete: `src/components/SideBar.jsx`
- Modify: `src/sections/index.js`
- Modify: `src/App.jsx`
- Modify: `src/constants/index.js:1-6`（移除 `navItems`）
- Create: `src/test/navbar.test.jsx`

**Interfaces:**
- Consumes: `AppRoutes`（Task 3）
- Produces: `NavBar` 渲染一個 accessible name 為 `Links` 的連結，`href` 為 `/links`；Task 5 的轉場測試會點擊它。

- [ ] **Step 1: 寫會失敗的導覽測試**

建立 `src/test/navbar.test.jsx`：

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { AppRoutes } from "../App";

vi.mock("../components/HeroExperience", () => ({
  default: () => <div data-testid="hero-canvas" />,
}));

test("Links 按鈕是 router 連結，不是原生整頁跳轉", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  const link = await screen.findByRole("link", { name: "Links" });
  expect(link).toHaveAttribute("href", "/links");
});

test("點擊 Links 會切換到樞紐頁", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  await user.click(await screen.findByRole("link", { name: "Links" }));

  expect(
    await screen.findByRole("heading", { name: /all my online presence/i })
  ).toBeInTheDocument();
});

test("導覽列不再有錨點連結", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  await screen.findByRole("link", { name: "Links" });

  for (const anchor of ["Home", "About", "Projects", "Contact"]) {
    expect(screen.queryByRole("link", { name: anchor })).not.toBeInTheDocument();
  }
});
```

- [ ] **Step 2: 執行測試，確認失敗**

Run: `npm run test`
預期：`navbar.test.jsx` 全部 FAIL，因為現行 NavBar 沒有名為 `Links` 的連結。

- [ ] **Step 3: 重寫 NavBar**

`src/components/NavBar.jsx` 完整內容：

```jsx
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// 只有兩個真正的目的地，所以不需要選單——一顆常駐的高對比按鈕就是導覽。
const NavBar = () => {
  return (
    <div className="w-full flex-center fixed z-50 top-0 left-0 md:p-0 px-5">
      <div className="container md:my-6 my-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[var(--fg)]" aria-label="Home">
          <img
            src="/images/logo.webp"
            alt=""
            className="md:size-10 size-9 object-cover object-center"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/links"
            className="px-4 py-2 rounded-md text-sm md:text-base font-semibold
                       bg-[var(--fg)] text-[var(--bg)]
                       hover:opacity-85 transition-opacity
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-[var(--fg)]"
          >
            Links
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
```

- [ ] **Step 4: 刪除 SideBar 並清掉引用**

```bash
git rm src/components/SideBar.jsx
```

`src/sections/index.js` 改為：

```js
export { default as NavBar } from "../components/NavBar";
export { default as Hero } from "./Hero";
```

`src/App.jsx` 的 import 與 `Shell` 改為：

```jsx
import { NavBar } from "./sections";
```

```jsx
const Shell = ({ children }) => (
  <>
    <NavBar />
    <Suspense fallback={null}>
      {children}
      <Footer />
    </Suspense>
  </>
);
```

- [ ] **Step 5: 移除失效的 navItems**

`src/constants/index.js` 開頭這段整段刪除：

```js
export const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];
```

檔案中其餘匯出（`iconsList`、`slides` 等）**保持不動**——`slides` 是上游 fork 遺留的未使用碼，不在本次範圍。

- [ ] **Step 6: 確認沒有殘留引用**

Run: `grep -rn "navItems\|SideBar\|Sidebar" src/`
預期：**無任何輸出**。若有，就是漏改的地方。

- [ ] **Step 7: 執行測試，確認通過**

Run: `npm run test`
預期：`routes.test.jsx`（4 則）與 `navbar.test.jsx`（3 則）全部通過。

- [ ] **Step 8: lint 與 build**

Run: `npm run lint && npm run build && npm run verify:build`
預期：三者皆通過，最後印出 `check-build: OK`。

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(nav): replace anchor nav with route links; drop SideBar

The old nav pointed at #home/#about/#projects/#contact via a prefix()
hack and used raw <a>, which full-reloads and would make page
transitions impossible. With only two real destinations a hamburger menu
hides something that does not need hiding.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: 巨型文字頁面轉場

規格第 8 節：多頁若只是硬跳，體驗會比原本的單頁更差。這是本階段優先級最高的體驗項目。

**Files:**
- Create: `src/components/PageTransition.jsx`
- Modify: `src/App.jsx`
- Create: `src/test/page-transition.test.jsx`

**Interfaces:**
- Consumes: `AppRoutes({ location })`（Task 3）、`NavBar` 的 `Links` 連結（Task 4）
- Produces: `PageTransition` 預設匯出，props 為 `{ children }`，其中 `children` 是 render prop，簽名 `(location: Location) => JSX.Element`。

- [ ] **Step 1: 寫會失敗的轉場測試**

建立 `src/test/page-transition.test.jsx`：

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import App, { AppRoutes } from "../App";
import PageTransition from "../components/PageTransition";
import { stubMatchMedia } from "./setup";

vi.mock("../components/HeroExperience", () => ({
  default: () => <div data-testid="hero-canvas" />,
}));

const renderWithTransition = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PageTransition>{(location) => <AppRoutes location={location} />}</PageTransition>
    </MemoryRouter>
  );

test("轉場層存在且預設不攔截點擊", () => {
  renderWithTransition("/");

  const overlay = screen.getByTestId("page-transition-overlay");
  expect(overlay).toBeInTheDocument();
  expect(overlay).toHaveAttribute("aria-hidden", "true");
});

test("reduced motion 下路由立即切換，不等動畫", async () => {
  // setup.js 的 beforeEach 每則測試都會重設 matchMedia，所以這裡覆寫不會外洩。
  stubMatchMedia((query) => query.includes("prefers-reduced-motion"));

  const user = userEvent.setup();
  renderWithTransition("/");

  await user.click(await screen.findByRole("link", { name: "Links" }));

  expect(
    await screen.findByRole("heading", { name: /all my online presence/i })
  ).toBeInTheDocument();
});

test("App 匯出的預設元件包含轉場層", () => {
  render(<App />);
  expect(screen.getByTestId("page-transition-overlay")).toBeInTheDocument();
});
```

- [ ] **Step 2: 執行測試，確認失敗**

Run: `npm run test`
預期：FAIL，`Failed to resolve import "../components/PageTransition"`。

- [ ] **Step 3: 建立轉場層**

建立 `src/components/PageTransition.jsx`：

```jsx
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

// 轉場不是額外糊上的裝飾層，它就是新頁標題的到場。
const LABELS = {
  "/": "RYOYAKS",
  "/links": "LINKS",
  "/projects/syncrig": "SYNCRIG",
};

const labelFor = (pathname) => LABELS[pathname] ?? "404";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [shownLocation, setShownLocation] = useState(location);
  const [label, setLabel] = useState(() => labelFor(location.pathname));
  const overlayRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (location.pathname === shownLocation.pathname) return;

    setLabel(labelFor(location.pathname));

    const overlay = overlayRef.current;
    const text = textRef.current;

    if (prefersReducedMotion() || !overlay || !text) {
      setShownLocation(location);
      return;
    }

    const tl = gsap.timeline();

    tl.set(overlay, { pointerEvents: "auto", yPercent: 100 })
      .set(text, { yPercent: 40, opacity: 0 })
      .to(overlay, { yPercent: 0, duration: 0.5, ease: "power3.inOut" })
      .to(text, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, "-=0.2")
      .add(() => {
        setShownLocation(location);
        window.scrollTo(0, 0);
      })
      .to(text, { yPercent: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, "+=0.15")
      .to(overlay, { yPercent: -100, duration: 0.5, ease: "power3.inOut" }, "-=0.1")
      .set(overlay, { pointerEvents: "none" });

    return () => {
      tl.kill();
    };
  }, [location, shownLocation]);

  return (
    <>
      <div
        ref={overlayRef}
        data-testid="page-transition-overlay"
        aria-hidden="true"
        className="fixed inset-0 z-[200] pointer-events-none flex items-center
                   justify-center overflow-hidden bg-[var(--fg)]"
        style={{ transform: "translateY(100%)" }}
      >
        <span
          ref={textRef}
          className="font-black tracking-tight leading-none text-[var(--bg)]
                     text-[18vw] md:text-[14vw]"
        >
          {label}
        </span>
      </div>

      {children(shownLocation)}
    </>
  );
};

export default PageTransition;
```

- [ ] **Step 4: 接進 App**

`src/App.jsx` 底部的 `App` 元件改為：

```jsx
const App = () => (
  <Router>
    <div className="min-h-screen">
      <PageTransition>
        {(location) => <AppRoutes location={location} />}
      </PageTransition>
    </div>
  </Router>
);
```

並在檔案頂端加入 import：

```jsx
import PageTransition from "./components/PageTransition";
```

- [ ] **Step 5: 執行測試，確認通過**

Run: `npm run test`

預期輸出包含：

```
 ✓ src/test/page-transition.test.jsx (3 tests)
```

若「reduced motion 下路由立即切換」逾時，檢查 `prefersReducedMotion()` 是否真的讀到被覆寫的 `matchMedia`。

- [ ] **Step 6: lint 與 build**

Run: `npm run lint && npm run build && npm run verify:build`
預期：三者皆通過。

- [ ] **Step 7: 手動驗證轉場**

```bash
npm run dev
```

在瀏覽器開啟 `http://localhost:5173/`：

1. 點擊右上角 **Links** → 應看到深色面板由下往上蓋滿、巨型 `LINKS` 字樣浮現、面板往上退開後停在樞紐頁，且頁面捲到頂端。
2. 點擊 logo 回首頁 → 同樣流程，字樣為 `RYOYAKS`。
3. 全程觀察瀏覽器分頁的載入指示器：**不應出現整頁重載**。
4. 在作業系統開啟「減少動態效果」後重新整理，再點一次 Links → 應瞬間切換，無面板動畫。

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(nav): giant-type page transition between routes

The destination name sweeps in as a full-bleed panel, the route swaps
behind it, then it lifts away. Falls back to an instant swap under
prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 完成後的狀態

- `/`、`/links`、`/projects/syncrig` 皆可直接開啟與重新整理，資源無 404。
- 站內導覽全部經過 react-router，無整頁重載，且都有轉場。
- `/links` 不下載 three.js。
- 4 個測試檔案、共 12 個案例保護上述行為。
- `prefers-reduced-motion` 下全站可用且無動畫。

## 規格中無法在本階段滿足的一項

規格第 15 節寫「`/links` 在無 JavaScript 或 WebGL 不可用時仍須完整可用」。
**WebGL 不可用**的部分本階段已滿足——`/links` 根本不載入 3D。
但**無 JavaScript**對一個純 client-side 的 Vite SPA 不可能成立：沒有 JS 就沒有任何 DOM 被渲染。
要真正做到需要預渲染（例如 `vite-plugin-prerender` 或改用支援 SSG 的框架），
那是獨立的架構決策，不應夾帶在本階段。已回報使用者，待其決定是否另開工作。

**下一份計畫**（規格第 18 節階段 4–6）：首頁區塊重構、治療層（Lenis ＋ ScrollTrigger ＋ 巨型文字動態 ＋ 游標回饋）、avatar 平面化與 LookAt。
