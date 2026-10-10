import type { ForgotPasswordAuthFormSchema } from "@firebase-oss/ui-core";
import {
  type ForgotPasswordAuthFormProps,
  useForgotPasswordAuthFormAction,
  useForgotPasswordAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { setFormRootError } from "@/lib/firebase/form-error";

export function useForgotPasswordAuthForm({
  onPasswordSent,
}: ForgotPasswordAuthFormProps) {
  const ui = useUI();
  const schema = useForgotPasswordAuthFormSchema();
  const action = useForgotPasswordAuthFormAction();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordAuthFormSchema) {
    try {
      await action(values);
      setEmailSent(true);
      onPasswordSent?.();
    } catch (error) {
      setFormRootError(form, error);
    }
  }

  return { ui, form, emailSent, onSubmit };
}
