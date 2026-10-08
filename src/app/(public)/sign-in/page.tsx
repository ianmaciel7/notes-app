import type { Metadata } from "next";
import { GoogleSignInButton } from "@/components/notes-app/google-sign-in-button";
import { SignInAuthCard } from "@/components/notes-app/sign-in-auth-card";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <>
      <h1 className="sr-only">Sign in</h1>
      <SignInAuthCard>
        <GoogleSignInButton />
      </SignInAuthCard>
    </>
  );
}
