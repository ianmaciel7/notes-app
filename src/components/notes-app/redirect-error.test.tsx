import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RedirectError } from "./redirect-error";

vi.mock("@firebase-oss/ui-react", () => ({
  useRedirectError: vi.fn(),
}));

import { useRedirectError } from "@firebase-oss/ui-react";

describe("RedirectError", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders null when there is no error", () => {
    vi.mocked(useRedirectError).mockReturnValue(undefined);

    const { container } = render(<RedirectError />);
    expect(container.firstChild).toBeNull();
  });

  it("renders error message and forwards className and HTML attributes", () => {
    vi.mocked(useRedirectError).mockReturnValue("Email or password invalid.");

    render(
      <RedirectError
        data-testid="redirect-error-msg"
        className="custom-error-class"
        role="alert"
      />,
    );

    const element = screen.getByTestId("redirect-error-msg");
    expect(element.getAttribute("role")).toBe("alert");
    expect(element.textContent).toBe("Email or password invalid.");
    expect(element.classList.contains("custom-error-class")).toBe(true);
    expect(element.classList.contains("text-destructive")).toBe(true);
  });
});
