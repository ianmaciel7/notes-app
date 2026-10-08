import type { Metadata } from "next";
import { AuthPageHeading } from "@/components/notes-app/auth-page-heading";
import { ForgotPasswordAuthCard } from "@/components/notes-app/forgot-password-auth-card";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthPageHeading message="resetPassword" />
      <ForgotPasswordAuthCard />
    </>
  );
}
