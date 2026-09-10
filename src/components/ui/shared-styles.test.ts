import { expect, it } from "vitest";

import {
  floatingSurfaceBaseClass,
  workspaceSubmenuStateClass,
} from "@/components/ui/shared-styles";

it("uses explicit Capacities border tokens for shared floating surfaces", () => {
  expect(floatingSurfaceBaseClass).toContain("border-[var(--app-border-front)]");
  expect(floatingSurfaceBaseClass).not.toMatch(/(^|\s)border-front(\s|$)/);
});

it("keeps workspace submenu motion fade-only", () => {
  expect(workspaceSubmenuStateClass).toBe(
    "transition-[background-color,color,opacity] duration-150 ease-out motion-reduce:transition-none motion-reduce:animate-none",
  );
  expect(workspaceSubmenuStateClass).not.toContain("transform");
});
