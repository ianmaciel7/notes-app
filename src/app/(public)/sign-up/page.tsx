import type { Metadata } from "next";
import { SignUpAuthCard } from "@/components/notes-app/sign-up-auth-card";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="sr-only">Create an account</h1>
      <SignUpAuthCard />
    </>
  );
}
