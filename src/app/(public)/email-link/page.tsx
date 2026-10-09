import type { Metadata } from "next";
import { AuthPageHeading } from "@/app/(public)/_components/auth-page-heading";
import { EmailLinkAuthCard } from "@/app/(public)/_components/email-link-auth-card";

export const metadata: Metadata = { title: "Sign in with e-mail link" };

export default function EmailLinkPage() {
  return (
    <>
      <AuthPageHeading message="signInWithEmailLink" />
      <EmailLinkAuthCard />
    </>
  );
}
