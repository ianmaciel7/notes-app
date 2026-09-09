import { describe, expect, it } from "vitest";

import {
  shouldRenderMainTabAsNeutral,
  shouldUseStrongAppHeaderTabLabel,
  type AppHeaderTab,
} from "@/components/app-header-tabs";

describe("app header tab presentation", () => {
  it("keeps object list tabs visually distinct from individual object tabs", () => {
    const objectTab = { id: "object-1", label: "rebase", kind: "object" } satisfies AppHeaderTab;
    const objectListTab = {
      id: "page",
      label: "Páginas",
      kind: "object-list",
    } satisfies AppHeaderTab;

    expect(shouldUseStrongAppHeaderTabLabel(objectListTab, true)).toBe(true);
    expect(shouldUseStrongAppHeaderTabLabel(objectTab, true)).toBe(false);
    expect(shouldUseStrongAppHeaderTabLabel(objectListTab, false)).toBe(false);
  });

  it("does not collapse a single object list tab into the neutral item-tab treatment", () => {
    const objectTab = { id: "object-1", label: "rebase", kind: "object" } satisfies AppHeaderTab;
    const objectListTab = {
      id: "page",
      label: "Páginas",
      kind: "object-list",
    } satisfies AppHeaderTab;

    expect(shouldRenderMainTabAsNeutral(objectListTab, 1)).toBe(false);
    expect(shouldRenderMainTabAsNeutral(objectTab, 1)).toBe(true);
    expect(shouldRenderMainTabAsNeutral(objectTab, 2)).toBe(false);
  });
});
