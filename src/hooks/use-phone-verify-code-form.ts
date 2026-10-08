import { useMultiFactorPhoneAuthVerifyFormSchema } from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";

export type PhoneVerifyCodeValues = {
  verificationId: string;
  verificationCode: string;
};

export function usePhoneVerifyCodeForm(verificationId: string) {
  const schema = useMultiFactorPhoneAuthVerifyFormSchema();

  return useForm<PhoneVerifyCodeValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: { verificationId, verificationCode: "" },
  });
}
