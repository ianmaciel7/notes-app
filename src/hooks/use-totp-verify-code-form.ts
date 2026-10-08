import { useMultiFactorTotpAuthVerifyFormSchema } from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";

export type TotpVerifyCodeValues = { verificationCode: string };

export function useTotpVerifyCodeForm() {
  const schema = useMultiFactorTotpAuthVerifyFormSchema();

  return useForm<TotpVerifyCodeValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: { verificationCode: "" },
  });
}
