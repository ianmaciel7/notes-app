/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies make module boundaries harder to reason about.",
      from: {},
      to: { circular: true },
    },
    {
      name: "lib-does-not-depend-on-ui",
      severity: "error",
      comment: "Shared utilities must stay independent of application and UI layers.",
      from: { path: "^src/lib" },
      to: { path: "^src/(app|components|hooks)" },
    },
    {
      name: "ui-does-not-depend-on-app",
      severity: "error",
      comment: "Generic UI primitives must not depend on application routes.",
      from: { path: "^src/components/ui" },
      to: { path: "^src/app" },
    },
    {
      name: "hooks-do-not-depend-on-app",
      severity: "error",
      comment: "Reusable hooks must not depend on application routes.",
      from: { path: "^src/hooks" },
      to: { path: "^src/app" },
    },
  ],
  options: {
    includeOnly: ["^src"],
    doNotFollow: { path: ["node_modules"] },
    tsConfig: { fileName: "tsconfig.json" },
  },
};
