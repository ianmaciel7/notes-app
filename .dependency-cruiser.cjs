/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependencies make module boundaries harder to reason about.",
      from: {},
      to: { circular: true },
    },
    {
      name: "lib-does-not-depend-on-ui",
      severity: "error",
      comment:
        "Shared utilities must stay independent of application and UI layers.",
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
      name: "ui-does-not-depend-on-domain",
      severity: "error",
      comment:
        "Generic UI primitives must not depend on notes-domain or vendor components.",
      from: { path: "^src/components/ui" },
      to: { path: "^src/components/(notes-app|firebase)" },
    },
    {
      name: "hooks-do-not-depend-on-app",
      severity: "error",
      comment: "Reusable hooks must not depend on application routes.",
      from: { path: "^src/hooks" },
      to: { path: "^src/app" },
    },
    {
      name: "firebase-vendor-does-not-depend-on-app",
      severity: "error",
      comment:
        "Immutable Firebase vendor components must not depend on application routes or notes-domain components.",
      from: { path: "^src/components/firebase" },
      to: { path: "^src/(app|components/notes-app)" },
    },
    {
      name: "no-client-firebase-admin",
      severity: "error",
      comment:
        "Server-only Firebase Admin code must not be imported by client components.",
      from: {
        path: "^src",
        pathNot: "^src/(app/api|lib/(auth|sync|storage|documents|ai))",
      },
      to: {
        path: "firebase-admin",
      },
    },
    {
      name: "dal-does-not-depend-on-ui",
      severity: "error",
      comment:
        "Data Access Layer (DAL) modules must stay independent of application and UI layers.",
      from: { path: "^src/(lib/dal|dal)" },
      to: { path: "^src/(app|components|hooks)" },
    },
    {
      name: "no-client-server-dal",
      severity: "error",
      comment:
        "Server-only Data Access Layer (DAL) modules must not be imported by client UI components or hooks.",
      from: { path: "^src/(components|hooks)" },
      to: {
        path: "^src/(lib/dal/server|dal/server|lib/server-dal|.*\\.server\\.dal\\.[tj]sx?$)",
      },
    },
    {
      name: "no-app-to-tests",
      severity: "error",
      comment:
        "Production code must not import test files or Playwright specs.",
      from: {
        path: "^src",
        pathNot: "\\.test\\.[tj]sx?$",
      },
      to: {
        path: "(^tests/|\\.test\\.[tj]sx?$|\\.spec\\.[tj]sx?$)",
      },
    },
    {
      name: "shadcn-ui-does-not-depend-on-lib-internals",
      severity: "error",
      comment:
        "shadcn UI primitives must only import @/lib/utils (or cn) from the lib layer, never domain/application services.",
      from: { path: "^src/components/ui" },
      to: {
        path: "^src/lib",
        pathNot: "^src/lib/utils",
      },
    },
    {
      name: "shadcn-enforce-base-ui-primitives",
      severity: "error",
      comment:
        "This project standardizes on shadcn base-nova (@base-ui/react). Direct imports of @radix-ui are forbidden in src/.",
      from: { path: "^src" },
      to: {
        path: "@radix-ui",
      },
    },
    {
      name: "shadcn-enforce-toast-base-ui",
      severity: "error",
      comment:
        "This project uses Base UI toast (@/components/ui/toast). Direct imports of sonner outside of UI adapters are forbidden.",
      from: {
        path: "^src",
        pathNot: "^src/components/ui/(sonner|toast)\\.tsx$",
      },
      to: {
        path: "sonner",
      },
    },
    {
      name: "shadcn-enforce-canonical-icons",
      severity: "error",
      comment:
        "shadcn icons must use the canonical icon library (lucide-react). Other icon packages like @tabler/icons, @hugeicons, or @heroicons are forbidden.",
      from: { path: "^src" },
      to: {
        path: "(@tabler/icons|@hugeicons|@heroicons|react-icons)",
      },
    },
    {
      name: "shadcn-isolated-primitives-cannot-import-composite-ui",
      severity: "error",
      comment:
        "Foundation atomic UI primitives (button, input, badge, separator, label, skeleton, spinner) must not depend on complex composite UI components.",
      from: {
        path: "^src/components/ui/(button|input|badge|separator|label|skeleton|spinner)\\.tsx$",
      },
      to: {
        path: "^src/components/ui/(dialog|sheet|drawer|sidebar|alert-dialog|menubar|dropdown-menu|context-menu|combobox|command|table|pagination|carousel|chart|questionnaire|message-scroller)",
      },
    },
    {
      name: "shadcn-no-barrel-imports",
      severity: "error",
      comment:
        "shadcn components must be imported directly from their individual module (e.g. '@/components/ui/button'), never via a barrel index import.",
      from: { path: "^src" },
      to: {
        path: "^src/components/ui(/index)?$",
      },
    },
    {
      name: "shadcn-stories-isolated-from-production",
      severity: "error",
      comment:
        "Ladle stories (*.stories.tsx) are development artifacts and must never be imported by application code or UI primitives.",
      from: {
        path: "^src",
        pathNot: "\\.stories\\.[tj]sx?$",
      },
      to: {
        path: "\\.stories\\.[tj]sx?$",
      },
    },
  ],
  options: {
    includeOnly: ["^src"],
    doNotFollow: { path: ["node_modules"] },
    tsConfig: { fileName: "tsconfig.json" },
  },
};
