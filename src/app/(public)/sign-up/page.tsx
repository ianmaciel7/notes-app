import type { Metadata } from "next";
import { AuthPageHeading } from "@/components/notes-app/auth-page-heading";
import { SignUpAuthCard } from "@/components/notes-app/sign-up-auth-card";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return (
    <>
      <AuthPageHeading message="signUp" />
      <SignUpAuthCard />
    </>
  );
}
