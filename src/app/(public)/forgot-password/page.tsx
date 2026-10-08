import type { Metadata } from "next";
import { ForgotPasswordAuthCard } from "@/components/notes-app/forgot-password-auth-card";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="sr-only">Reset your password</h1>
      <ForgotPasswordAuthCard />
    </>
  );
}
