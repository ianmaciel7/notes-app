import { enrollWithMultiFactorAssertion } from "@firebase-oss/ui-core";
import { useUI } from "@firebase-oss/ui-react";
import { TotpMultiFactorGenerator, type TotpSecret } from "firebase/auth";
import { setFormRootError } from "@/hooks/set-form-root-error";
import {
  type TotpVerifyCodeValues,
  useTotpVerifyCodeForm,
} from "@/hooks/use-totp-verify-code-form";

type UseMultiFactorEnrollmentVerifyTotpFormProps = {
  secret: TotpSecret;
  onSuccess: () => void;
};

export function useMultiFactorEnrollmentVerifyTotpForm(
  props: UseMultiFactorEnrollmentVerifyTotpFormProps,
) {
  const ui = useUI();

  const form = useTotpVerifyCodeForm();

  const onSubmit = async (values: TotpVerifyCodeValues) => {
    try {
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
        props.secret,
        values.verificationCode,
      );
      await enrollWithMultiFactorAssertion(
        ui,
        assertion,
        values.verificationCode,
      );
      props.onSuccess();
    } catch (error) {
      setFormRootError(form, error);
    }
  };

  return { ui, form, onSubmit };
}
