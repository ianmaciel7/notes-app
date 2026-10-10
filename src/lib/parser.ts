/** Converts a Firestore Timestamp-like value (anything with a toDate() method) to a Date, returning undefined otherwise. */
export function parseDate(value: unknown): Date | undefined {
  const candidate = value as { toDate?: () => Date } | undefined;
  return typeof candidate?.toDate === "function"
    ? candidate.toDate()
    : undefined;
}
