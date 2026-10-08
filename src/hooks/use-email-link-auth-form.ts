import type { EmailLinkAuthFormSchema } from "@firebase-oss/ui-core";
import {
  type EmailLinkAuthFormProps,
  useEmailLinkAuthFormAction,
  useEmailLinkAuthFormCompleteSignIn,
  useEmailLinkAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { setFormRootError } from "@/hooks/set-form-root-error";

export function useEmailLinkAuthForm({
  onEmailSent,
  onSignIn,
}: EmailLinkAuthFormProps) {
  const ui = useUI();
  const schema = useEmailLinkAuthFormSchema();
  const action = useEmailLinkAuthFormAction();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<EmailLinkAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  useEmailLinkAuthFormCompleteSignIn(onSignIn);

  async function onSubmit(values: EmailLinkAuthFormSchema) {
    try {
      await action(values);
      setEmailSent(true);
      onEmailSent?.();
    } catch (error) {
      setFormRootError(form, error);
    }
  }

  return { ui, form, emailSent, onSubmit };
}
