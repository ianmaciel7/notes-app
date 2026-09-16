"use client";

import * as React from "react";
import { ArrowLeft, CheckCircle2, LogIn, UserCheck, UserPlus, AlertCircle } from "lucide-react";

import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/auth-validation";
import { cn } from "@/lib/utils";

export type AuthFormMode = "auth" | "reset-password";
export type AuthFormTab = "login" | "register";

export interface AuthFormProps extends React.ComponentProps<"div"> {
  initialTab?: "login" | "register" | "reset-password";
  isModal?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  onModeChange?: (mode: AuthFormMode) => void;
}

export function AuthForm({
  initialTab = "login",
  isModal = false,
  onSuccess,
  onCancel,
  onModeChange,
  className,
  ...props
}: AuthFormProps) {
  const {
    user,
    isAnonymous,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginAnonymously,
    linkAccountWithEmail,
    linkAccountWithGoogle,
    resetPassword,
    error: authError,
    clearError,
  } = useAuth();

  const [mode, setModeState] = React.useState<AuthFormMode>(
    initialTab === "reset-password" ? "reset-password" : "auth",
  );
  const [tab, setTab] = React.useState<AuthFormTab>(
    initialTab === "register" ? "register" : "login",
  );

  const setMode = React.useCallback(
    (newMode: AuthFormMode) => {
      setModeState(newMode);
      onModeChange?.(newMode);
    },
    [onModeChange],
  );

  // Form fields
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");

  // UI state
  const [loading, setLoading] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const handleComplete = React.useCallback(() => {
    if (onSuccess) {
      onSuccess();
    }
  }, [onSuccess]);

  const handleTabChange = (value: string) => {
    setTab(value as AuthFormTab);
    setLocalError(null);
    clearError();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      setLocalError(firstIssue ? firstIssue.message : "Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      handleComplete();
    } catch {
      // Error handled in auth-provider
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const validation = registerSchema.safeParse({
      displayName: displayName.trim() || undefined,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      setLocalError(firstIssue ? firstIssue.message : "Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);
    try {
      if (isAnonymous) {
        await linkAccountWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, displayName.trim() || undefined);
      }
      handleComplete();
    } catch {
      // Error handled in auth-provider
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAction = async () => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      if (isAnonymous) {
        await linkAccountWithGoogle();
      } else {
        await loginWithGoogle();
      }
      handleComplete();
    } catch {
      // Error handled in auth-provider
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      await loginAnonymously();
      handleComplete();
    } catch {
      // Error handled in auth-provider
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const validation = resetPasswordSchema.safeParse({ email });
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      setLocalError(firstIssue ? firstIssue.message : "Informe um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setResetSuccess(true);
    } catch {
      // Error handled in auth-provider
    } finally {
      setLoading(false);
    }
  };

  const currentError = localError || authError;

  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      {mode === "reset-password" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setMode("auth");
                setResetSuccess(false);
                setLocalError(null);
                clearError();
              }}
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Voltar</span>
            </Button>
          </div>

          {!isModal && (
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Recuperar Senha
              </h2>
              <p className="text-xs text-muted-foreground">
                Digite seu e-mail cadastrado. Enviaremos um link de recuperação para redefinir sua senha.
              </p>
            </div>
          )}

          {resetSuccess ? (
            <div
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-start gap-3 text-sm"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">E-mail de recuperação enviado!</p>
                <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-300">
                  Verifique sua caixa de entrada e spam em <strong>{email}</strong> para criar uma nova senha.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="reset-email">E-mail</FieldLabel>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
              </Field>

              {currentError && (
                <div
                  className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-2 text-xs"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{currentError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                )}
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <LogIn size={15} />
                <span>Entrar</span>
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <UserPlus size={15} />
                <span>{isAnonymous ? "Salvar Conta" : "Criar Conta"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Google Sign-In Top Provider */}
            <div className="space-y-3 mb-4">
              <GoogleSignInButton
                onClick={handleGoogleAction}
                loading={loading}
                label={
                  isAnonymous
                    ? "Vincular com Google"
                    : tab === "login"
                      ? "Continuar com Google"
                      : "Criar conta com Google"
                }
              />
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <span className="relative bg-card px-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  ou com e-mail
                </span>
              </div>
            </div>

            {/* Login Tab Content */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <Field>
                  <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login-password">Senha</FieldLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto text-xs text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setMode("reset-password");
                        setLocalError(null);
                        clearError();
                      }}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                </Field>

                {currentError && (
                  <div
                    className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-2 text-xs"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{currentError}</span>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Register Tab Content */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {!isAnonymous && (
                  <Field>
                    <FieldLabel htmlFor="register-name">Nome</FieldLabel>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Como deseja ser chamado?"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={loading}
                      autoComplete="name"
                    />
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="register-email">E-mail</FieldLabel>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="register-password">Senha</FieldLabel>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="register-confirm-password">Confirmar Senha</FieldLabel>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                </Field>

                {currentError && (
                  <div
                    className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-2 text-xs"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{currentError}</span>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading
                      ? "Salvando..."
                      : isAnonymous
                        ? "Salvar Conta"
                        : "Criar Conta"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* Guest login footer when not logged in */}
          {!user && (
            <div className="pt-3 border-t border-border text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground w-full justify-center gap-1.5"
                onClick={handleAnonymousLogin}
                disabled={loading}
              >
                <UserCheck size={14} />
                <span>Continuar como convidado (sem cadastro)</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
