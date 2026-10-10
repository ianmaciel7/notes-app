import { enrollWithMultiFactorAssertion } from "@firebase-oss/ui-core";
import { useUI } from "@firebase-oss/ui-react";
import { PhoneAuthProvider, PhoneMultiFactorGenerator } from "firebase/auth";
import {
  type PhoneVerifyCodeValues,
  usePhoneVerifyCodeForm,
} from "@/hooks/use-phone-verify-code-form";
import { setFormRootError } from "@/lib/firebase/form-error";

type UseMultiFactorEnrollmentVerifyPhoneNumberFormProps = {
  verificationId: string;
  displayName?: string;
  onSuccess: () => void;
};

export function useMultiFactorEnrollmentVerifyPhoneNumberForm(
  props: UseMultiFactorEnrollmentVerifyPhoneNumberFormProps,
) {
  const ui = useUI();

  const form = usePhoneVerifyCodeForm(props.verificationId);

  const onSubmit = async (values: PhoneVerifyCodeValues) => {
    try {
      const credential = PhoneAuthProvider.credential(
        values.verificationId,
        values.verificationCode,
      );
      const assertion = PhoneMultiFactorGenerator.assertion(credential);
      await enrollWithMultiFactorAssertion(ui, assertion, props.displayName);
      props.onSuccess();
    } catch (error) {
      setFormRootError(form, error);
    }
  };

  return { ui, form, onSubmit };
}
