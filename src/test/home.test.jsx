import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { AppRoutes } from "../App";

// R3F 的 Canvas 在 jsdom 沒有 WebGL 可用，替換成佔位元素。
vi.mock("../components/HeroExperience", () => ({
  default: () => <div data-testid="hero-canvas" />,
}));

const MAIN = {
  hero: {
    eyebrow: "Hello, I'm",
    name: "RyoyakS",
    altNames: "りょうや · 六亞",
    roles: "Illustrator / 3D Creator / Dev",
    flourish: "↘ ↘ ↘",
    bigTitle: "CONTENT CREATOR",
    exploreLabel: "Explore",
  },
  about: {
    eyebrow: "ABOUT",
    headline: "A multi-disciplinary creator from Taiwan",
    body: "I draw, sculpt and code.",
    tags: ["Illustration"],
  },
  status: { eyebrow: "STATUS", label: "Open for commissions", subLabel: "Email me", active: true },
  tools: { eyebrow: "Tools I Use", order: ["blender", "figma"] },
  contact: { eyebrow: "Contact", label: "Get in\ntouch →", mailto: "hi@example.com" },
};

const PROJECTS = {
  featured: {
    id: "syncrig",
    name: "SyncRig",
    tagline: "Mocap that lets you keep creating",
    poster: "/media/syncrig/demo-poster.webp",
    video: "/media/syncrig/demo.webm",
    tags: ["mocap"],
    href: "/projects/syncrig",
    ctaLabel: "Read more →",
  },
  more: [
    { id: "xrblender", name: "XRBlender", tagline: "Step inside your 3D scene and edit it from within", status: "wip" },
    { id: "vr-breakroom", name: "VR Breakroom", tagline: "Scan any space and turn it into somewhere to let off steam", status: "wip" },
    { id: "meme-searcher", name: "Meme Searcher", tagline: "Find any meme you have in mind", status: "wip" },
  ],
};

const stubContent = () =>
  vi.stubGlobal(
    "fetch",
    vi.fn((url) => {
      const body = String(url).includes("projects") ? PROJECTS : MAIN;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
    })
  );

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );

test("首頁渲染三個編號區塊：01 About／02 Tools／03 Works", async () => {
  stubContent();
  renderHome();

  expect(await screen.findByText(/01\s*\/\s*About/)).toBeInTheDocument();
  expect(screen.getByText(/02\s*\/\s*Tools/)).toBeInTheDocument();
  expect(screen.getByText(/03\s*\/\s*Works/)).toBeInTheDocument();
});

test("編號區塊在內容抓取失敗時仍然存在（脊椎不依賴內容）", async () => {
  // setup.js 預設的 fetch stub 回傳 null，等同內容不可用。
  renderHome();

  expect(await screen.findByText(/01\s*\/\s*About/)).toBeInTheDocument();
  expect(screen.getByText(/02\s*\/\s*Tools/)).toBeInTheDocument();
  expect(screen.getByText(/03\s*\/\s*Works/)).toBeInTheDocument();
});

test("Works 列出三個具名的進行中專案，而非匿名佔位", async () => {
  stubContent();
  renderHome();

  expect(await screen.findByRole("heading", { name: "XRBlender" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "VR Breakroom" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Meme Searcher" })).toBeInTheDocument();
  expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
});

test("進行中專案帶有狀態標記", async () => {
  stubContent();
  renderHome();

  await screen.findByRole("heading", { name: "XRBlender" });
  expect(screen.getAllByText("In progress")).toHaveLength(3);
});

test("精選作品連往 /projects/syncrig 且為 router 連結", async () => {
  stubContent();
  renderHome();

  const link = await screen.findByRole("link", { name: /syncrig/i });
  expect(link).toHaveAttribute("href", "/projects/syncrig");
});
