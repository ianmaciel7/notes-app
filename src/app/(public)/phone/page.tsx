import type { Metadata } from "next";
import { AuthPageHeading } from "@/components/notes-app/auth-page-heading";
import { PhoneAuthCard } from "@/components/notes-app/phone-auth-card";

export const metadata: Metadata = { title: "Sign in with phone" };

export default function PhonePage() {
  return (
    <>
      <AuthPageHeading message="signInWithPhone" />
      <PhoneAuthCard />
    </>
  );
}
