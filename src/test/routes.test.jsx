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
