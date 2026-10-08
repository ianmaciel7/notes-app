import { useState } from "react";

export function usePhoneAuthForm() {
  const [verificationId, setVerificationId] = useState<string | null>(null);

  return { verificationId, setVerificationId };
}
