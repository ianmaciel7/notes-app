"use client";

import { useOnUserAuthenticated } from "@firebase-oss/ui-react";
import type { User, UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import { use, useCallback, useState } from "react";

import { GitHubSignInButton } from "@/components/github-sign-in-button";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { SignUpAuthScreen as ShadcnSignUpAuthScreen } from "@/components/sign-up-auth-screen";
import { useI18n } from "@/hooks/use-i18n";
import { syncSession } from "@/lib/auth/client-session";
import { auth } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/i18n/auth-errors";
import { localePath } from "@/lib/i18n/routing";

export default function SignUpPage({ params }: PageProps<"/[lang]/sign-up">) {
  const router = useRouter();
  const { lang } = use(params);
  const { t } = useI18n();
  const homePath = localePath(lang, "/");
  const signInPath = localePath(lang, "/sign-in");
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
      router.replace(homePath);
    },
    [router, homePath],
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
      <ShadcnSignUpAuthScreen
        onSignUp={syncAndRedirect}
        onSignInClick={() => router.push(signInPath)}
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
      </ShadcnSignUpAuthScreen>
    </main>
  );
}
