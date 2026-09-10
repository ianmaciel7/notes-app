export type DevelopmentWorkLevel = "lightweight" | "bounded" | "complex";
export type DevelopmentWorkKind = "change" | "bugfix" | "review" | "documentation";
export type DevelopmentArtifact = "none" | "change-spec" | "bugfix-spec";

export type DevelopmentWorkInput = {
  readonly description: string;
  readonly files: readonly string[];
  readonly kind?: DevelopmentWorkKind;
};

export type DevelopmentWorkflowPolicy = {
  readonly level: DevelopmentWorkLevel;
  readonly requiredArtifact: DevelopmentArtifact;
  readonly requiresPersistentSpec: boolean;
  readonly requiredChecks: readonly string[];
  readonly requiredReviews: readonly string[];
};

const SENSITIVE_PATTERNS = [
  /(^|\/)firestore\.rules$/,
  /(^|\/)apphosting\.yaml$/,
  /(^|\/)firebase\.json$/,
  /(^|\/)SECURITY\.md$/,
  /(^|\/)src\/app\/api\//,
  /(^|\/)src\/lib\/(ai|auth|documents|storage|sync)\//,
  /(^|\/)src\/lib\/db\.ts$/,
  /(^|\/).*migration/i,
];

const CODE_PATTERNS = [/\.(ts|tsx|js|jsx|mjs|cjs)$/];
const DOC_PATTERNS = [/\.(md|mdc)$/];

export function classifyDevelopmentWork(input: DevelopmentWorkInput): DevelopmentWorkflowPolicy {
  const normalizedFiles = input.files.map((file) => file.replaceAll("\\", "/"));
  const kind = input.kind ?? inferKind(input.description);

  if (isComplexWork(input.description, normalizedFiles)) {
    return {
      level: "complex",
      requiredArtifact: kind === "bugfix" ? "bugfix-spec" : "change-spec",
      requiresPersistentSpec: true,
      requiredChecks: [
        "focused regression test",
        "pnpm quality:fast",
        "pnpm quality",
        "pnpm verify",
      ],
      requiredReviews: ["spec review", "quality review", "security review"],
    };
  }

  if (kind === "bugfix" || normalizedFiles.some(isCodeFile)) {
    return {
      level: "bounded",
      requiredArtifact: kind === "bugfix" ? "bugfix-spec" : "change-spec",
      requiresPersistentSpec: true,
      requiredChecks: ["focused regression test", "pnpm quality:fast"],
      requiredReviews: ["spec review", "quality review"],
    };
  }

  return {
    level: "lightweight",
    requiredArtifact: "none",
    requiresPersistentSpec: false,
    requiredChecks: normalizedFiles.every(isDocumentationFile)
      ? ["pnpm format:check"]
      : ["pnpm quality:fast"],
    requiredReviews: ["diff review"],
  };
}

export function summarizeRequiredWorkflow(policy: DevelopmentWorkflowPolicy): readonly string[] {
  const steps = ["Investigate the current behavior and preserve existing contracts."];

  if (policy.requiredArtifact !== "none") {
    steps.push(`Record a ${policy.requiredArtifact} before implementation.`);
  }

  steps.push("Plan the smallest independently verifiable change.");

  if (policy.level !== "lightweight") {
    steps.push("Implement with a failing focused test before production code when feasible.");
  }

  steps.push(`Run ${formatChecks(policy.requiredChecks)}.`);

  if (policy.requiredReviews.includes("security review")) {
    steps.push("Review the spec, quality, and security boundary separately.");
  } else if (policy.requiredReviews.length > 0) {
    steps.push("Review against the spec, then review quality and risk.");
  }

  return steps;
}

function inferKind(description: string): DevelopmentWorkKind {
  return /\b(bug|fix|regression|defect|falha|corrigir|erro)\b/i.test(description)
    ? "bugfix"
    : "change";
}

function isComplexWork(description: string, files: readonly string[]): boolean {
  return (
    /\b(auth|authorization|sync|storage|parser|document|ai|secret|firestore|migration|security)\b/i.test(
      description,
    ) || files.some((file) => SENSITIVE_PATTERNS.some((pattern) => pattern.test(file)))
  );
}

function isCodeFile(file: string): boolean {
  return CODE_PATTERNS.some((pattern) => pattern.test(file));
}

function isDocumentationFile(file: string): boolean {
  return DOC_PATTERNS.some((pattern) => pattern.test(file));
}

function formatChecks(checks: readonly string[]): string {
  if (checks.length === 0) {
    return "the relevant verification command";
  }
  if (checks.length === 1) {
    return checks[0];
  }

  return `${checks.slice(0, -1).join(", ")} and ${checks.at(-1)}`;
}
