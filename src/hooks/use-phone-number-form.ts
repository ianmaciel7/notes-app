import {
  formatPhoneNumber,
  type PhoneAuthNumberFormSchema,
} from "@firebase-oss/ui-core";
import {
  useDefaultCountry,
  usePhoneAuthNumberFormSchema,
  usePhoneNumberFormAction,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRef } from "react";
import { useForm } from "react-hook-form";

import type { CountrySelectorRef } from "@/components/notes-app/country-selector";
import { setFormRootError } from "@/hooks/set-form-root-error";
import { useAppVerifier } from "@/hooks/use-app-verifier";

export function usePhoneNumberForm(
  onVerificationSent: (verificationId: string) => void,
) {
  const ui = useUI();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const verificationAppVerifier = useAppVerifier(recaptchaContainerRef);
  const countrySelector = useRef<CountrySelectorRef>(null);
  const defaultCountry = useDefaultCountry();
  const action = usePhoneNumberFormAction();
  const schema = usePhoneAuthNumberFormSchema();

  const form = useForm<PhoneAuthNumberFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      phoneNumber: "",
    },
  });

  async function onSubmit(values: PhoneAuthNumberFormSchema) {
    try {
      const formatted = formatPhoneNumber(
        values.phoneNumber,
        countrySelector.current?.getCountry() ?? defaultCountry,
      );
      if (!verificationAppVerifier) {
        throw new Error("reCAPTCHA is not ready yet. Please try again.");
      }

      const verificationId = await action({
        phoneNumber: formatted,
        recaptchaVerifier: verificationAppVerifier,
      });
      onVerificationSent(verificationId);
    } catch (error) {
      setFormRootError(form, error);
    }
  }

  return {
    ui,
    form,
    recaptchaContainerRef,
    countrySelector,
    onSubmit,
    recaptchaVerifier: verificationAppVerifier,
  };
}
