import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthGate } from "@/components/auth/auth-gate";
import * as useAuthHook from "@/hooks/use-auth";

vi.mock("@/components/auth-dialog", () => ({
  AuthDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid="mock-auth-dialog">Dialog Aberto</div> : null,
}));

describe("AuthGate", () => {
  it("renders loading skeleton when auth is loading", () => {
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: null,
      loading: true,
      error: null,
      role: "guest",
      isAnonymous: false,
      isAuthenticated: false,
      permissions: [],
      hasPermission: () => false,
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      loginAnonymously: vi.fn(),
      linkAccountWithEmail: vi.fn(),
      linkAccountWithGoogle: vi.fn(),
      resetPassword: vi.fn(),
      updateUserProfile: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <AuthGate>
        <div data-testid="protected-content">Conteúdo Secreto</div>
      </AuthGate>,
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("renders protected content when user is authenticated", () => {
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: { uid: "123", email: "user@example.com", isAnonymous: false } as unknown as import("firebase/auth").User,
      loading: false,
      error: null,
      role: "user",
      isAnonymous: false,
      isAuthenticated: true,
      permissions: ["manage_backup", "sync_cloud"],
      hasPermission: (perm) => perm === "sync_cloud" || perm === "manage_backup",
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      loginAnonymously: vi.fn(),
      linkAccountWithEmail: vi.fn(),
      linkAccountWithGoogle: vi.fn(),
      resetPassword: vi.fn(),
      updateUserProfile: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <AuthGate>
        <div data-testid="protected-content">Conteúdo Secreto</div>
      </AuthGate>,
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("renders restriction card and opens AuthDialog when unauthenticated", async () => {
    const user = userEvent.setup();
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: null,
      loading: false,
      error: null,
      role: "guest",
      isAnonymous: false,
      isAuthenticated: false,
      permissions: [],
      hasPermission: () => false,
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      loginAnonymously: vi.fn(),
      linkAccountWithEmail: vi.fn(),
      linkAccountWithGoogle: vi.fn(),
      resetPassword: vi.fn(),
      updateUserProfile: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <AuthGate title="Recurso Restrito">
        <div data-testid="protected-content">Conteúdo Secreto</div>
      </AuthGate>,
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByText("Recurso Restrito")).toBeInTheDocument();

    const enterBtn = screen.getByRole("button", { name: "Entrar na Conta" });
    await user.click(enterBtn);

    expect(screen.getByTestId("mock-auth-dialog")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: null,
      loading: false,
      error: null,
      role: "guest",
      isAnonymous: false,
      isAuthenticated: false,
      permissions: [],
      hasPermission: () => false,
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      loginAnonymously: vi.fn(),
      linkAccountWithEmail: vi.fn(),
      linkAccountWithGoogle: vi.fn(),
      resetPassword: vi.fn(),
      updateUserProfile: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <AuthGate fallback={<div data-testid="custom-fallback">Fallback customizado</div>}>
        <div data-testid="protected-content">Conteúdo Secreto</div>
      </AuthGate>,
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });

  it("checks permissions correctly", () => {
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: { uid: "123", email: "user@example.com", isAnonymous: false } as unknown as import("firebase/auth").User,
      loading: false,
      error: null,
      role: "user",
      isAnonymous: false,
      isAuthenticated: true,
      permissions: ["manage_backup"],
      hasPermission: (perm) => perm === "manage_backup",
      loginWithEmail: vi.fn(),
      registerWithEmail: vi.fn(),
      loginWithGoogle: vi.fn(),
      loginAnonymously: vi.fn(),
      linkAccountWithEmail: vi.fn(),
      linkAccountWithGoogle: vi.fn(),
      resetPassword: vi.fn(),
      updateUserProfile: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <AuthGate requirePermission="admin_access">
        <div data-testid="protected-content">Painel de Admin</div>
      </AuthGate>,
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.getByText("Você não tem autorização para realizar esta ação.")).toBeInTheDocument();
  });
});
