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
        path: "^src/[^/]+[.](ts|tsx|js|jsx)$",
        pathNot: "^src/(proxy|middleware|instrumentation)[.](ts|js)$",
      },
      to: {},
    },
    {
      name: "not-to-unresolvable",
      severity: "error",
      comment:
        "Do not allow dependencies to unresolvable modules. server-only is resolved internally by Next.js and is not installed.",
      from: {},
      to: {
        couldNotResolve: true,
        pathNot: "^server-only$",
      },
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "Importing an npm package that is not declared in package.json relies on a transitive, unpinned version",
      from: {},
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "Application code must not import devDependencies at runtime. firebase-admin is currently declared as a devDependency but used by server code; move it to dependencies, then remove this exemption.",
      from: {
        path: "^src",
      },
      to: {
        dependencyTypes: ["npm-dev"],
        dependencyTypesNot: ["type-only"],
        pathNot: "node_modules/firebase-admin/",
      },
    },
    {
      name: "not-to-test",
      severity: "error",
      comment: "Application code must not import tests",
      from: {
        path: "^src",
      },
      to: {
        path: "^tests/|[.](spec|test)[.](ts|tsx)$",
      },
    },
    {
      name: "ui-primitives-cannot-import-domain",
      severity: "error",
      comment:
        "Generic UI primitives cannot depend on application components or app routing",
      from: {
        path: "^src/components/ui/",
      },
      to: {
        path: "^src/(components/(notes-app|firebase)|app)/",
      },
    },
    {
      name: "lib-and-hooks-cannot-import-ui-layers",
      severity: "error",
      comment:
        "src/lib and src/hooks are lower layers: they cannot depend on components or app routing at runtime. Type-only imports are erased at compile time and are allowed.",
      from: {
        path: "^src/(lib|hooks)/",
      },
      to: {
        path: "^src/(components|app)/",
        dependencyTypesNot: ["type-only"],
      },
    },
    {
      name: "domain-is-pure",
      severity: "error",
      comment:
        "src/domain holds SDK-free domain logic: it cannot import Firebase SDKs or any other application layer (ADR 0011).",
      from: {
        path: "^src/domain/",
      },
      to: {
        path: "^(src/(app|actions|client|data|components|hooks|lib)/|node_modules/(firebase|firebase-admin|@firebase/[^/]+|@google-cloud/[^/]+)/|node_modules/[.]pnpm/[^/]+/node_modules/(firebase|firebase-admin|@firebase/[^/]+|@google-cloud/[^/]+)/)",
      },
    },
    {
      name: "client-cannot-import-server-layers",
      severity: "error",
      comment:
        "src/client runs in the browser: it cannot import the server-only Data Access Layer, the Admin SDK, or app routing. Server Actions in src/actions are its only server entry point.",
      from: {
        path: "^src/client/",
      },
      to: {
        path: "^(src/data/|src/app/|node_modules/firebase-admin/|node_modules/[.]pnpm/[^/]+/node_modules/firebase-admin/)",
      },
    },
    {
      name: "data-cannot-import-client-layers",
      severity: "error",
      comment:
        "src/data is the server-only Data Access Layer: it cannot import browser code, components, hooks, or app routing.",
      from: {
        path: "^src/data/",
      },
      to: {
        path: "^src/(client|components|hooks|app)/",
      },
    },
    {
      name: "data-not-importable-by-browser-layers",
      severity: "error",
      comment:
        "Browser-capable layers must not import the server-only Data Access Layer; only src/app and src/actions may depend on it.",
      from: {
        path: "^src/(components|hooks|client|domain|lib)/",
      },
      to: {
        path: "^src/data/",
      },
    },
    {
      name: "data-files-must-be-dal",
      severity: "error",
      comment:
        "The server-only Data Access Layer contains only *-dal.ts modules.",
      from: {
        path: "^src/data/.*",
        pathNot: "^src/data/.*-dal[.]ts$",
      },
      to: {},
    },
    {
      name: "actions-cannot-import-client-layers",
      severity: "error",
      comment:
        "src/actions holds thin Server Actions: they delegate to src/data and src/domain and cannot import browser code, components, hooks, or app routing.",
      from: {
        path: "^src/actions/",
      },
      to: {
        path: "^src/(client|components|hooks|app)/",
      },
    },
    {
      name: "components-cannot-import-app",
      severity: "error",
      comment: "Components cannot depend on app routing files",
      from: {
        path: "^src/components/",
      },
      to: {
        path: "^src/app/",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
    skipAnalysisNotInRules: true,
  },
};
