import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";

import { UserNav } from "@/components/user-nav";
import * as useAuthModule from "@/hooks/use-auth";

vi.mock("@/hooks/use-auth");

const defaultAuthMock = {
  user: null,
  loading: false,
  error: null,
  role: "guest" as const,
  isAnonymous: false,
  isAuthenticated: false,
  permissions: [],
  hasPermission: () => false,
  loginWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  loginWithGoogle: vi.fn(),
  loginAnonymously: vi.fn(),
  resetPassword: vi.fn(),
  linkAccountWithEmail: vi.fn(),
  linkAccountWithGoogle: vi.fn(),
  updateUserProfile: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn(),
};

describe("UserNav", () => {
  it("renders loading state skeleton", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      ...defaultAuthMock,
      loading: true,
    });

    const { container } = render(<UserNav />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders login button when unauthenticated", async () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      ...defaultAuthMock,
      loading: false,
      user: null,
      isAuthenticated: false,
    });

    render(<UserNav />);
    expect(screen.getByRole("button", { name: /Entrar \/ Cadastrar/i })).toBeInTheDocument();
  });

  it("renders guest user state with temp badge and save button", async () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      ...defaultAuthMock,
      user: { uid: "anon-1", isAnonymous: true } as unknown as User,
      loading: false,
      isAnonymous: true,
      isAuthenticated: true,
      role: "guest",
    });

    render(<UserNav />);
    expect(screen.getByText("Convidado")).toBeInTheDocument();
    expect(screen.getByText("Temp")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Salvar conta/i })).toBeInTheDocument();
  });

  it("renders authenticated user with email and triggers logout", async () => {
    const logout = vi.fn();
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      ...defaultAuthMock,
      user: {
        uid: "user-1",
        email: "aluno@exemplo.com",
        displayName: "Maria Silva",
        isAnonymous: false,
      } as unknown as User,
      loading: false,
      isAnonymous: false,
      isAuthenticated: true,
      role: "user",
      logout,
    });

    const user = userEvent.setup();
    render(<UserNav />);

    expect(screen.getByText("Maria Silva")).toBeInTheDocument();
    expect(screen.getByText("aluno@exemplo.com")).toBeInTheDocument();

    const logoutBtn = screen.getByRole("button", { name: /Sair/i });
    await user.click(logoutBtn);
    expect(logout).toHaveBeenCalledOnce();
  });
});
