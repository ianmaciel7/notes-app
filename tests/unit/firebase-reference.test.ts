import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const referenceDir = "src/components/firebase";
const manifestPath = "tests/unit/firebase-reference.manifest.sha256";

function hashFile(file: string) {
  return createHash("sha256")
    .update(readFileSync(file, "utf8").replace(/\r\n/g, "\n"))
    .digest("hex");
}

function snapshotReference() {
  return readdirSync(referenceDir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .map(
      (file) =>
        `${hashFile(file)}  ${relative(".", file).replaceAll("\\", "/")}`,
    )
    .sort((a, b) => a.slice(66).localeCompare(b.slice(66)));
}

describe("firebase reference directory", () => {
  it("matches the immutable upstream manifest", () => {
    const current = snapshotReference();

    if (process.env.FIREBASE_REFERENCE_UPDATE === "1") {
      writeFileSync(manifestPath, `${current.join("\n")}\n`);
      return;
    }

    const baseline = readFileSync(manifestPath, "utf8")
      .replace(/\r\n/g, "\n")
      .trim()
      .split("\n");
    expect(current).toEqual(baseline);
  });
});
