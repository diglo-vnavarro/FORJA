import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { ForjaLogo } from "./ForjaLogo";

it("renders the brand master inline so it inherits the token color", () => {
  const { container } = render(<ForjaLogo variant="lockup" />);
  const logo = screen.getByRole("img", { name: "FORJA" });
  expect(logo.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  expect(logo.querySelector("path")).toHaveAttribute("fill", "currentColor");
  expect(container.querySelector("img")).toBeNull();
  expect(logo.querySelector("title")).toBeNull();
});

it("marks the inverse variant with a class instead of a color filter", () => {
  render(<ForjaLogo variant="symbol" inverse />);
  expect(screen.getByRole("img", { name: "FORJA" })).toHaveClass("forja-logo--inverse");
});

it.each(["forja-symbol.svg", "forja-wordmark.svg", "forja-lockup-horizontal.svg"])("keeps the static copy of %s identical to the master", (file) => {
  const read = (dir: string) => readFileSync(`${dir}/${file}`, "utf8").replace(/\r\n/g, "\n");
  expect(read("assets/brand/master")).toBe(read("src/design-system/forja/brand"));
});
