import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const sourceRoot = fileURLToPath(new URL("../../", import.meta.url));

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${sourceRoot}/`), "utf8");
}

it("sets explicit text color so popup inputs do not inherit muted container color", () => {
  const inputSource = readSource("components/ui/input.tsx");

  expect(inputSource).toContain("text-foreground");
  expect(inputSource).toContain("placeholder:text-[var(--app-text-subtle)]");
  expect(inputSource).toContain("selection:bg-primary");
  expect(inputSource).toContain("selection:text-primary-foreground");
});
