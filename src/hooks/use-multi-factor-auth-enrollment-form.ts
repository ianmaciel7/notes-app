import { FactorId } from "firebase/auth";
import { useState } from "react";

export type Hint = (typeof FactorId)[keyof typeof FactorId];

const DEFAULT_HINTS = [FactorId.TOTP, FactorId.PHONE] as const;

export function useMultiFactorAuthEnrollmentForm(
  hintsProp: Hint[] | undefined,
) {
  const hints = hintsProp ?? DEFAULT_HINTS;

  if (hints.length === 0) {
    throw new Error(
      "MultiFactorAuthEnrollmentForm must have at least one hint",
    );
  }

  // If only a single hint is provided, select it by default to improve UX.
  const [hint, setHint] = useState<Hint | undefined>(
    hints.length === 1 ? hints[0] : undefined,
  );

  return { hints, hint, setHint };
}
