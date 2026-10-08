import { useState } from "react";

export function useSmsMultiFactorEnrollmentForm() {
  const [verification, setVerification] = useState<{
    verificationId: string;
    displayName?: string;
  } | null>(null);

  return { verification, setVerification };
}
