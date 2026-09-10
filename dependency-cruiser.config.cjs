/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Production imports must stay acyclic.",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "no-client-firebase-admin",
      severity: "error",
      comment: "Server-only Firebase Admin code must not be imported by client components.",
      from: {
        path: "^src",
        pathNot: "^src/(app/api|lib/(auth|sync|storage|documents|ai))",
      },
      to: {
        path: "firebase-admin",
      },
    },
    {
      name: "no-app-to-tests",
      severity: "error",
      comment: "Production code must not import test files or Playwright specs.",
      from: {
        path: "^src",
        pathNot: "\\.test\\.[tj]sx?$",
      },
      to: {
        path: "(^tests/|\\.test\\.[tj]sx?$|\\.spec\\.[tj]sx?$)",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    enhancedResolveOptions: {
      conditionNames: ["import", "require", "node", "default"],
      exportsFields: ["exports"],
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      mainFields: ["module", "main", "types"],
    },
    exclude: {
      path: "^(node_modules|\\.next|build|coverage|graphify-out)/",
    },
    includeOnly: "^src",
    tsConfig: {
      fileName: "tsconfig.json",
    },
  },
};
