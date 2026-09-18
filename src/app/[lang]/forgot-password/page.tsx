"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import { ForgotPasswordAuthScreen as ShadcnForgotPasswordAuthScreen } from "@/components/forgot-password-auth-screen";
import { localePath } from "@/lib/i18n/routing";

export default function ForgotPasswordPage({
  params,
}: PageProps<"/[lang]/forgot-password">) {
  const router = useRouter();
  const { lang } = use(params);
  const signInPath = localePath(lang, "/sign-in");

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <ShadcnForgotPasswordAuthScreen
        onBackToSignInClick={() => router.push(signInPath)}
      />
    </main>
  );
}
