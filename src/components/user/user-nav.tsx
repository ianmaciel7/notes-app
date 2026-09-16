"use client";

import * as React from "react";
import { LogIn, LogOut, Sparkles } from "lucide-react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface UserNavProps extends React.ComponentProps<"div"> {
  compact?: boolean;
}

export function UserNav({ compact = false, className, ...props }: UserNavProps) {
  const { user, loading, isAnonymous, logout } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground animate-pulse", className)} {...props}>
        <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
        {!compact && <div className="h-3 w-16 bg-muted rounded" />}
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn(compact ? "inline-flex" : "w-full", className)} {...props}>
        {compact ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setAuthDialogOpen(true)}
            aria-label="Entrar na conta"
          >
            <LogIn size={16} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAuthDialogOpen(true)}
            className="w-full justify-start gap-2 text-xs font-medium"
          >
            <LogIn size={15} />
            <span>Entrar / Cadastrar</span>
          </Button>
        )}
        <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      </div>
    );
  }

  const isGuest = isAnonymous;
  const displayName = isGuest
    ? "Convidado"
    : user.displayName || user.email?.split("@")[0] || "Usuário";
  const userInitials = isGuest
    ? "CV"
    : (user.displayName || user.email || "U").substring(0, 2).toUpperCase();

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)} {...props}>
        {isGuest ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAuthDialogOpen(true)}
            className="h-8 text-xs gap-1 px-2 text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
            title="Salvar conta permanente"
          >
            <Sparkles size={13} />
            <span>Salvar</span>
          </Button>
        ) : (
          <Avatar size="sm" className="w-7 h-7">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          aria-label="Sair da conta"
          title={`Sair (${isGuest ? "Convidado" : user.email || displayName})`}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <LogOut size={15} />
        </Button>
        <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-2 rounded-lg border",
        isGuest
          ? "bg-primary/5 border-primary/20"
          : "bg-sidebar-accent/40 border-sidebar-border",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar size="sm" className="w-7 h-7 shrink-0">
          {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
          <AvatarFallback
            className={cn(
              "text-[10px] font-bold",
              isGuest
                ? "bg-primary/20 text-primary"
                : "bg-sidebar-primary text-sidebar-primary-foreground",
            )}
          >
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-sidebar-foreground truncate" title={displayName}>
              {displayName}
            </p>
            {isGuest && (
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold border border-border">
                Temp
              </span>
            )}
          </div>
          {user.email ? (
            <p className="text-[11px] text-sidebar-foreground/60 truncate" title={user.email}>
              {user.email}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground truncate">
              Dados locais
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {isGuest ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setAuthDialogOpen(true)}
            className="flex-1 justify-center gap-1.5 text-xs h-7 px-2"
          >
            <Sparkles size={13} />
            <span>Salvar conta</span>
          </Button>
        ) : null}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className={cn(
            "justify-start gap-1.5 text-xs text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 h-7 px-2",
            !isGuest && "w-full",
          )}
          title="Sair da sessão"
        >
          <LogOut size={13} />
          <span>Sair</span>
        </Button>
      </div>

      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </div>
  );
}
