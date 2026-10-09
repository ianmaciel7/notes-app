// @vitest-environment node

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type DataLayerFile,
  type DataLayerViolationKind,
  findDataLayerViolations,
} from "./data-layer-structure-lib";

function dataLayerFiles(): DataLayerFile[] {
  const root = join(process.cwd(), "src", "data");

  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const filePath = join(entry.parentPath, entry.name);
      const path = relative(process.cwd(), filePath);

      return {
        path,
        source: readFileSync(filePath, "utf8"),
      };
    });
}

const conformingSource = [
  'import "server-only";',
  "",
  'const prefix = "space";',
  "type PrivateResult = { id: string };",
  "",
  "function formatId(id: string): PrivateResult {",
  ["  return { id: `", "$", "{prefix}-$", "{id}` };"].join(""),
  "}",
  "",
  "export async function readSpace(id: string) {",
  "  return formatId(id);",
  "}",
  "",
].join("\n");

const negativeFixtures: ReadonlyArray<{
  name: string;
  file: DataLayerFile;
  kind: DataLayerViolationKind;
}> = [
  {
    name: "a non-DAL filename",
    file: { path: "src/data/helper.ts", source: conformingSource },
    kind: "invalid-file-name",
  },
  {
    name: "a missing server-only import",
    file: {
      path: "src/data/space-dal.ts",
      source: "export async function readSpace() {}\n",
    },
    kind: "missing-server-only-import",
  },
  {
    name: "an exported const",
    file: {
      path: "src/data/space-dal.ts",
      source: 'import "server-only";\nexport const space = "space";\n',
    },
    kind: "exported-variable",
  },
  {
    name: "an exported type",
    file: {
      path: "src/data/space-dal.ts",
      source: 'import "server-only";\nexport type Space = { id: string };\n',
    },
    kind: "exported-type",
  },
  {
    name: "an exported class",
    file: {
      path: "src/data/space-dal.ts",
      source: 'import "server-only";\nexport class Space {}\n',
    },
    kind: "exported-class",
  },
  {
    name: "an exported enum",
    file: {
      path: "src/data/space-dal.ts",
      source: 'import "server-only";\nexport enum SpaceKind { Personal }\n',
    },
    kind: "exported-enum",
  },
  {
    name: "an exported non-async function",
    file: {
      path: "src/data/space-dal.ts",
      source: 'import "server-only";\nexport function readSpace() {}\n',
    },
    kind: "exported-non-async-function",
  },
  {
    name: "a re-export",
    file: {
      path: "src/data/space-dal.ts",
      source: 'import "server-only";\nexport { readSpace } from "./other";\n',
    },
    kind: "re-export",
  },
  {
    name: "a default function export",
    file: {
      path: "src/data/space-dal.ts",
      source:
        'import "server-only";\nexport default async function readSpace() {}\n',
    },
    kind: "default-export",
  },
  {
    name: "a default expression export",
    file: {
      path: "src/data/space-dal.ts",
      source: 'import "server-only";\nexport default readSpace;\n',
    },
    kind: "default-export",
  },
  ...["uid", "userId", "ownerId"].map((parameter) => ({
    name: `an exported function with a ${parameter} parameter`,
    file: {
      path: "src/data/space-dal.ts",
      source: `import "server-only";\nexport async function readSpace(${parameter}: string) {}\n`,
    },
    kind: "exported-function-identity-parameter" as const,
  })),
];

describe("data layer structure guard", () => {
  it("keeps real data-layer files to async DAL operations", () => {
    expect(findDataLayerViolations(dataLayerFiles())).toEqual([]);
  });

  it("accepts a conforming DAL file with private helpers", () => {
    expect(
      findDataLayerViolations([
        { path: "src/data/space-dal.ts", source: conformingSource },
      ]),
    ).toEqual([]);
  });

  it.each(negativeFixtures)("detects $name", ({ file, kind }) => {
    expect(findDataLayerViolations([file])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: file.path,
          kind,
          message:
            "Move pure rules to src/domain, server adapters to src/lib/firebase, and keep only async DAL operations here.",
        }),
      ]),
    );
  });
});
