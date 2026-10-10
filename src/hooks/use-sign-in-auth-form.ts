import type { SignInAuthFormSchema } from "@firebase-oss/ui-core";
import {
  type SignInAuthFormProps,
  useSignInAuthFormAction,
  useSignInAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { setFormRootError } from "@/lib/firebase/form-error";

export function useSignInAuthForm(props: SignInAuthFormProps) {
  const ui = useUI();
  const schema = useSignInAuthFormSchema();
  const action = useSignInAuthFormAction();

  const form = useForm<SignInAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInAuthFormSchema) {
    try {
      const credential = await action(values);
      if (credential) props.onSignIn?.(credential);
    } catch (error) {
      setFormRootError(form, error);
    }
  }

  return { ui, form, onSubmit };
}
