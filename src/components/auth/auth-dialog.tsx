"use client";

import * as React from "react";
import { AuthForm, type AuthFormMode } from "@/components/auth/auth-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface AuthDialogProps extends Omit<React.ComponentProps<typeof Dialog>, "children"> {
  onClose: () => void;
  initialTab?: "login" | "register" | "reset-password";
}

export function AuthDialog({ open, onClose, initialTab = "login", ...props }: AuthDialogProps) {
  const [mode, setMode] = React.useState<AuthFormMode>(
    initialTab === "reset-password" ? "reset-password" : "auth",
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()} {...props}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "reset-password" ? "Recuperar Senha" : "Conta Revisa"}
          </DialogTitle>
          <DialogDescription>
            {mode === "reset-password"
              ? "Digite seu e-mail para receber as instruções de recuperação de senha."
              : "Acesse sua conta para identificar seu perfil e sincronizar seus estudos."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <AuthForm
            isModal={true}
            initialTab={initialTab}
            onModeChange={setMode}
            onSuccess={onClose}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
