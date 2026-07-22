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
