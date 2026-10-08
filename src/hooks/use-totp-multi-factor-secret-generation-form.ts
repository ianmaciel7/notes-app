import { generateTotpSecret } from "@firebase-oss/ui-core";
import {
  useMultiFactorTotpAuthNumberFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { TotpSecret } from "firebase/auth";
import { useForm } from "react-hook-form";
import { setFormRootError } from "@/hooks/set-form-root-error";

type UseTotpMultiFactorSecretGenerationFormProps = {
  onSubmit: (secret: TotpSecret, displayName: string) => void;
};

export function useTotpMultiFactorSecretGenerationForm(
  props: UseTotpMultiFactorSecretGenerationFormProps,
) {
  const ui = useUI();
  const schema = useMultiFactorTotpAuthNumberFormSchema();

  const form = useForm<{ displayName: string }>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      displayName: "",
    },
  });

  const onSubmit = async (values: { displayName: string }) => {
    try {
      const secret = await generateTotpSecret(ui);
      props.onSubmit(secret, values.displayName);
    } catch (error) {
      setFormRootError(form, error);
    }
  };

  return { ui, form, onSubmit };
}
