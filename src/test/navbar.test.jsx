import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import { AppRoutes } from "../App";

// Hero 也有一個通往 /links 的巨型連結，所以查詢一律限縮在導覽列裡。
const navLinks = () => within(screen.getByRole("navigation", { name: "Main" }));

vi.mock("../components/HeroExperience", () => ({
  default: () => <div data-testid="hero-canvas" />,
}));

test("Links 按鈕是 router 連結，不是原生整頁跳轉", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  const link = await navLinks().findByRole("link", { name: "Links" });
  expect(link).toHaveAttribute("href", "/links");
});

test("點擊 Links 會切換到樞紐頁", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  await user.click(await navLinks().findByRole("link", { name: "Links" }));

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

  await navLinks().findByRole("link", { name: "Links" });

  for (const anchor of ["Home", "About", "Projects", "Contact"]) {
    expect(navLinks().queryByRole("link", { name: anchor })).not.toBeInTheDocument();
  }
});
