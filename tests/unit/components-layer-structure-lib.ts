const reservedComponentDirectories = [
  "src/components/ui/",
  "src/components/firebase/",
];

export function findMisplacedComponentFiles(
  paths: readonly string[],
): string[] {
  return paths
    .map((path) => path.replaceAll("\\", "/"))
    .filter((path) => path.startsWith("src/components/"))
    .filter(
      (path) =>
        !reservedComponentDirectories.some((directory) =>
          path.startsWith(directory),
        ),
    )
    .filter((path) => !path.endsWith(".d.ts") && !path.endsWith(".tsx"))
    .sort();
}

export const misplacedComponentFileMessage =
  "Components-layer files must be .tsx. Move hooks to src/hooks/use-*.ts; move utilities, constants, script builders, and pure logic to src/lib/<domain>/. This follows shadcn registry types (hook -> hooks, lib -> lib) and Next.js project-structure guidance for shared helpers.";
