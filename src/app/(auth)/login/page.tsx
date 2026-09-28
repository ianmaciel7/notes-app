"use client";

import {
  GoogleAuthProvider,
  getRedirectResult,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/notes-app/google-sign-in-button";
import { SignInAuthScreen } from "@/components/notes-app/sign-in-auth-screen";
import { SignUpAuthScreen } from "@/components/notes-app/sign-up-auth-screen";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  useEffect(() => {
    // Process redirect result if returning from signInWithRedirect
    getRedirectResult(auth)
      .then((userCredential) => {
        if (userCredential?.user) {
          router.replace(nextUrl);
        }
      })
      .catch(() => {
        // Redirection errors are handled by FirebaseUI
      });
  }, [router, nextUrl]);

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    try {
      const userCredential = await signInWithPopup(auth, provider);
      if (userCredential.user) {
        router.replace(nextUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("No matching frame") ||
        msg.includes("popup-blocked") ||
        msg.includes("popup-closed-by-user")
      ) {
        await signInWithRedirect(auth, provider);
      }
    }
  }

  async function handleAnonymousLogin() {
    try {
      const userCredential = await signInAnonymously(auth);
      if (userCredential.user) {
        router.replace(nextUrl);
      }
    } catch (_err: unknown) {
      // Ignored or handled by error UI
    }
  }

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background decoration: subtle ambient light gradients */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-primary/[0.03] dark:bg-primary/[0.05] rounded-full blur-3xl transform -translate-y-12" />
        <div className="w-[300px] h-[300px] bg-primary/[0.02] dark:bg-primary/[0.04] rounded-full blur-2xl transform translate-x-32 translate-y-24" />
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-sm">
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
              Continuar como Convidado
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
              Continuar como Convidado
            </Button>
          </SignUpAuthScreen>
        )}
      </div>

      {/* Footer subtle help link */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <Link
          href="/"
          className="hover:text-foreground underline-offset-4 hover:underline transition-colors"
        >
          ← Voltar para o início
        </Link>
      </div>
    </div>
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
