"use client";

import {
  GoogleSignInButton,
  useOnUserAuthenticated,
} from "@firebase-oss/ui-react";
import { useRouter } from "next/navigation";

import { SignInAuthScreen as ShadcnSignInAuthScreen } from "@/components/sign-in-auth-screen";

export default function SignInPage() {
  const router = useRouter();

  useOnUserAuthenticated(() => router.replace("/"));

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <ShadcnSignInAuthScreen onSignIn={() => router.replace("/")}>
        <GoogleSignInButton onSignIn={() => router.replace("/")} />
      </ShadcnSignInAuthScreen>
    </main>
  );
}
