import { act, render } from "@testing-library/react";
import { disableNetwork, enableNetwork } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "@/components/ui/toast";
import { BACKEND_UNREACHABLE_EVENT } from "@/lib/error-capture/firebase-logs";
import { BackendStatusToaster } from "./backend-status-toaster";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => `connection.${key}`,
}));
vi.mock("@/components/ui/toast", () => ({
  Toaster: () => null,
  toast: { add: vi.fn(), close: vi.fn() },
}));
vi.mock("firebase/firestore", () => ({
  disableNetwork: vi.fn().mockResolvedValue(undefined),
  enableNetwork: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/firebase/firestore", () => ({ db: { mock: true } }));
vi.mock("@/lib/error-capture/firebase-logs", () => ({
  BACKEND_UNREACHABLE_EVENT: "app:backend-unreachable",
}));

describe("BackendStatusToaster", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a persistent, de-duplicated warning when the backend is unreachable", () => {
    render(<BackendStatusToaster />);

    act(() => {
      window.dispatchEvent(new Event(BACKEND_UNREACHABLE_EVENT));
    });

    expect(toast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "backend-unreachable",
        type: "warning",
        title: "connection.title",
        description: "connection.description",
        timeout: 0,
      }),
    );
  });

  it("reconnects Firestore from the retry action", async () => {
    render(<BackendStatusToaster />);
    act(() => {
      window.dispatchEvent(new Event(BACKEND_UNREACHABLE_EVENT));
    });
    const options = vi.mocked(toast.add).mock.calls[0][0] as {
      actionProps: { onClick: () => void };
    };

    await act(async () => {
      options.actionProps.onClick();
    });

    expect(disableNetwork).toHaveBeenCalled();
    expect(enableNetwork).toHaveBeenCalled();
  });

  it("dismisses the warning when the browser comes back online", () => {
    render(<BackendStatusToaster />);

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(toast.close).toHaveBeenCalledWith("backend-unreachable");
  });
});
