import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthDialog } from "@/components/auth-dialog";

const mockLoginWithEmail = vi.fn().mockResolvedValue(undefined);
const mockRegisterWithEmail = vi.fn().mockResolvedValue(undefined);
const mockLoginWithGoogle = vi.fn().mockResolvedValue(undefined);
const mockLoginAnonymously = vi.fn().mockResolvedValue(undefined);
const mockLinkAccountWithEmail = vi.fn().mockResolvedValue(undefined);
const mockLinkAccountWithGoogle = vi.fn().mockResolvedValue(undefined);
const mockResetPassword = vi.fn().mockResolvedValue(undefined);
const mockClearError = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    isAnonymous: false,
    role: "guest",
    isAuthenticated: false,
    permissions: [],
    hasPermission: () => false,
    loginWithEmail: mockLoginWithEmail,
    registerWithEmail: mockRegisterWithEmail,
    loginWithGoogle: mockLoginWithGoogle,
    loginAnonymously: mockLoginAnonymously,
    linkAccountWithEmail: mockLinkAccountWithEmail,
    linkAccountWithGoogle: mockLinkAccountWithGoogle,
    resetPassword: mockResetPassword,
    updateUserProfile: vi.fn(),
    clearError: mockClearError,
    logout: vi.fn(),
  }),
}));

describe("AuthDialog", () => {
  it("renders login dialog with description, fields and anonymous option", () => {
    render(<AuthDialog open onClose={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: "Conta Revisa" })).toBeInTheDocument();
    expect(screen.getByText("Acesse sua conta para identificar seu perfil e sincronizar seus estudos.")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continuar como convidado/i })).toBeInTheDocument();
  });

  it("submits email login form", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<AuthDialog open onClose={onClose} />);

    await user.type(screen.getByLabelText("E-mail"), "test@example.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockLoginWithEmail).toHaveBeenCalledWith("test@example.com", "123456");
    expect(onClose).toHaveBeenCalled();
  });

  it("handles google login button click", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<AuthDialog open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /Continuar com Google/i }));

    expect(mockLoginWithGoogle).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("handles anonymous login button click", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<AuthDialog open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /Continuar como convidado/i }));

    expect(mockLoginAnonymously).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("switches to registration tab and submits registration", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<AuthDialog open onClose={onClose} />);

    const registerTab = screen.getByRole("tab", { name: /Criar Conta/i });
    await user.click(registerTab);

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Nome"), "Carlos Silva");
    await user.type(screen.getByLabelText("E-mail"), "carlos@exemplo.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.type(screen.getByLabelText("Confirmar Senha"), "123456");

    await user.click(screen.getByRole("button", { name: "Criar Conta" }));

    expect(mockRegisterWithEmail).toHaveBeenCalledWith("carlos@exemplo.com", "123456", "Carlos Silva");
    expect(onClose).toHaveBeenCalled();
  });

  it("switches to password reset mode and submits reset email", async () => {
    const user = userEvent.setup();

    render(<AuthDialog open onClose={vi.fn()} />);

    const forgotBtn = screen.getByRole("button", { name: /Esqueceu a senha\?/i });
    await user.click(forgotBtn);

    expect(screen.getByRole("heading", { name: /Recuperar Senha/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText("E-mail"), "reset@example.com");
    await user.click(screen.getByRole("button", { name: "Enviar Link de Recuperação" }));

    expect(mockResetPassword).toHaveBeenCalledWith("reset@example.com");
  });
});
