import type { Metadata } from "next";
import { AuthPageHeading } from "@/components/notes-app/auth-page-heading";
import { GoogleSignInButton } from "@/components/notes-app/google-sign-in-button";
import { SignInAuthCard } from "@/components/notes-app/sign-in-auth-card";

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
