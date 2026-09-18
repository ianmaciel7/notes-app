"use client";

import { useOnUserAuthenticated } from "@firebase-oss/ui-react";
import type { User, UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { GitHubSignInButton } from "@/components/auth/github-sign-in-button";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignInAuthScreen as ShadcnSignInAuthScreen } from "@/components/auth/sign-in-auth-screen";
import { useI18n } from "@/hooks/use-i18n";
import { syncSession } from "@/lib/auth/client-session";
import { auth } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/i18n/auth-errors";
import { localePath } from "@/lib/i18n/routing";

export default function SignInPage() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const signUpPath = localePath(locale, "/sign-up");

  const forgotPasswordPath = localePath(locale, "/forgot-password");
  const [oauthErrorMessage, setOauthErrorMessage] = useState<string | null>(
    null,
  );

  const syncAndRedirect = useCallback(
    async (target?: User | UserCredential) => {
      const user =
        target && "user" in target
          ? target.user
          : ((target as User | undefined) ?? auth.currentUser);
      if (user) {
        const token = await user.getIdToken();
        await syncSession(token);
      }
      router.replace("/");
    },
    [router],
  );

  const handleOAuthError = useCallback(
    (error: unknown) => {
      setOauthErrorMessage(getAuthErrorMessage(error, t));
    },
    [t],
  );

  useOnUserAuthenticated(syncAndRedirect);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <ShadcnSignInAuthScreen
        onSignIn={syncAndRedirect}
        onSignUpClick={() => router.push(signUpPath)}
        onForgotPasswordClick={() => router.push(forgotPasswordPath)}
        oauthErrorMessage={oauthErrorMessage}
      >
        <GoogleSignInButton
          onSignIn={syncAndRedirect}
          onError={handleOAuthError}
        />
        <GitHubSignInButton
          onSignIn={syncAndRedirect}
          onError={handleOAuthError}
        />
      </ShadcnSignInAuthScreen>
    </main>
  );
}
