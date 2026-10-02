"use client";

import {
  GoogleAuthProvider,
  getRedirectResult,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/notes-app/google-sign-in-button";
import { SignInAuthScreen } from "@/components/notes-app/login-card";
import { RequireGuest } from "@/components/notes-app/require-guest";
import { SignUpAuthScreen } from "@/components/notes-app/sign-up-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { captureError } from "@/lib/error-capture/capture";
import { auth } from "@/lib/firebase/client";
import { getSafeNextUrl } from "@/lib/navigation/safe-next-url";

// Popup failures that a full-page redirect can recover from.
const REDIRECT_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/popup-closed-by-user",
  "auth/operation-not-supported-in-this-environment",
]);

// Raised by the browser runtime (not Firebase) with no error code, so the
// message is the only stable signal available.
const NO_MATCHING_FRAME_MESSAGE = "No matching frame";

function getErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    return String((err as { code: unknown }).code);
  }
  return undefined;
}

function shouldFallBackToRedirect(err: unknown): boolean {
  const code = getErrorCode(err);
  if (code !== undefined && REDIRECT_FALLBACK_CODES.has(code)) return true;
  return (
    err instanceof Error && err.message.includes(NO_MATCHING_FRAME_MESSAGE)
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const nextUrl = getSafeNextUrl(searchParams.get("next"));
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Process redirect result if returning from signInWithRedirect
    getRedirectResult(auth)
      .then((userCredential) => {
        if (userCredential?.user) {
          router.replace(nextUrl);
        }
      })
      .catch((err: unknown) => {
        captureError(err, { source: "firebase-sdk", severity: "warn" });
        setAuthError(t("googleSignInFailed"));
      });
  }, [router, nextUrl, t]);

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    setAuthError(null);

    try {
      const userCredential = await signInWithPopup(auth, provider);
      if (userCredential.user) {
        router.replace(nextUrl);
      }
    } catch (err: unknown) {
      if (getErrorCode(err) === "auth/cancelled-popup-request") return;

      if (shouldFallBackToRedirect(err)) {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr: unknown) {
          captureError(redirectErr, {
            source: "firebase-sdk",
            severity: "warn",
          });
        }
      } else {
        captureError(err, { source: "firebase-sdk", severity: "warn" });
      }
      setAuthError(t("googleSignInFailed"));
    }
  }

  async function handleAnonymousLogin() {
    setAuthError(null);

    try {
      const userCredential = await signInAnonymously(auth);
      if (userCredential.user) {
        router.replace(nextUrl);
      }
    } catch (err: unknown) {
      captureError(err, { source: "firebase-sdk", severity: "warn" });
      setAuthError(t("guestSignInFailed"));
    }
  }

  return (
    <RequireGuest redirectTo={nextUrl}>
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Background decoration: subtle ambient light gradients */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="size-125 bg-primary/[0.03] dark:bg-primary/[0.05] rounded-full blur-3xl transform -translate-y-12" />
          <div className="size-75 bg-primary/[0.02] dark:bg-primary/[0.04] rounded-full blur-2xl transform translate-x-32 translate-y-24" />
        </div>

        {/* Main Authentication Card */}
        <div className="w-full max-w-sm space-y-4">
          {authError ? (
            <Alert variant="destructive" data-testid="auth-error">
              <AlertCircle className="size-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          ) : null}
          {mode === "signIn" ? (
            <SignInAuthScreen
              onSignIn={() => router.replace(nextUrl)}
              onSignUpClick={() => setMode("signUp")}
            >
              <GoogleSignInButton onClick={handleGoogleLogin} />
              <Button
                data-testid="anonymous-sign-in-btn"
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={handleAnonymousLogin}
              >
                {t("continueAsGuest")}
              </Button>
            </SignInAuthScreen>
          ) : (
            <SignUpAuthScreen
              onSignUp={() => router.replace(nextUrl)}
              onSignInClick={() => setMode("signIn")}
            >
              <GoogleSignInButton onClick={handleGoogleLogin} />
              <Button
                data-testid="anonymous-sign-up-btn"
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={handleAnonymousLogin}
              >
                {t("continueAsGuest")}
              </Button>
            </SignUpAuthScreen>
          )}
        </div>

        {/* Footer subtle help link */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-foreground underline-offset-4 hover:underline transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </RequireGuest>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
