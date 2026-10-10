import {
  useSmsMultiFactorAssertionVerifyFormAction,
  useUI,
} from "@firebase-oss/ui-react";
import type { UserCredential } from "firebase/auth";
import {
  type PhoneVerifyCodeValues,
  usePhoneVerifyCodeForm,
} from "@/hooks/use-phone-verify-code-form";
import { setFormRootError } from "@/lib/firebase/form-error";

type UseSmsMultiFactorAssertionVerifyFormProps = {
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
};

export function useSmsMultiFactorAssertionVerifyForm(
  props: UseSmsMultiFactorAssertionVerifyFormProps,
) {
  const ui = useUI();
  const action = useSmsMultiFactorAssertionVerifyFormAction();

  const form = usePhoneVerifyCodeForm(props.verificationId);

  const onSubmit = async (values: PhoneVerifyCodeValues) => {
    try {
      const credential = await action({
        verificationId: values.verificationId,
        verificationCode: values.verificationCode,
      });
      props.onSuccess(credential);
    } catch (error) {
      setFormRootError(form, error);
    }
  };

  return { ui, form, onSubmit };
}
