import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "../src/app/page";

afterEach(cleanup);

test("renders the starter page with primary navigation targets", () => {
  render(<Home />);

  expect(screen.getByRole("img", { name: "Next.js logo" })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: /to get started, edit the page\.tsx file/i,
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Templates" })).toHaveAttribute(
    "href",
    expect.stringContaining("vercel.com/templates"),
  );
  expect(screen.getByRole("link", { name: "Learning" })).toHaveAttribute(
    "href",
    expect.stringContaining("nextjs.org/learn"),
  );
  expect(screen.getByRole("link", { name: /deploy now/i })).toHaveAttribute(
    "href",
    expect.stringContaining("vercel.com/new"),
  );
  expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute(
    "href",
    expect.stringContaining("nextjs.org/docs"),
  );
});
