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

test("AppRoutes 使用傳入的 location prop，而非 router 目前所在的位置", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes location={{ pathname: "/links", search: "", hash: "", state: null, key: "explicit" }} />
    </MemoryRouter>
  );

  expect(
    await screen.findByRole("heading", { name: /all my online presence/i })
  ).toBeInTheDocument();
});
