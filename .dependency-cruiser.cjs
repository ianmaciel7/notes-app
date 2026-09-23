/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependencies make module boundaries harder to reason about.",
      from: {},
      to: {
        circular: true,
      },
    },
  ],
  options: {
    includeOnly: ["^src"],
    doNotFollow: {
      path: ["node_modules"],
    },
    tsConfig: {
      fileName: "tsconfig.json",
    },
  },
};
