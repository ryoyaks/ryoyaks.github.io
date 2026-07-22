# ryoyaks.com 互動邏輯改版 — 設計規格

- **日期**：2026-07-22
- **分支**：`redesign/multi-page`
- **狀態**：設計已與使用者確認，待轉為實作計畫

---

## 1. 問題

現行網站是單一路由 `/` 把 Hero、Linktree、Bento 全部攤平在同一頁，加一個 `/projects/syncrig`
子路由。使用者對「整體互動邏輯」不滿意。

經過多輪釐清，問題**不在**視覺不夠炫，而在兩件事：

1. **沒有頁面層級。** 所有內容擠在一頁，沒有「進入某處」的感覺。
2. **沒有治療層。** 全站唯一的動效是 Bento 磚塊進場時一次性的 GSAP stagger；
   沒有捲動驅動、沒有頁面轉場、沒有游標回饋。

## 2. 參考與美學方向

使用者選定的參考站：

| 站 | 關鍵 |
|---|---|
| wantedfornothing.com | 模組化卡片格、字距拉開的標準字、常駐 CTA |
| madness.ai | 編號分節（01/02/03/04）、3D 當元素、Wanted For Nothing 同一工作室的作品 |
| art-yakushev.com | 多頁結構（Home/Work/Info/Contact）、即時本地時間、揭幕式開場 |

**美學定調：平面設計感為主，巨型文字即圖像，3D 是被排進版面的元素而不是環境。**

## 3. 已排除的方向（不再重開）

| 方向 | 排除理由 |
|---|---|
| 粒子場 / 流體場當開場介質 | 使用者明確表示不必用粒子特效 |
| 3D 空間世界、鏡頭穿行場景 | 與「平面設計感」衝突；參考站沒有一個這樣做 |
| 拖曳式無限畫布、非線性導覽 | 使用者要的是頁面層級，不是空間導覽 |
| 標準七路由多頁（art-yakushev 式） | 內容量不足，會每頁都空 |
| 首頁僅作玄關（無內容） | 浪費第一屏，且 SEO 最弱 |

## 4. 路由架構

```
/                   首頁 ＝ 實驗場，捲動到底
/links              樞紐，只有 12 個連結
/projects/syncrig   個案（維持現有路徑，不改名）
/lab/:slug          單一實驗（本次不實作，預留）
*                   NotFound
```

`/projects/syncrig` 維持原路徑。它已上線，改名只會換來壞掉的外部連結。
未來作品沿用 `/projects/:slug`；實驗用 `/lab/:slug`。

## 5. 頁面職責

| 路由 | 放什麼 | 刻意不放什麼 |
|---|---|---|
| `/` | 身分（巨型文字 ＋ avatar）、About、Tools、狀態、Works、Contact | 那 12 個連結 |
| `/links` | 12 個連結 | **不載入 3D、不載入首頁的重動效** |

`/links` 是全站唯一的**功能性**頁面。觀眾來這裡是要辦事的（買本、看圖、贊助、聯絡）。
成功標準不是好看，是**手機上秒開、拇指按得到**。刻意做得比首頁樸素，這是設計決定。

## 6. 前置條件：修正 GitHub Pages 的 SPA 路由（阻擋性）

**現況是壞的，而且與本次改版無關地已經壞了。**

- `public/_redirects` 是 Netlify 慣例，**GitHub Pages 完全忽略**。
- `vite.config.js` 設 `base: "./"`，產出相對資源路徑。

結果：直接開啟或重新整理 `/projects/syncrig` 會得到 404；即使有 fallback，
資源也會被解析成 `/projects/assets/…` 而載入失敗。多頁架構會把這個問題從一條路由放大到四條。

**修正方式：**

1. `vite.config.js` 的 `base` 由 `"./"` 改為 `"/"`。
   本站是 user site（`ryoyaks.github.io`）部署在網域根目錄，`/` 才是正確值；
   `"./"` 是針對子路徑部署的設定，在這裡是錯的。
2. 在 `.github/workflows/deploy.yml` 的 build 步驟之後加入
   `cp dist/index.html dist/404.html`，讓 GitHub Pages 對任何未知路徑回傳 SPA 入口。
3. 移除 `public/_redirects`（對 GitHub Pages 無作用，留著會誤導）。

**自訂網域**：`ryoyaks.com` 已購買但尚未指向本 repo，故本次不處理。
記錄供日後參考：`peaceiris/actions-gh-pages` 每次強推 `dist` 到 gh-pages 分支，
會覆蓋分支上的 `CNAME` 檔。屆時需在 action 加上 `cname: ryoyaks.com`，否則自訂網域會失效。

## 7. 導覽：重寫

**現況問題**（[NavBar.jsx](../../../src/components/NavBar.jsx)、[Sidebar.jsx](../../../src/components/Sidebar.jsx)）：

- 兩者都是**錨點導覽**（`#home` / `#links` / `#works`），加一個 `prefix()` hack
  在非首頁時把 `#x` 改寫成 `/#x`。多頁架構下這套失效。
- 兩者都用原生 `<a href>`。**原生 `<a>` 觸發整頁重載，頁面轉場在技術上不可能發生。**

**新設計：**

- 所有站內導覽改用 react-router 的 `<Link>`。這是第 8 節的硬性前提。
- Nav 收到最小：
  - 左：logo → `/`
  - 右：高對比的 **Links** 按鈕 → `/links`，加 `ThemeToggle`
- **移除 Sidebar。** 只有兩個真正的目的地，漢堡選單是在藏一個不需要藏的東西；
  而常駐的高對比按鈕正是使用者要的「一進去有個按鈕可以跳到樞紐」。
- `navItems`（`src/constants/index.js`）錨點式資料隨之失效，需改為路由式或移除。

## 8. 頁面轉場（本次優先級最高的單一項目）

多頁若只是硬跳，體驗會**比現行單頁更差**——失去捲動連續感卻換不到東西。
參考站之所以像「一件作品」而非「一疊網頁」，靠的全是轉場。

**形式：巨型文字轉場。**

點擊 → 目標頁名稱（`LINKS` / `SYNCRIG`）以巨型文字衝進畫面遮住舊頁
→ 新頁在其後就位 → 文字退場並**落位成新頁的標題**。

選這個形式的理由：轉場不是額外糊上的裝飾層，它**就是新頁標題的到場**，
直接服務「巨型文字即圖像」的定調。純 GSAP ＋ DOM，不碰 WebGL，手機可承受。

**實作要點**：一個攔截路由變更的轉場層 ＋ GSAP timeline。
現有依賴 `gsap` 與 `@gsap/react` 已足夠，不需新增。

## 9. 首頁 `/` 的區塊順序

```
—     Hero        身分：巨型文字 ＋ avatar，滿版
01    About       是誰、在做什麼 ＋ 接不接案（合併現有 about ＋ status）
02    Tools       八個工具
03    Works       SyncRig 精選 ＋ 三個進行中
—     Contact     大型 CTA ＋ footer
```

現行 Bento 把 About／Featured／Tools／Status／Contact 全塞進同一個格狀區塊，
只掛一個 `02 Works` 標題——標題與內容不符，且整頁只有兩個節點，沒有節奏。
拆成三個編號區塊給頁面一根脊椎（madness.ai 的手法）。

**刻意不做：本次不加 `04 Lab` 區塊。** 尚無實驗可放，空區塊比沒有區塊更傷。
待第一個實驗完成，再同時新增 `04` 區塊與 `/lab/:slug` 路由。

## 10. 治療層

| 項 | 現況 | 目標 |
|---|---|---|
| 3D | `absolute inset-0` 滿版 canvas ＋ `pointer-events-none`，等同背景牆紙 | 被排進版面：明確的框、與巨型文字有刻意的疊壓關係、佔據指定區域 |
| 捲動 | 僅 Bento 進場一次性 `opacity/y` stagger | GSAP ScrollTrigger 綁定區塊進場、文字變形、avatar 視角；捲動成為可往回拉的軸 |
| 巨型文字 | 已達 `9rem`／`7.5rem`，但完全靜止 | 捲動驅動字距收放、分裂位移、遮罩揭露；與第 8 節轉場共用同一套文字動態系統 |
| 游標 | 僅有 hover 透明度變化 | 連結與卡片的磁吸位移 |

## 11. Avatar：平面化與 LookAt

### 11.1 現況（重要）

- **實際渲染的是 GLB**：`/6YAbeta1.glb`（3.9 MB），經 gltfjsx 產生的
  [`src/components/models/6YAbeta1.jsx`](../../../src/components/models/6YAbeta1.jsx)，由 `HeroExperience` 使用。
- **VRM 路徑存在但未接上**：`public/media/avatar/kua_street.vrm`（8.8 MB）與功能完整的
  [`src/components/VRMAvatar.jsx`](../../../src/components/VRMAvatar.jsx)（已在 `useFrame` 內呼叫 `vrm.update(delta)`）
  皆未被 Hero 使用；`public/content/main.json` 的 `avatar` 區塊同樣是死的。
- `@pixiv/three-vrm` 與 `@pixiv/three-vrm-animation` 已安裝。
- 相機為透視投影，`fov: 90`。

### 11.2 設計問題

3D 角色跟隨游標，天生讀起來像「貼在海報上的小工具」——她立體、柔軟、有生命，
而周圍版面是壓平、構圖過、印刷的。衝突不在「會動」，在**她看起來來自另一個空間**。

解法不是少動，是**讓她本來就屬於這個平面**。

### 11.3 五個手段（由重到輕）

1. **正交投影**（最關鍵）。改用 orthographic camera。沒有透視收斂，
   「3D viewport」的破綻消失，她與巨型文字位於同一空間。R3F 為 `<Canvas orthographic>`。
2. **平面著色**。Toon／cel shading，硬階梯陰影，關閉高光。
   她成為一張會動的插畫，而非渲染出的模型——對插畫家而言這也最合理。
3. **硬邊界裁切**。放進明確的框（矩形／圓／去背剪影邊界）。
   **有框＝被排版的元素，無框＝背景**；這是「元素 vs 環境」視覺上唯一真正的差別。
4. **LookAt 幅度壓縮**。眼睛全追，頭部僅 ±10–15°，身體不動。
   大幅追蹤是玩具，微幅是「她注意到你了」。
5. **距離觸發**。預設為構圖過的靜態姿勢；游標進入她的區域才抬眼，
   移開則緩回原構圖。**頁面靜止時 100% 是平面設計，互動是額外獎勵。**

1 ＋ 3 ＋ 5 為核心，2 ＋ 4 為調味。

### 11.4 GLB 或 VRM

LookAt 的實作路徑取決於用哪個資產：

- **改用 VRM**：`VRMLookAt` 為原生能力，`VRMAvatar.jsx` 已可用，只需將
  `vrm.lookAt.target` 指向一個由游標位置驅動的物件。**實作最小。**
  代價：8.8 MB vs 3.9 MB，約 2.2 倍。
- **維持 GLB**：需自行依骨架名稱旋轉頭／眼骨骼，較脆弱且與模型結構耦合。

**建議採用 VRM 路徑**，並以資產壓縮（目標 ≤5 MB）抵銷體積代價。
`/links` 不載入 3D，因此體積只影響首頁。此決定需在實作計畫中確認 VRM 外觀與 GLB 一致。

## 12. Works 內容

`public/content/projects.json` 現為一個精選（SyncRig）＋三個匿名 `"Coming soon"` 佔位。
改為一個精選 ＋ 三個**具名**進行中：

| 名稱 | Tagline | 狀態 |
|---|---|---|
| SyncRig | Mocap that lets you keep creating | 已完成，有 demo 影片，連往 `/projects/syncrig` |
| XRBlender | 透過潛入你的 3D 創作，編輯你的世界 | 進行中 |
| VR Breakroom | 快速掃描環境，讓任意環境變成你發洩的地方 | 進行中 |
| Meme Searcher | 找到你想要的任何迷因圖片 | 進行中 |

資料結構：`more[]` 改用真名，`placeholder: true` 換成 `status: "wip"`。

**語言一致性**：SyncRig 的 tagline 是英文，三個新專案是中文，同一個區塊會混用兩種語言。
全站現況本來就混用（`main.json` 英文、`links.json` 有中文副標），因此不視為阻擋項；
但實作時應向使用者確認是要統一，還是刻意保持混用。

視覺上移除現行的「虛線框 ＋ 60% 透明度」。該處理在說「這裡還沒好，抱歉」；
具名 ＋ 正常對比 ＋ 小型狀態標記，說的是「這是我在做的東西」。
同一批內容，兩種姿態。

## 13. 受影響的檔案

| 檔案 | 動作 |
|---|---|
| `vite.config.js` | `base` 改 `/` |
| `.github/workflows/deploy.yml` | build 後複製 `404.html`；視情況加 `cname` |
| `public/_redirects` | 刪除 |
| `src/App.jsx` | 新增 `/links` 路由；包入轉場層 |
| `src/components/NavBar.jsx` | 重寫為路由導覽 ＋ Links 按鈕 |
| `src/components/Sidebar.jsx` | 刪除 |
| `src/constants/index.js` | `navItems` 改路由式或移除 |
| `src/sections/Linktree.jsx` | 移出首頁，成為 `/links` 頁面 |
| `src/sections/Bento.jsx` | 拆成 About／Tools／Works 三個編號區塊 |
| `src/sections/Hero.jsx` | 區段維持滿版視窗高；canvas 由 `absolute inset-0` 背景改為版面內有邊界的區塊 |
| `src/components/HeroExperience.jsx` | 正交相機、平面著色、LookAt；改用 `VRMAvatar` |
| `src/components/VRMAvatar.jsx` | 接上 Hero；加入 LookAt target |
| `src/components/models/6YAbeta1.jsx` | 若改用 VRM 則成為未使用碼。**保留不刪**，於實作計畫中標注待使用者確認 |
| `public/content/projects.json` | `more[]` 換真名與 `status` |
| `public/content/main.json` | `avatar` 區塊接上實際使用 |
| 新增 | 轉場層元件、`/links` 頁面元件 |

## 14. 依賴

- **新增**：`lenis`（平滑捲動）。ScrollTrigger 綁原生捲動會有頓挫，
  Lenis ＋ ScrollTrigger ＋ GSAP 是此類網站的標準組合。
- **已具備**：`gsap`、`@gsap/react`、`react-router-dom`、`@react-three/fiber`、
  `@react-three/drei`、`@pixiv/three-vrm`、`three`。

## 15. 降級與可及性

- `prefers-reduced-motion: reduce` 時：轉場退為淡入淡出，
  ScrollTrigger 動畫改為靜態最終狀態，avatar LookAt 停用。
  現行 Bento 已有此判斷，需擴及所有新動效。
- 鍵盤焦點必須可見；轉場層不得攔截焦點。
- `/links` 在無 JavaScript 或 WebGL 不可用時仍須完整可用。
- `leva` 目前列於 production dependencies，僅 `?debug=1` 顯示。
  Hero 重寫會大量改動其調參對象（相機、著色、LookAt），屆時 leva 面板的欄位多半失效。
  **本次保留 leva 與 debug 面板**，但欄位需隨新參數更新；是否移除留待使用者決定，不在本次處理。

## 16. 不在本次範圍

- `/lab/:slug` 實驗頁與首頁 `04 Lab` 區塊（無內容可放）
- `/projects/:slug` 的通用化（目前只有 syncrig 一個）
- 既有 `README.md` 的修正（上游 fork 遺留，與本次無關）
- `CLAUDE.md` 內容更新（可於實作後另行處理）

## 17. 內容輸入

已於 2026-07-22 由使用者提供，均已併入本規格：

- 三個進行中專案的 tagline → 第 12 節。
- `ryoyaks.com` 尚未指向本 repo，CNAME 不在本次範圍 → 第 6 節。

實作時仍需確認的一項：第 12 節的中英文混用是否刻意。

## 18. 交付順序

選擇架構 B 的理由之一是可分批上線。實作計畫應照此順序，每一階段結束時網站都是可部署的：

1. **修好路由基礎**（第 6 節）。純基礎建設，不改任何視覺。
   驗證：`/projects/syncrig` 直接開啟正常。
2. **拆出 `/links` ＋ 重寫 nav**（第 5、7 節）。此時網站已是多頁，但還沒有轉場。
   驗證：兩個路由皆可直接開啟，導覽不重載整頁。
3. **頁面轉場**（第 8 節）。優先級最高的體驗項目。
   驗證：任何站內導覽都經過轉場；reduced-motion 下退為淡入淡出。
4. **首頁重構**（第 9 節）。Bento 拆成三個編號區塊，Works 換真名（第 12 節）。
5. **治療層**（第 10 節）。Lenis ＋ ScrollTrigger、巨型文字動態、游標回饋。
6. **Avatar 平面化與 LookAt**（第 11 節）。改動面最大、風險最高，放最後。

## 19. 成功標準

1. 直接開啟或重新整理 `/links`、`/projects/syncrig` 皆正常載入，資源無 404。
2. 站內任何導覽皆不觸發整頁重載，且都經過轉場。
3. `/links` 在行動裝置上不下載任何 3D 資產。
4. 首頁靜止截圖看起來是一張平面設計海報；游標進入 avatar 區域她才有反應。
5. `prefers-reduced-motion` 開啟時，全站無動態但資訊完整可讀。
6. `npm run build` 與 `npm run lint` 皆通過。
