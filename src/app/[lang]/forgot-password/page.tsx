"use client";

import { useRouter } from "next/navigation";

import { ForgotPasswordAuthScreen as ShadcnForgotPasswordAuthScreen } from "@/components/auth/forgot-password-auth-screen";
import { useI18n } from "@/hooks/use-i18n";
import { localePath } from "@/lib/i18n/routing";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { locale } = useI18n();
  const signInPath = localePath(locale, "/sign-in");

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <ShadcnForgotPasswordAuthScreen
        onBackToSignInClick={() => router.push(signInPath)}
      />
    </main>
  );
}
