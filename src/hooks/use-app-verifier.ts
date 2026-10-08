import { useRecaptchaVerifier } from "@firebase-oss/ui-react";
import type { RecaptchaVerifier } from "firebase/auth";
import { type RefObject, useMemo } from "react";

/**
 * Returns the reCAPTCHA verifier for phone verification. Outside production the
 * Auth Emulator ignores app verification, so a stub is used until the real
 * verifier is ready.
 */
export function useAppVerifier(
  containerRef: RefObject<HTMLDivElement | null>,
): RecaptchaVerifier | null {
  const recaptchaVerifier = useRecaptchaVerifier(containerRef);
  const emulatorVerifier = useMemo<RecaptchaVerifier>(
    () =>
      ({
        type: "recaptcha",
        verify: async () => "emulator",
        _reset: () => {},
      }) as unknown as RecaptchaVerifier,
    [],
  );

  return (
    recaptchaVerifier ??
    (process.env.NODE_ENV === "production" ? null : emulatorVerifier)
  );
}
