import type { TotpSecret } from "firebase/auth";
import { useState } from "react";

export function useTotpMultiFactorEnrollmentForm() {
  const [enrollment, setEnrollment] = useState<{
    secret: TotpSecret;
    displayName: string;
  } | null>(null);

  return { enrollment, setEnrollment };
}
