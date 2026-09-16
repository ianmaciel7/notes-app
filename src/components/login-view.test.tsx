import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginView } from "@/components/login-view";
import * as useAuthModule from "@/hooks/use-auth";

const mockPush = vi.fn();
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/hooks/use-auth");

describe("LoginView", () => {
  const mockLoginWithEmail = vi.fn();
  const mockRegisterWithEmail = vi.fn();
  const mockLoginWithGoogle = vi.fn();
  const mockLoginAnonymously = vi.fn();
  const mockLinkAccountWithEmail = vi.fn();
  const mockLinkAccountWithGoogle = vi.fn();
  const mockResetPassword = vi.fn();
  const mockClearError = vi.fn();

  function setupAuthMock(overrides?: Partial<ReturnType<typeof useAuthModule.useAuth>>) {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      role: "guest",
      isAnonymous: false,
      isAuthenticated: false,
      permissions: [],
      hasPermission: () => false,
      loginWithEmail: mockLoginWithEmail.mockResolvedValue(undefined),
      registerWithEmail: mockRegisterWithEmail.mockResolvedValue(undefined),
      loginWithGoogle: mockLoginWithGoogle.mockResolvedValue(undefined),
      loginAnonymously: mockLoginAnonymously.mockResolvedValue(undefined),
      linkAccountWithEmail: mockLinkAccountWithEmail.mockResolvedValue(undefined),
      linkAccountWithGoogle: mockLinkAccountWithGoogle.mockResolvedValue(undefined),
      resetPassword: mockResetPassword.mockResolvedValue(undefined),
      updateUserProfile: vi.fn(),
      logout: vi.fn(),
      clearError: mockClearError,
      ...overrides,
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    setupAuthMock();
  });

  describe("Rendering and Branding", () => {
    it("renders branding header, description, back button, form inputs, badges and footer", () => {
      render(<LoginView />);

      // Top back link
      const backLink = screen.getByRole("link", { name: /Voltar para a biblioteca/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/");

      // Header and description
      expect(screen.getByRole("heading", { name: "Boas-vindas ao Revisa" })).toBeInTheDocument();
      expect(
        screen.getByText("Seu espaço de memorização com repetição espaçada no seu próprio ritmo."),
      ).toBeInTheDocument();

      // Form inputs and buttons
      expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
      expect(screen.getByLabelText("Senha")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continuar com Google/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Continuar como convidado \(sem cadastro\)/i }),
      ).toBeInTheDocument();

      // Feature badges
      expect(screen.getByText("Privacidade em primeiro lugar")).toBeInTheDocument();
      expect(screen.getByText("Repetição espaçada inteligente")).toBeInTheDocument();

      // Footer
      expect(
        screen.getByText(new RegExp(`Revisa © ${new Date().getFullYear()}`)),
      ).toBeInTheDocument();
    });

    it("renders account linking copy when user is anonymous", () => {
      setupAuthMock({
        user: { uid: "anon-42", isAnonymous: true } as any,
        isAnonymous: true,
      });

      render(<LoginView />);

      expect(screen.getByRole("heading", { name: "Vincular sua conta" })).toBeInTheDocument();
      expect(
        screen.getByText("Conecte sua conta para sincronizar seus cartões e nunca perder seu progresso."),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Vincular com Google/i })).toBeInTheDocument();
      // Guest login button should not be displayed when already a user
      expect(
        screen.queryByRole("button", { name: /Continuar como convidado/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Auto-redirection", () => {
    it("redirects authenticated permanent user to default safe redirect '/'", () => {
      setupAuthMock({
        user: { uid: "user-123", email: "user@example.com", isAnonymous: false } as any,
        isAuthenticated: true,
        loading: false,
        isAnonymous: false,
      });

      render(<LoginView />);

      expect(mockReplace).toHaveBeenCalledWith("/");
    });

    it("redirects authenticated user to target URL specified in searchParams", () => {
      mockSearchParams = new URLSearchParams({ redirect: "/decks/chemistry-101" });
      setupAuthMock({
        user: { uid: "user-123", email: "user@example.com", isAnonymous: false } as any,
        isAuthenticated: true,
        loading: false,
        isAnonymous: false,
      });

      render(<LoginView />);

      expect(mockReplace).toHaveBeenCalledWith("/decks/chemistry-101");
    });

    it("sanitizes unsafe redirect URL to fallback '/' when redirecting authenticated user", () => {
      mockSearchParams = new URLSearchParams({ redirect: "https://evil.com/phishing" });
      setupAuthMock({
        user: { uid: "user-123", email: "user@example.com", isAnonymous: false } as any,
        isAuthenticated: true,
        loading: false,
        isAnonymous: false,
      });

      render(<LoginView />);

      expect(mockReplace).toHaveBeenCalledWith("/");
    });

    it("does not redirect when auth is still loading", () => {
      setupAuthMock({
        user: { uid: "user-123", email: "user@example.com", isAnonymous: false } as any,
        loading: true,
        isAnonymous: false,
      });

      render(<LoginView />);

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("does not auto-redirect when user is anonymous", () => {
      setupAuthMock({
        user: { uid: "anon-123", isAnonymous: true } as any,
        loading: false,
        isAnonymous: true,
      });

      render(<LoginView />);

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe("Mode search parameter handling", () => {
    it("renders register tab initially when ?mode=register", () => {
      mockSearchParams = new URLSearchParams({ mode: "register" });
      render(<LoginView />);

      expect(screen.getByLabelText("Nome")).toBeInTheDocument();
      expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
      expect(screen.getByLabelText("Senha")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirmar Senha")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Criar Conta" })).toBeInTheDocument();
    });

    it("renders reset password mode initially when ?mode=reset", () => {
      mockSearchParams = new URLSearchParams({ mode: "reset" });
      render(<LoginView />);

      expect(screen.getByRole("heading", { name: "Recuperar Senha" })).toBeInTheDocument();
      expect(
        screen.getByText(/Digite seu e-mail cadastrado\. Enviaremos um link de recuperação/i),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Enviar Link de Recuperação" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();
    });
  });

  describe("Form submission and interactions", () => {
    it("logs in successfully with email and redirects to safe URL", async () => {
      mockSearchParams = new URLSearchParams({ redirect: "/decks" });
      const user = userEvent.setup();

      render(<LoginView />);

      await user.type(screen.getByLabelText("E-mail"), "estudante@exemplo.com");
      await user.type(screen.getByLabelText("Senha"), "senha123");
      await user.click(screen.getByRole("button", { name: "Entrar" }));

      expect(mockLoginWithEmail).toHaveBeenCalledWith("estudante@exemplo.com", "senha123");
      expect(mockReplace).toHaveBeenCalledWith("/decks");
    });

    it("logs in with Google and redirects to safe URL", async () => {
      mockSearchParams = new URLSearchParams({ redirect: "/stats" });
      const user = userEvent.setup();

      render(<LoginView />);

      await user.click(screen.getByRole("button", { name: /Continuar com Google/i }));

      expect(mockLoginWithGoogle).toHaveBeenCalledOnce();
      expect(mockReplace).toHaveBeenCalledWith("/stats");
    });

    it("logs in anonymously as guest and redirects to safe URL", async () => {
      mockSearchParams = new URLSearchParams({ redirect: "/library" });
      const user = userEvent.setup();

      render(<LoginView />);

      await user.click(
        screen.getByRole("button", { name: /Continuar como convidado \(sem cadastro\)/i }),
      );

      expect(mockLoginAnonymously).toHaveBeenCalledOnce();
      expect(mockReplace).toHaveBeenCalledWith("/library");
    });

    it("allows switching to reset-password and back to auth mode", async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      // Click forgot password
      await user.click(screen.getByRole("button", { name: /Esqueceu a senha\?/i }));
      expect(screen.getByRole("heading", { name: "Recuperar Senha" })).toBeInTheDocument();

      // Click back
      await user.click(screen.getByRole("button", { name: "Voltar" }));
      expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    });
  });
});
