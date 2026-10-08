import type { Metadata } from "next";
import { AuthPageHeading } from "@/components/notes-app/auth-page-heading";
import { EmailLinkAuthCard } from "@/components/notes-app/email-link-auth-card";

export const metadata: Metadata = { title: "Sign in with e-mail link" };

export default function EmailLinkPage() {
  return (
    <>
      <AuthPageHeading message="signInWithEmailLink" />
      <EmailLinkAuthCard />
    </>
  );
}
