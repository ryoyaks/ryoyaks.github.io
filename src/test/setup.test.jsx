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
