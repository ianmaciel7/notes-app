import { afterEach, expect, it, vi } from "vitest";
import { objectEntityFixture } from "@/app/_components/objects/object-view-fixtures";
import { copyWorkspaceText, entityToMarkdown } from "@/lib/spaces/object-transfer";

afterEach(() => vi.unstubAllGlobals());
it("copies stored content instead of just its title", () => {
  const markdown = entityToMarkdown(objectEntityFixture());
  expect(markdown).toContain("# Research notes");
  expect(markdown).toContain("Saved content for this object.");
  expect(markdown).toContain("#research");
});
it("propagates clipboard permission failures and does not simulate success", async () => {
  vi.stubGlobal("navigator", {
    clipboard: { writeText: vi.fn().mockRejectedValue(new Error("Permission denied")) },
  });
  await expect(copyWorkspaceText("text")).rejects.toThrow("Permission denied");
  vi.stubGlobal("navigator", {});
  await expect(copyWorkspaceText("text")).rejects.toThrow("não está disponível");
});
