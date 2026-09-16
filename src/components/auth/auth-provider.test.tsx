import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider, getFriendlyErrorMessage } from "@/components/auth/auth-provider";
import { useAuth } from "@/hooks/use-auth";

const { mockCurrentUser } = vi.hoisted(() => ({
  mockCurrentUser: {
    uid: "test-uid-123",
    email: "test@example.com",
    displayName: "Tester",
    isAnonymous: false,
  },
}));

vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(() => ({
      currentUser: mockCurrentUser,
    })),
    connectAuthEmulator: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    EmailAuthProvider: {
      credential: vi.fn(() => ({})),
    },
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(null);
      return vi.fn();
    }),
    signInWithEmailAndPassword: vi.fn(async () => ({
      user: { uid: "test-uid-123", email: "test@example.com", displayName: "Tester", isAnonymous: false },
    })),
    createUserWithEmailAndPassword: vi.fn(async () => ({
      user: { uid: "test-new-uid", email: "newuser@example.com", displayName: null, isAnonymous: false },
    })),
    signInWithPopup: vi.fn(async () => ({
      user: { uid: "test-google-uid", email: "google@example.com", displayName: "Google User", isAnonymous: false },
    })),
    signInAnonymously: vi.fn(async () => ({
      user: { uid: "test-anon-uid", email: null, displayName: null, isAnonymous: true },
    })),
    linkWithCredential: vi.fn(async () => ({
      user: { uid: "test-anon-uid", email: "linked@example.com", displayName: null, isAnonymous: false },
    })),
    linkWithPopup: vi.fn(async () => ({
      user: { uid: "test-anon-uid", email: "linked-google@example.com", displayName: "Google Linked", isAnonymous: false },
    })),
    sendPasswordResetEmail: vi.fn(async () => { }),
    updateProfile: vi.fn(async () => { }),
    signOut: vi.fn(async () => { }),
  };
});

vi.mock("@/integrations/firebase", () => ({
  auth: {
    currentUser: mockCurrentUser,
  },
  googleAuthProvider: {},
  setupEmulator: vi.fn(),
}));

describe("getFriendlyErrorMessage", () => {
  it("translates invalid credential code to pt-BR message", () => {
    const msg = getFriendlyErrorMessage({ code: "auth/invalid-credential" });
    expect(msg).toBe("E-mail ou senha incorretos.");
  });

  it("translates email already in use to pt-BR message", () => {
    const msg = getFriendlyErrorMessage({ code: "auth/email-already-in-use" });
    expect(msg).toBe("Este e-mail já está cadastrado.");
  });

  it("translates weak password to pt-BR message", () => {
    const msg = getFriendlyErrorMessage({ code: "auth/weak-password" });
    expect(msg).toBe("A senha deve ter pelo menos 6 caracteres.");
  });

  it("translates network failure to pt-BR message with emulator notice", () => {
    const msg = getFriendlyErrorMessage({ code: "auth/network-request-failed" });
    expect(msg).toContain("emulador");
  });

  it("translates popup blocked and generic error gracefully", () => {
    const popupMsg = getFriendlyErrorMessage({ code: "auth/popup-blocked" });
    expect(popupMsg).toContain("bloqueado");

    const msg = getFriendlyErrorMessage(new Error("Generic failure"));
    expect(msg).toBe("Generic failure");
  });
});

describe("useAuth hook", () => {
  it("returns default fallback state if used outside AuthProvider", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.role).toBe("guest");
    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe("AuthProvider", () => {
  function TestConsumer() {
    const {
      user,
      error,
      loginWithEmail,
      registerWithEmail,
      loginAnonymously,
      linkAccountWithEmail,
      updateUserProfile,
      resetPassword,
      logout,
      clearError,
      role,
      isAuthenticated,
    } = useAuth();
    return (
      <div>
        <span data-testid="user-email">{user ? user.email || "anonimo" : "deslogado"}</span>
        <span data-testid="user-role">{role}</span>
        <span data-testid="is-auth">{isAuthenticated ? "sim" : "nao"}</span>
        <span data-testid="auth-error">{error || "none"}</span>
        <button
          type="button"
          onClick={() => loginWithEmail("test@example.com", "password123")}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => registerWithEmail("new@example.com", "password123", "Novo Aluno")}
        >
          Registrar
        </button>
        <button
          type="button"
          onClick={() => loginAnonymously()}
        >
          Convidado
        </button>
        <button
          type="button"
          onClick={() => linkAccountWithEmail("linked@example.com", "password123")}
        >
          Vincular
        </button>
        <button
          type="button"
          onClick={() => updateUserProfile({ displayName: "Tester Atualizado" })}
        >
          Atualizar Perfil
        </button>
        <button
          type="button"
          onClick={() => resetPassword("test@example.com")}
        >
          Recuperar
        </button>
        <button type="button" onClick={() => clearError()}>
          Limpar Erro
        </button>
        <button type="button" onClick={() => logout()}>
          Sair
        </button>
      </div>
    );
  }

  it("renders children and handles login and logout flow", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-email")).toHaveTextContent("deslogado");
    expect(screen.getByTestId("is-auth")).toHaveTextContent("nao");

    const loginBtn = screen.getByRole("button", { name: "Entrar" });
    await user.click(loginBtn);

    expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    expect(screen.getByTestId("user-role")).toHaveTextContent("user");
    expect(screen.getByTestId("is-auth")).toHaveTextContent("sim");

    const logoutBtn = screen.getByRole("button", { name: "Sair" });
    await user.click(logoutBtn);

    expect(screen.getByTestId("user-email")).toHaveTextContent("deslogado");
  });

  it("handles anonymous login, linking, and profile update flow", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    const anonBtn = screen.getByRole("button", { name: "Convidado" });
    await user.click(anonBtn);

    expect(screen.getByTestId("user-email")).toHaveTextContent("anonimo");
    expect(screen.getByTestId("user-role")).toHaveTextContent("guest");
    expect(screen.getByTestId("is-auth")).toHaveTextContent("sim");

    const linkBtn = screen.getByRole("button", { name: "Vincular" });
    await user.click(linkBtn);
    expect(screen.getByTestId("user-email")).toHaveTextContent("linked@example.com");

    const updateBtn = screen.getByRole("button", { name: "Atualizar Perfil" });
    await user.click(updateBtn);

    const clearBtn = screen.getByRole("button", { name: "Limpar Erro" });
    await user.click(clearBtn);
    expect(screen.getByTestId("auth-error")).toHaveTextContent("none");
  });
});
