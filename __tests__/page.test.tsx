import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../src/app/page";

test("renders the default Next.js home page", () => {
  render(<Home />);

  expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
  expect(screen.getByText("src/app/page.tsx")).toBeInTheDocument();

  expect(screen.getByRole("link", { name: /deploy now/i })).toHaveAttribute(
    "href",
    expect.stringContaining("https://vercel.com/new"),
  );
  expect(screen.getByRole("link", { name: "Read our docs" })).toHaveAttribute(
    "href",
    expect.stringContaining("https://nextjs.org/docs"),
  );
  expect(screen.getByRole("link", { name: "Learn" })).toHaveAttribute(
    "href",
    expect.stringContaining("https://nextjs.org/learn"),
  );
});
