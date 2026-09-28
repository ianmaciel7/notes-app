import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  getRedirectResult,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  type UserCredential,
} from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/components/notes-app/auth-provider";
import LoginPage from "./page";

const { mockReplace, mockPush, mockSearchParamsGet, MockGoogleAuthProvider } =
  vi.hoisted(() => {
    class MockGoogleAuthProvider {
      scopes: string[] = [];
      addScope(scope: string) {
        this.scopes.push(scope);
      }
    }

    return {
      mockReplace: vi.fn(),
      mockPush: vi.fn(),
      mockSearchParamsGet: vi.fn().mockReturnValue(null),
      MockGoogleAuthProvider,
    };
  });

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParamsGet(key),
  }),
}));

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/auth")>();
  return {
    ...actual,
    getRedirectResult: vi.fn(),
    signInWithPopup: vi.fn(),
    signInWithRedirect: vi.fn(),
    signInAnonymously: vi.fn(),
    GoogleAuthProvider: MockGoogleAuthProvider,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsGet.mockReturnValue(null);
    vi.mocked(getRedirectResult).mockResolvedValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  function renderLoginPage() {
    return render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );
  }

  it("renders in default signIn mode and toggles to signUp mode and back", () => {
    renderLoginPage();

    // Default signIn mode renders anonymous sign-in button
    expect(screen.getByTestId("anonymous-sign-in-btn")).toBeDefined();
    expect(screen.queryByTestId("anonymous-sign-up-btn")).toBeNull();

    // Find and click the toggle to sign up mode
    const signUpToggleBtn = screen.getByText(/don't have an account/i);
    fireEvent.click(signUpToggleBtn);

    // View should switch to signUp mode
    expect(screen.getByTestId("anonymous-sign-up-btn")).toBeDefined();
    expect(screen.queryByTestId("anonymous-sign-in-btn")).toBeNull();

    // Find and click the toggle back to sign in mode
    const signInToggleBtn = screen.getByText(/already have an account/i);
    fireEvent.click(signInToggleBtn);

    // View should switch back to signIn mode
    expect(screen.getByTestId("anonymous-sign-in-btn")).toBeDefined();
  });

  it("processes getRedirectResult on mount and redirects if user exists", async () => {
    vi.mocked(getRedirectResult).mockResolvedValueOnce({
      user: { uid: "redirect-user-123" },
    } as unknown as UserCredential);

    renderLoginPage();

    await waitFor(() => {
      expect(getRedirectResult).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("handles successful Google popup login and redirects to default nextUrl", async () => {
    vi.mocked(signInWithPopup).mockResolvedValueOnce({
      user: { uid: "google-user-123" },
    } as unknown as UserCredential);

    renderLoginPage();

    const googleBtn = screen.getByTestId("google-sign-in-btn");
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(MockGoogleAuthProvider),
      );
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("falls back to signInWithRedirect when Google popup encounters popup-blocked error", async () => {
    vi.mocked(signInWithPopup).mockRejectedValueOnce(
      new Error("popup-blocked: popup was blocked by browser"),
    );
    vi.mocked(signInWithRedirect).mockImplementationOnce(
      () => Promise.resolve() as never,
    );

    renderLoginPage();

    const googleBtn = screen.getByTestId("google-sign-in-btn");
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(signInWithRedirect).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(MockGoogleAuthProvider),
      );
    });
  });

  it("falls back to signInWithRedirect when Google popup encounters 'No matching frame' error", async () => {
    vi.mocked(signInWithPopup).mockRejectedValueOnce(
      new Error("No matching frame for popup"),
    );
    vi.mocked(signInWithRedirect).mockImplementationOnce(
      () => Promise.resolve() as never,
    );

    renderLoginPage();

    const googleBtn = screen.getByTestId("google-sign-in-btn");
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(signInWithRedirect).toHaveBeenCalled();
    });
  });

  it("handles anonymous sign-in action and redirects", async () => {
    vi.mocked(signInAnonymously).mockResolvedValueOnce({
      user: { uid: "anon-user-123" },
    } as unknown as UserCredential);

    renderLoginPage();

    const anonBtn = screen.getByTestId("anonymous-sign-in-btn");
    fireEvent.click(anonBtn);

    await waitFor(() => {
      expect(signInAnonymously).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("respects query param 'next' for redirection after login", async () => {
    mockSearchParamsGet.mockImplementation((key: string) =>
      key === "next" ? "/dashboard" : null,
    );
    vi.mocked(signInAnonymously).mockResolvedValueOnce({
      user: { uid: "anon-user-456" },
    } as unknown as UserCredential);

    renderLoginPage();

    const anonBtn = screen.getByTestId("anonymous-sign-in-btn");
    fireEvent.click(anonBtn);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });
});
