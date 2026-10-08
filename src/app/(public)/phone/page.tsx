import type { Metadata } from "next";
import { PhoneAuthCard } from "@/components/notes-app/phone-auth-card";

export const metadata: Metadata = { title: "Sign in with phone" };

export default function PhonePage() {
  return (
    <>
      <h1 className="sr-only">Sign in with phone</h1>
      <PhoneAuthCard />
    </>
  );
}
