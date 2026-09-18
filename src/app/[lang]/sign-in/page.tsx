"use client";

import {
  GoogleSignInButton,
  useOnUserAuthenticated,
} from "@firebase-oss/ui-react";
import { useRouter } from "next/navigation";
import { use, useCallback } from "react";

import { SignInAuthScreen as ShadcnSignInAuthScreen } from "@/components/sign-in-auth-screen";
import { syncSession } from "@/lib/auth/client-session";
import { auth } from "@/lib/firebase/client";
import { localePath } from "@/lib/i18n/routing";

export default function SignInPage({ params }: PageProps<"/[lang]/sign-in">) {
  const router = useRouter();
  const { lang } = use(params);
  const homePath = localePath(lang, "/");
  const signUpPath = localePath(lang, "/sign-up");
  const forgotPasswordPath = localePath(lang, "/forgot-password");

  const syncAndRedirect = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      await syncSession(token);
    }
    router.replace(homePath);
  }, [router, homePath]);

  useOnUserAuthenticated(syncAndRedirect);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <ShadcnSignInAuthScreen
        onSignIn={syncAndRedirect}
        onSignUpClick={() => router.push(signUpPath)}
        onForgotPasswordClick={() => router.push(forgotPasswordPath)}
      >
        <GoogleSignInButton onSignIn={syncAndRedirect} />
      </ShadcnSignInAuthScreen>
    </main>
  );
}
