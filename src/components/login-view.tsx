"use client";

import * as React from "react";
import { ArrowLeft, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getSafeRedirectUrl } from "@/lib/auth-validation";
import { cn } from "@/lib/utils";

export type LoginViewProps = React.ComponentProps<"div">;

export function LoginView({ className, ...props }: LoginViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAnonymous, loading } = useAuth();

  const redirectParam = searchParams.get("redirect");
  const modeParam = searchParams.get("mode");
  const safeRedirect = getSafeRedirectUrl(redirectParam, "/");

  const initialTab: "login" | "register" | "reset-password" =
    modeParam === "register"
      ? "register"
      : modeParam === "reset"
        ? "reset-password"
        : "login";

  // If already authenticated with a permanent account, redirect immediately
  React.useEffect(() => {
    if (!loading && user && !isAnonymous) {
      router.replace(safeRedirect);
    }
  }, [loading, user, isAnonymous, router, safeRedirect]);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col justify-between bg-muted/30 p-4 sm:p-6 lg:p-8 relative overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Background Decorative Blur */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Top bar with back to home */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Voltar para a biblioteca</span>
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8 z-10">
        <Card className="border-border/70 shadow-lg shadow-black/5 backdrop-blur-xs bg-card/95">
          <CardHeader className="text-center pb-4 pt-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 mb-3">
              <Sparkles size={24} />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              {isAnonymous ? "Vincular sua conta" : "Boas-vindas ao Revisa"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isAnonymous
                ? "Conecte sua conta para sincronizar seus cartões e nunca perder seu progresso."
                : "Seu espaço de memorização com repetição espaçada no seu próprio ritmo."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 pb-6 px-5 sm:px-6">
            <AuthForm
              initialTab={initialTab}
              onSuccess={() => {
                router.replace(safeRedirect);
              }}
            />
          </CardContent>
        </Card>

        {/* Feature badges below card */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] text-muted-foreground px-2">
          <div className="flex items-center gap-1.5 justify-center p-2 rounded-lg bg-card/50 border border-border/50">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Privacidade em primeiro lugar</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center p-2 rounded-lg bg-card/50 border border-border/50">
            <BookOpen size={14} className="text-primary shrink-0" />
            <span>Repetição espaçada inteligente</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center text-[11px] text-muted-foreground/80 py-2 z-10">
        <p>Revisa &copy; {new Date().getFullYear()} &bull; Estude com foco e retenção máxima</p>
      </footer>
    </div>
  );
}
