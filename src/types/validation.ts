export interface ValidationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}
