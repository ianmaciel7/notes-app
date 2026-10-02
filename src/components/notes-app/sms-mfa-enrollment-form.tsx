"use client";

import { useUI } from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { MultiFactorEnrollmentPhoneNumberForm } from "@/components/notes-app/multi-factor-enrollment-phone-number-form";
import { MultiFactorEnrollmentVerifyPhoneNumberForm } from "@/components/notes-app/multi-factor-enrollment-verify-phone-number-form";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type SmsMfaEnrollmentFormProps = ComponentProps<typeof FieldGroup> & {
  onSuccess?: () => void;
};

function SmsMfaEnrollmentForm({
  onSuccess,
  className,
  ...props
}: SmsMfaEnrollmentFormProps) {
  const ui = useUI();

  const [verification, setVerification] = useState<{
    verificationId: string;
    displayName?: string;
  } | null>(null);

  if (!ui.auth.currentUser) {
    throw new Error(
      "User must be authenticated to enroll with multi-factor authentication",
    );
  }

  return (
    <FieldGroup
      data-slot="sms-mfa-enrollment-form"
      {...props}
      className={cn(className)}
    >
      {!verification ? (
        <MultiFactorEnrollmentPhoneNumberForm
          onSubmit={(verificationId, displayName) =>
            setVerification({ verificationId, displayName })
          }
        />
      ) : (
        <MultiFactorEnrollmentVerifyPhoneNumberForm
          {...verification}
          onSuccess={() => {
            onSuccess?.();
          }}
        />
      )}
    </FieldGroup>
  );
}

export { SmsMfaEnrollmentForm, type SmsMfaEnrollmentFormProps };
