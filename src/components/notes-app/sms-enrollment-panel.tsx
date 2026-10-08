"use client";

import { FactorId } from "firebase/auth";
import { MultiFactorAuthEnrollmentCard } from "@/components/notes-app/multi-factor-auth-enrollment-card";
import { useSmsEnrollmentPanel } from "@/hooks/use-sms-enrollment-panel";

export function SmsEnrollmentPanel() {
  const { enrolled, markEnrolled } = useSmsEnrollmentPanel();

  if (enrolled) {
    return <output>SMS second factor enrolled</output>;
  }

  return (
    <MultiFactorAuthEnrollmentCard
      hints={[FactorId.PHONE]}
      onEnrollment={markEnrolled}
    />
  );
}
