import {
  useTotpMultiFactorAssertionFormAction,
  useUI,
} from "@firebase-oss/ui-react";
import type { MultiFactorInfo, UserCredential } from "firebase/auth";
import { setFormRootError } from "@/hooks/set-form-root-error";
import {
  type TotpVerifyCodeValues,
  useTotpVerifyCodeForm,
} from "@/hooks/use-totp-verify-code-form";

type UseTotpMultiFactorAssertionFormProps = {
  hint: MultiFactorInfo;
  onSuccess?: (credential: UserCredential) => void;
};

export function useTotpMultiFactorAssertionForm(
  props: UseTotpMultiFactorAssertionFormProps,
) {
  const ui = useUI();
  const action = useTotpMultiFactorAssertionFormAction();

  const form = useTotpVerifyCodeForm();

  const onSubmit = async (values: TotpVerifyCodeValues) => {
    try {
      const credential = await action({
        verificationCode: values.verificationCode,
        hint: props.hint,
      });
      props.onSuccess?.(credential);
    } catch (error) {
      setFormRootError(form, error);
    }
  };

  return { ui, form, onSubmit };
}
