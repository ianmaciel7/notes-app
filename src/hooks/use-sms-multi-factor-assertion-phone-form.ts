import { FirebaseUIError } from "@firebase-oss/ui-core";
import {
  useSmsMultiFactorAssertionPhoneFormAction,
  useUI,
} from "@firebase-oss/ui-react";
import type { MultiFactorInfo } from "firebase/auth";
import { useRef, useState } from "react";
import { useAppVerifier } from "@/hooks/use-app-verifier";

export function useSmsMultiFactorAssertionPhoneForm(
  hint: MultiFactorInfo,
  onVerificationSent: (verificationId: string) => void,
) {
  const ui = useUI();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useAppVerifier(recaptchaContainerRef);
  const action = useSmsMultiFactorAssertionPhoneFormAction();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setError(null);
      if (!recaptchaVerifier) {
        throw new Error("The reCAPTCHA verifier is not ready yet");
      }
      const verificationId = await action({
        hint,
        recaptchaVerifier,
      });
      onVerificationSent(verificationId);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      setError(message);
    }
  };

  return { ui, recaptchaContainerRef, error, onSubmit };
}
