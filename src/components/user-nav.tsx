"use client";

import * as React from "react";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

import { AuthDialog } from "@/components/auth-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface UserNavProps {
  compact?: boolean;
  className?: string;
}

export function UserNav({ compact = false, className }: UserNavProps) {
  const { user, loading, logout } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground animate-pulse", className)}>
        <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
        {!compact && <div className="h-3 w-16 bg-muted rounded" />}
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {compact ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setAuthDialogOpen(true)}
            aria-label="Entrar na conta"
            className={className}
          >
            <LogIn size={16} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAuthDialogOpen(true)}
            className={cn("w-full justify-start gap-2 text-xs font-medium", className)}
          >
            <LogIn size={15} />
            <span>Entrar / Cadastrar</span>
          </Button>
        )}
        <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      </>
    );
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "Usuário";
  const userInitials = (user.displayName || user.email || "U")
    .substring(0, 2)
    .toUpperCase();

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <Avatar size="sm" className="w-7 h-7">
          {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          aria-label="Sair da conta"
          title={`Sair (${user.email || displayName})`}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <LogOut size={15} />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2 p-2 rounded-lg bg-sidebar-accent/40 border border-sidebar-border", className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar size="sm" className="w-7 h-7 shrink-0">
          {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
          <AvatarFallback className="text-[10px] bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-sidebar-foreground truncate" title={displayName}>
            {displayName}
          </p>
          {user.email && (
            <p className="text-[11px] text-sidebar-foreground/60 truncate" title={user.email}>
              {user.email}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => logout()}
        className="w-full justify-start gap-1.5 text-xs text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 h-7 px-2"
      >
        <LogOut size={13} />
        <span>Sair da conta</span>
      </Button>
    </div>
  );
}
