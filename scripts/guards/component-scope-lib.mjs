import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

// Application components are every `src/components/<folder>/*.tsx` file outside
// the registry-owned folders. `ui/` holds shadcn/Base UI primitives and
// `firebase/` holds unmodified Firebase UI components; both keep their upstream
// shape. Scope is defined by exclusion so a new domain folder is covered
// without editing any guard.
const COMPONENTS_ROOT = "src/components";
const EXEMPT_COMPONENT_DIRS = new Set(["ui", "firebase"]);
const APPLICATION_COMPONENT_FILE = /^src\/components\/([^/]+)\/[^/]+\.tsx$/;

function isApplicationComponentPath(relPath) {
  const match = APPLICATION_COMPONENT_FILE.exec(relPath);
  return match !== null && !EXEMPT_COMPONENT_DIRS.has(match[1]);
}

function listApplicationComponentDirs(root) {
  const componentsDir = path.join(root, COMPONENTS_ROOT);
  if (!existsSync(componentsDir)) return [];

  return readdirSync(componentsDir, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && !EXEMPT_COMPONENT_DIRS.has(entry.name),
    )
    .map((entry) => path.join(componentsDir, entry.name));
}

// Absolute paths of `*.tsx` files directly inside each application folder.
// Test and story files are returned too; callers filter them as they need.
function listApplicationComponentFiles(root) {
  return listApplicationComponentDirs(root).flatMap((dir) =>
    readdirSync(dir)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => path.join(dir, file)),
  );
}

export {
  COMPONENTS_ROOT,
  EXEMPT_COMPONENT_DIRS,
  isApplicationComponentPath,
  listApplicationComponentDirs,
  listApplicationComponentFiles,
};
