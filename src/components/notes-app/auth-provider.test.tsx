import { cleanup, render, screen } from "@testing-library/react";
import type { User } from "firebase/auth";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext, AuthProvider } from "./auth-provider";
import { RequireAuth } from "./require-auth";
import { UserMenu } from "./user-menu";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("AuthProvider and Auth components", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders children within AuthProvider", () => {
    render(
      <AuthProvider>
        <div data-testid="child-element">Child Content</div>
      </AuthProvider>,
    );

    expect(screen.getByTestId("child-element")).toBeDefined();
    expect(screen.getByText("Child Content")).toBeDefined();
  });

  it("UserMenu displays login button when unauthenticated", () => {
    render(
      <AuthContext
        value={{
          user: null,
          isLoading: false,
          signOutUser: async () => {},
        }}
      >
        <UserMenu />
      </AuthContext>,
    );

    expect(screen.getByTestId("login-link")).toBeDefined();
    expect(screen.getByText("Entrar")).toBeDefined();
  });

  it("UserMenu displays user email and Sair button when authenticated", () => {
    const mockUser = {
      uid: "test-user-123",
      email: "tester1@notesapp.dev",
      displayName: "Tester One",
      isAnonymous: false,
    } as unknown as User;

    render(
      <AuthContext
        value={{
          user: mockUser,
          isLoading: false,
          signOutUser: async () => {},
        }}
      >
        <UserMenu />
      </AuthContext>,
    );

    expect(screen.getByTestId("user-menu")).toBeDefined();
    expect(screen.getByText("Tester One")).toBeDefined();
    expect(screen.getByTestId("sign-out-btn")).toBeDefined();
  });

  it("RequireAuth renders fallback during loading", () => {
    render(
      <AuthContext
        value={{
          user: null,
          isLoading: true,
          signOutUser: async () => {},
        }}
      >
        <RequireAuth
          fallback={<div data-testid="custom-loading">Carregando...</div>}
        >
          <div>Conteúdo Protegido</div>
        </RequireAuth>
      </AuthContext>,
    );

    expect(screen.getByTestId("custom-loading")).toBeDefined();
    expect(screen.queryByText("Conteúdo Protegido")).toBeNull();
  });

  it("RequireAuth renders protected content when authenticated", () => {
    const mockUser = {
      uid: "test-user-123",
      email: "tester1@notesapp.dev",
    } as unknown as User;

    render(
      <AuthContext
        value={{
          user: mockUser,
          isLoading: false,
          signOutUser: async () => {},
        }}
      >
        <RequireAuth>
          <div data-testid="protected-content">Conteúdo Protegido</div>
        </RequireAuth>
      </AuthContext>,
    );

    expect(screen.getByTestId("protected-content")).toBeDefined();
    expect(screen.getByText("Conteúdo Protegido")).toBeDefined();
  });

  it("UserMenu forwards className and HTML attributes when unauthenticated", () => {
    render(
      <AuthContext
        value={{
          user: null,
          isLoading: false,
          signOutUser: async () => {},
        }}
      >
        <UserMenu
          data-testid="custom-login-container"
          className="custom-unauth-class"
          aria-label="User Navigation"
        />
      </AuthContext>,
    );

    const element = screen.getByTestId("custom-login-container");
    expect(element.getAttribute("aria-label")).toBe("User Navigation");
    expect(element.classList.contains("custom-unauth-class")).toBe(true);
  });

  it("UserMenu forwards className and HTML attributes when authenticated", () => {
    const mockUser = {
      uid: "test-user-123",
      email: "tester1@notesapp.dev",
      displayName: "Tester One",
      isAnonymous: false,
    } as unknown as User;

    render(
      <AuthContext
        value={{
          user: mockUser,
          isLoading: false,
          signOutUser: async () => {},
        }}
      >
        <UserMenu className="custom-auth-class" aria-label="User Controls" />
      </AuthContext>,
    );

    const element = screen.getByTestId("user-menu");
    expect(element.getAttribute("aria-label")).toBe("User Controls");
    expect(element.classList.contains("custom-auth-class")).toBe(true);
    expect(element.classList.contains("flex")).toBe(true);
  });
});
