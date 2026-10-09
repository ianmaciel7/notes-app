import type { Metadata } from "next";
import { AuthPageHeading } from "@/app/(public)/_components/auth-page-heading";
import { SignUpAuthCard } from "@/app/(public)/_components/sign-up-auth-card";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return (
    <>
      <AuthPageHeading message="signUp" />
      <SignUpAuthCard />
    </>
  );
}
