/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Do not allow circular dependencies in the codebase",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "src-root-allowed-files-only",
      severity: "error",
      comment:
        "Only official Next.js root files (proxy, middleware, instrumentation) are permitted directly under src/",
      from: {
        path: "^src/[^/]+\\.(ts|tsx|js|jsx)$",
        pathNot: "^src/(proxy|middleware|instrumentation)\\.(ts|js)$",
      },
      to: {},
    },
    {
      name: "not-to-unresolvable",
      severity: "error",
      comment: "Do not allow dependencies to unresolvable modules",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: "ui-primitives-cannot-import-domain",
      severity: "error",
      comment:
        "Generic UI primitives cannot depend on domain components or app routing",
      from: {
        path: "^src/components/ui",
      },
      to: {
        path: "(^src/components/domain|^src/app)",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "(node_modules|src/components/ui)",
    },
    exclude: {
      path: "^src/components/ui",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
  },
};
