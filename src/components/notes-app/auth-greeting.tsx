"use client";

import type { ComponentProps } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface AuthGreetingProps extends ComponentProps<"div"> {}

export function AuthGreeting({ className, ...props }: AuthGreetingProps) {
  const { user } = useAuth();

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {user ? `Olá, ${user.displayName || "Usuário"}!` : "Notes App"}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {user
          ? "Você está conectado com sucesso ao Firebase."
          : "Faça login para acessar suas anotações."}
      </p>
    </div>
  );
}
