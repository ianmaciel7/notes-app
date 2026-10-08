"use client";

import { FactorId } from "firebase/auth";
import { useTranslations } from "next-intl";
import { MultiFactorAuthEnrollmentCard } from "@/components/notes-app/multi-factor-auth-enrollment-card";
import { useSmsEnrollmentPanel } from "@/hooks/use-sms-enrollment-panel";

export function SmsEnrollmentPanel() {
  const { enrolled, markEnrolled } = useSmsEnrollmentPanel();
  const translate = useTranslations("auth");

  if (enrolled) {
    return <output>{translate("smsEnrolled")}</output>;
  }

  return (
    <MultiFactorAuthEnrollmentCard
      hints={[FactorId.PHONE]}
      onEnrollment={markEnrolled}
    />
  );
}
