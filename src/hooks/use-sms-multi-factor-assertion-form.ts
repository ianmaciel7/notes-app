import { useState } from "react";

export function useSmsMultiFactorAssertionForm() {
  const [verification, setVerification] = useState<{
    verificationId: string;
  } | null>(null);

  return { verification, setVerification };
}
