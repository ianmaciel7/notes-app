import type { Metadata } from "next";
import { AuthPageHeading } from "@/app/(public)/_components/auth-page-heading";
import { GoogleSignInButton } from "@/app/(public)/_components/google-sign-in-button";
import { SignInAuthCard } from "@/app/(public)/_components/sign-in-auth-card";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <>
      <AuthPageHeading message="signIn" />
      <SignInAuthCard>
        <GoogleSignInButton />
      </SignInAuthCard>
    </>
  );
}
