import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider, getFriendlyErrorMessage } from "@/components/auth-provider";
import { useAuth } from "@/hooks/use-auth";

// Mock firebase/auth
vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(() => ({})),
    connectAuthEmulator: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(null);
      return vi.fn();
    }),
    signInWithEmailAndPassword: vi.fn(async () => ({
      user: { uid: "test-uid-123", email: "test@example.com", displayName: "Tester" },
    })),
    createUserWithEmailAndPassword: vi.fn(async () => ({
      user: { uid: "test-new-uid", email: "newuser@example.com", displayName: null },
    })),
    signInWithPopup: vi.fn(async () => ({
      user: { uid: "test-google-uid", email: "google@example.com", displayName: "Google User" },
    })),
    signOut: vi.fn(async () => {}),
  };
});

// Mock firebase app integration
vi.mock("@/integrations/firebase", () => ({
  auth: {},
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

  it("translates generic error gracefully", () => {
    const msg = getFriendlyErrorMessage(new Error("Generic failure"));
    expect(msg).toBe("Generic failure");
  });
});

describe("useAuth hook", () => {
  it("returns default fallback state if used outside AuthProvider", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});

describe("AuthProvider", () => {
  function TestConsumer() {
    const { user, loginWithEmail, logout } = useAuth();
    return (
      <div>
        <span data-testid="user-email">{user ? user.email : "deslogado"}</span>
        <button
          type="button"
          onClick={() => loginWithEmail("test@example.com", "123456")}
        >
          Entrar
        </button>
        <button type="button" onClick={() => logout()}>
          Sair
        </button>
      </div>
    );
  }

  it("renders children and handles login flow", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-email")).toHaveTextContent("deslogado");

    const loginBtn = screen.getByRole("button", { name: "Entrar" });
    await act(async () => {
      await user.click(loginBtn);
    });

    expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");

    const logoutBtn = screen.getByRole("button", { name: "Sair" });
    await act(async () => {
      await user.click(logoutBtn);
    });

    expect(screen.getByTestId("user-email")).toHaveTextContent("deslogado");
  });
});
