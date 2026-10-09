import type { Metadata } from "next";
import { AuthPageHeading } from "@/app/(public)/_components/auth-page-heading";
import { ForgotPasswordAuthCard } from "@/app/(public)/_components/forgot-password-auth-card";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthPageHeading message="resetPassword" />
      <ForgotPasswordAuthCard />
    </>
  );
}
