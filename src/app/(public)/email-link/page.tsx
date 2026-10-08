import type { Metadata } from "next";
import { EmailLinkAuthCard } from "@/components/notes-app/email-link-auth-card";

export const metadata: Metadata = { title: "Sign in with e-mail link" };

export default function EmailLinkPage() {
  return (
    <>
      <h1 className="sr-only">Sign in with e-mail link</h1>
      <EmailLinkAuthCard />
    </>
  );
}
