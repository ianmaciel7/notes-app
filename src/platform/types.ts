export type BlockId = string;
export type ObjectId = string;
export type PropertyId = string;
export type SpaceId = string;
export type StructureId = string;

export type IsoDateTime = string;

export type Clock = () => IsoDateTime;
export type IdFactory = (prefix: string) => string;

export type DomainErrorDetails = Readonly<Record<string, unknown>>;

export class DomainError extends Error {
  readonly code: string;
  readonly details?: DomainErrorDetails;

  constructor(code: string, message: string, details?: DomainErrorDetails) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;
  }
}

export const systemClock: Clock = () => new Date().toISOString();

export const systemIdFactory: IdFactory = (prefix) =>
  `${prefix}_${globalThis.crypto.randomUUID()}`;

export function deepClone<T>(value: T): T {
  return structuredClone(value);
}
