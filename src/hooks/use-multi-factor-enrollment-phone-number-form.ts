import { formatPhoneNumber, verifyPhoneNumber } from "@firebase-oss/ui-core";
import {
  useDefaultCountry,
  useMultiFactorPhoneAuthNumberFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { multiFactor } from "firebase/auth";
import { useRef } from "react";
import { useForm } from "react-hook-form";

import type { CountrySelectorRef } from "@/app/_components/country-selector";
import { useAppVerifier } from "@/hooks/use-app-verifier";
import { setFormRootError } from "@/lib/firebase/form-error";

export function useMultiFactorEnrollmentPhoneNumberForm(
  onVerificationSent: (verificationId: string, displayName?: string) => void,
) {
  const ui = useUI();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useAppVerifier(recaptchaContainerRef);
  const countrySelector = useRef<CountrySelectorRef>(null);
  const defaultCountry = useDefaultCountry();
  const schema = useMultiFactorPhoneAuthNumberFormSchema();

  const form = useForm<{ displayName: string; phoneNumber: string }>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      displayName: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: {
    displayName: string;
    phoneNumber: string;
  }) => {
    try {
      const currentUser = ui.auth.currentUser;
      if (!currentUser) {
        throw new Error(
          "User must be authenticated to enroll with multi-factor authentication",
        );
      }
      if (!recaptchaVerifier) {
        throw new Error("The reCAPTCHA verifier is not ready yet");
      }
      const formatted = formatPhoneNumber(
        values.phoneNumber,
        countrySelector.current?.getCountry() ?? defaultCountry,
      );
      const mfaUser = multiFactor(currentUser);
      const confirmationResult = await verifyPhoneNumber(
        ui,
        formatted,
        recaptchaVerifier,
        mfaUser,
      );
      onVerificationSent(confirmationResult, values.displayName);
    } catch (error) {
      setFormRootError(form, error);
    }
  };

  return { ui, form, recaptchaContainerRef, countrySelector, onSubmit };
}
