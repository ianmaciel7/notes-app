"use client";

import * as React from "react";
import { LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  if (!open) return null;
  return <AuthDialogContent onClose={onClose} />;
}

function AuthDialogContent({ onClose }: { onClose: () => void }) {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, error: authError, clearError } = useAuth();
  const [tab, setTab] = React.useState<"login" | "register">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const emailId = React.useId();
  const passwordId = React.useId();
  const confirmPasswordId = React.useId();

  const handleTabChange = (val: string) => {
    setTab(val as "login" | "register");
    setLocalError(null);
    clearError();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (tab === "register") {
      if (password.length < 6) {
        setLocalError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("As senhas não coincidem.");
        return;
      }
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await loginWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(email.trim(), password);
      }
      onClose();
    } catch {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const currentError = localError || authError;

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[440px] p-6">
        <DialogHeader className="pb-2">
          <DialogTitle>Conta Revisa</DialogTitle>
          <DialogDescription>
            Acesse sua conta para identificar seu perfil e sincronizar seus estudos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 min-h-10"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuar com Google</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <span className="w-full border-t border-border" />
            <span className="bg-popover px-2 text-xs uppercase text-muted-foreground absolute">
              ou com e-mail
            </span>
          </div>

          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="gap-1.5">
                <LogIn size={15} />
                <span>Entrar</span>
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-1.5">
                <UserPlus size={15} />
                <span>Criar conta</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleEmailSubmit} className="space-y-3.5 pt-3">
              <Field>
                <FieldLabel htmlFor={emailId}>E-mail</FieldLabel>
                <Input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
                <Input
                  id={passwordId}
                  type="password"
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  placeholder={tab === "register" ? "Pelo menos 6 caracteres" : "Sua senha"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>

              {tab === "register" && (
                <Field>
                  <FieldLabel htmlFor={confirmPasswordId}>Confirmar senha</FieldLabel>
                  <Input
                    id={confirmPasswordId}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Field>
              )}

              {currentError && (
                <FieldError errors={[{ message: currentError }]} />
              )}

              <div className="pt-2 flex items-center justify-between gap-2">
                <DialogClose render={<Button type="button" variant="ghost" onClick={onClose} disabled={loading} />}>
                  Cancelar
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar conta"}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
