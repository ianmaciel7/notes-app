import type { PhoneAuthVerifyFormSchema } from "@firebase-oss/ui-core";
import {
  usePhoneAuthVerifyFormSchema,
  useUI,
  useVerifyPhoneNumberFormAction,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { UserCredential } from "firebase/auth";
import { useForm } from "react-hook-form";
import { setFormRootError } from "@/lib/firebase/form-error";

type UsePhoneVerifyFormProps = {
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
};

export function usePhoneVerifyForm(props: UsePhoneVerifyFormProps) {
  const ui = useUI();
  const schema = usePhoneAuthVerifyFormSchema();
  const action = useVerifyPhoneNumberFormAction();

  const form = useForm<PhoneAuthVerifyFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      verificationId: props.verificationId,
      verificationCode: "",
    },
  });

  async function onSubmit(values: PhoneAuthVerifyFormSchema) {
    try {
      const credential = await action(values);
      if (credential) props.onSuccess(credential);
    } catch (error) {
      setFormRootError(form, error);
    }
  }

  return { ui, form, onSubmit };
}
