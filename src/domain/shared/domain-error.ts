export const domainErrorCodes = [
  "unauthenticated",
  "forbidden",
  "not-found",
  "validation-failed",
  "lifecycle-conflict",
  "stale-state",
  "duplicate-operation",
  "dependency-unavailable",
  "internal",
] as const;

export type DomainErrorCode = (typeof domainErrorCodes)[number];

export interface DomainErrorOptions {
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(code: DomainErrorCode, options: DomainErrorOptions = {}) {
    super(options.message ?? code);
    this.name = "DomainError";
    this.code = code;
    this.fieldErrors = options.fieldErrors;
  }
}
