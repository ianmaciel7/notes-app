import type { Metadata } from "next";
import { AuthPageHeading } from "@/app/(public)/_components/auth-page-heading";
import { PhoneAuthCard } from "@/app/(public)/_components/phone-auth-card";

export const metadata: Metadata = { title: "Sign in with phone" };

export default function PhonePage() {
  return (
    <>
      <AuthPageHeading message="signInWithPhone" />
      <PhoneAuthCard />
    </>
  );
}
