import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "@/components/login-view";

export const metadata: Metadata = {
  title: "Entrar ou Criar Conta | Revisa",
  description: "Acesse sua conta ou continue seus estudos no Revisa com repetição espaçada.",
  robots: {
    index: false,
    follow: false,
  },
};

function LoginLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-card border border-border animate-pulse space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-muted mx-auto" />
        <div className="h-6 w-48 bg-muted mx-auto rounded" />
        <div className="h-4 w-64 bg-muted mx-auto rounded" />
        <div className="h-10 bg-muted rounded mt-6" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingSkeleton />}>
      <LoginView />
    </Suspense>
  );
}
