import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../src/app/page";

test("renders the notes workspace home page", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Meet your focused workspace.",
    }),
  ).toBeInTheDocument();

  expect(screen.getByRole("link", { name: "Start writing" })).toHaveAttribute(
    "href",
    "#workspace",
  );
  expect(screen.getByRole("link", { name: "View notes" })).toHaveAttribute(
    "href",
    "#notes",
  );

  const workspace = screen.getByRole("region", { name: "Notes workspace" });
  expect(
    within(workspace).getByRole("heading", {
      level: 2,
      name: "Product notes",
    }),
  ).toBeInTheDocument();

  for (const noteTitle of ["Launch checklist", "Research clips", "Team sync"]) {
    expect(
      within(workspace).getByRole("heading", {
        level: 4,
        name: noteTitle,
      }),
    ).toBeInTheDocument();
  }

  for (const status of ["Done", "In review", "Next"]) {
    expect(within(workspace).getByText(status)).toBeInTheDocument();
  }
});
