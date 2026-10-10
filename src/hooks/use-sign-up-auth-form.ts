import type { SignUpAuthFormSchema } from "@firebase-oss/ui-core";
import {
  type SignUpAuthFormProps,
  useRequireDisplayName,
  useSignUpAuthFormAction,
  useSignUpAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { setFormRootError } from "@/lib/firebase/form-error";

export function useSignUpAuthForm(props: SignUpAuthFormProps) {
  const ui = useUI();
  const schema = useSignUpAuthFormSchema();
  const action = useSignUpAuthFormAction();
  const requireDisplayName = useRequireDisplayName();

  const form = useForm<SignUpAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      displayName: requireDisplayName ? "" : undefined,
    },
  });

  async function onSubmit(values: SignUpAuthFormSchema) {
    try {
      const credential = await action(values);
      if (credential) props.onSignUp?.(credential);
    } catch (error) {
      setFormRootError(form, error);
    }
  }

  return { ui, form, requireDisplayName, onSubmit };
}
