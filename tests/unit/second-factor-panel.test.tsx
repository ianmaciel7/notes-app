import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type FakeUser = {
  email: string | null;
  emailVerified: boolean;
  getIdToken: ReturnType<typeof vi.fn>;
  reload: ReturnType<typeof vi.fn>;
};

const mocks = vi.hoisted(() => ({
  auth: { currentUser: null as unknown },
  createServerSession: vi.fn(async () => undefined),
  enrolledFactors: [] as Array<{
    displayName: string | null;
    factorId: string;
    phoneNumber: string;
    uid: string;
  }>,
  handleSignOut: vi.fn(async () => undefined),
  sendEmailVerification: vi.fn(async () => undefined),
  unenroll: vi.fn(async (_uid: string) => undefined),
}));

vi.mock("@firebase-oss/ui-react", () => ({
  useUI: () => ({ auth: mocks.auth }),
}));
vi.mock("firebase/auth", () => ({
  FactorId: { PHONE: "phone" },
  multiFactor: () => ({
    enrolledFactors: mocks.enrolledFactors,
    unenroll: mocks.unenroll,
  }),
  onAuthStateChanged: (
    auth: typeof mocks.auth,
    callback: (u: unknown) => void,
  ) => {
    callback(auth.currentUser);
    return vi.fn();
  },
  sendEmailVerification: mocks.sendEmailVerification,
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    values ? `${key}:${values.name}` : key,
}));
vi.mock("@/hooks/use-sign-out-button", () => ({
  useSignOutButton: () => ({
    error: null,
    handleSignOut: mocks.handleSignOut,
    pending: false,
  }),
}));
vi.mock("@/lib/firebase/session-client", () => ({
  createServerSession: mocks.createServerSession,
}));
vi.mock(
  "@/components/notes-app/multi-factor-auth-enrollment-card",
  async () => {
    const { Button } = await import("@/components/ui/button");
    return {
      MultiFactorAuthEnrollmentCard: (
        props: PropsWithChildren<{ onEnrollment: () => void }>,
      ) => <Button onClick={props.onEnrollment}>enrollment-card</Button>,
    };
  },
);

import { SecondFactorPanel } from "@/components/notes-app/second-factor-panel";

function signIn(overrides: Partial<FakeUser> = {}) {
  const user: FakeUser = {
    email: "student@example.test",
    emailVerified: true,
    getIdToken: vi.fn(async () => "fresh-token"),
    reload: vi.fn(async () => undefined),
    ...overrides,
  };
  mocks.auth.currentUser = user;
  return user;
}

describe("SecondFactorPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.currentUser = null;
    mocks.enrolledFactors = [];
  });

  afterEach(cleanup);

  it("asks for a verified e-mail before offering enrollment", async () => {
    signIn({ emailVerified: false });
    render(<SecondFactorPanel />);

    expect(await screen.findByText("emailVerificationRequired")).toBeTruthy();
    expect(screen.queryByText("enrollment-card")).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "sendVerificationEmail" }),
    );
    await waitFor(() => expect(mocks.sendEmailVerification).toHaveBeenCalled());
    expect((await screen.findByRole("status")).textContent).toBe(
      "verificationEmailSent",
    );
  });

  it("explains that an account without e-mail cannot add a second factor", async () => {
    signIn({ email: null, emailVerified: false });
    render(<SecondFactorPanel />);

    expect(
      await screen.findByText("emailRequiredForSecondFactor"),
    ).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("offers enrollment when verified and renews the session after it", async () => {
    const user = signIn();
    render(<SecondFactorPanel />);

    fireEvent.click(await screen.findByText("enrollment-card"));

    await waitFor(() =>
      expect(mocks.createServerSession).toHaveBeenCalledWith("fresh-token"),
    );
    expect(user.getIdToken).toHaveBeenCalledWith(true);
  });

  it("lists the factors Firebase reports and removes one", async () => {
    signIn();
    mocks.enrolledFactors = [
      {
        displayName: "Test phone",
        factorId: "phone",
        phoneNumber: "+*******9876",
        uid: "factor-1",
      },
    ];
    render(<SecondFactorPanel />);

    expect((await screen.findByRole("status")).textContent).toBe("smsEnrolled");
    fireEvent.click(
      screen.getByRole("button", {
        name: "removeSecondFactorNamed:Test phone",
      }),
    );

    await waitFor(() =>
      expect(mocks.unenroll).toHaveBeenCalledWith("factor-1"),
    );
    await waitFor(() =>
      expect(mocks.createServerSession).toHaveBeenCalledWith("fresh-token"),
    );
  });

  it("asks the user to sign in again when removal needs a recent login", async () => {
    signIn();
    mocks.enrolledFactors = [
      {
        displayName: null,
        factorId: "phone",
        phoneNumber: "+*******9876",
        uid: "factor-1",
      },
    ];
    mocks.unenroll.mockRejectedValueOnce({
      code: "auth/requires-recent-login",
    });
    render(<SecondFactorPanel />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "removeSecondFactorNamed:+*******9876",
      }),
    );

    expect((await screen.findByRole("alert")).textContent).toBe(
      "requiresRecentLogin",
    );
    expect(mocks.createServerSession).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "reauthenticate" }));
    expect(mocks.handleSignOut).toHaveBeenCalled();
  });

  it("signs out when Firebase invalidated the session after the change", async () => {
    signIn();
    mocks.enrolledFactors = [
      {
        displayName: "Test phone",
        factorId: "phone",
        phoneNumber: "+*******9876",
        uid: "factor-1",
      },
    ];
    mocks.unenroll.mockImplementationOnce(async () => {
      mocks.auth.currentUser = null;
    });
    render(<SecondFactorPanel />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "removeSecondFactorNamed:Test phone",
      }),
    );

    await waitFor(() => expect(mocks.handleSignOut).toHaveBeenCalled());
    expect(mocks.createServerSession).not.toHaveBeenCalled();
  });
});
