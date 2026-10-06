import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const referenceDir = "src/components/firebase";
const manifestPath = "tests/unit/firebase-reference.manifest.json";

function hashFile(file: string) {
  return createHash("sha256")
    .update(readFileSync(file, "utf8").replace(/\r\n/g, "\n"))
    .digest("hex");
}

function snapshotReference() {
  return Object.fromEntries(
    readdirSync(referenceDir, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => join(entry.parentPath, entry.name))
      .map((file) => [
        relative(".", file).replaceAll("\\", "/"),
        hashFile(file),
      ])
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

describe("firebase reference directory", () => {
  it("matches the immutable upstream manifest", () => {
    const current = snapshotReference();

    if (process.env.FIREBASE_REFERENCE_UPDATE === "1") {
      writeFileSync(manifestPath, `${JSON.stringify(current, null, 2)}\n`);
      return;
    }

    const baseline = JSON.parse(readFileSync(manifestPath, "utf8"));
    expect(current).toEqual(baseline);
  });
});
