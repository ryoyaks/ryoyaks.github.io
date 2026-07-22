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
