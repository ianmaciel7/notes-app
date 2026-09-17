"use client";

import {
  GoogleSignInButton,
  useOnUserAuthenticated,
} from "@firebase-oss/ui-react";
import { useRouter } from "next/navigation";
import { use } from "react";

import { SignInAuthScreen as ShadcnSignInAuthScreen } from "@/components/sign-in-auth-screen";
import { localePath } from "@/lib/i18n/routing";

export default function SignInPage({ params }: PageProps<"/[lang]/sign-in">) {
  const router = useRouter();
  const { lang } = use(params);
  const homePath = localePath(lang, "/");

  useOnUserAuthenticated(() => router.replace(homePath));

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <ShadcnSignInAuthScreen onSignIn={() => router.replace(homePath)}>
        <GoogleSignInButton onSignIn={() => router.replace(homePath)} />
      </ShadcnSignInAuthScreen>
    </main>
  );
}
