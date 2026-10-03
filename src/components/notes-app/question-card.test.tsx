import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import type { User } from "firebase/auth";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/lib/auth-context";
import {
  caseStudyFixture,
  dragAndDropFixture,
  fillBlankFixture,
  hotspotFixture,
  makeQuestionObject,
  matchingFixture,
  multipleChoiceFixture,
  singleChoiceFixture,
  trueFalseFixture,
} from "@/lib/exam/question-fixtures";
import type { Card } from "@/types/card";
import type { QuestionProperties } from "@/types/question";
import { QuestionCard } from "./question-card";

const mockSubmitAttempt = vi.fn();

vi.mock("@/lib/firebase/attempts", () => ({
  submitAttempt: (...args: unknown[]) => mockSubmitAttempt(...args),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}));

const now = new Date("2026-10-03T12:00:00Z");
const card: Card = {
  id: "c1",
  spaceId: "s1",
  schemaVersion: 4,
  questionId: "q1",
  cardIndex: 0,
  state: 0,
  due: now,
  stability: 0,
  difficulty: 0,
  elapsedDays: 0,
  scheduledDays: 0,
  reps: 0,
  lapses: 0,
  lastReview: null,
  stateVersion: 1,
  updatedAt: now,
};

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthContext
      value={{
        user: { uid: "u1" } as User,
        isLoading: false,
        signOutUser: async () => {},
      }}
    >
      {children}
    </AuthContext>
  );
}

function renderCard(properties: QuestionProperties = singleChoiceFixture) {
  return render(
    <QuestionCard
      spaceId="s1"
      question={makeQuestionObject(properties)}
      card={card}
      index={0}
      total={5}
    />,
    { wrapper: Wrapper },
  );
}

function cardStatus(container: HTMLElement) {
  return container
    .querySelector('[data-slot="question-card"]')
    ?.getAttribute("data-status");
}

async function click(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element);
  });
}

function submittedAnswer() {
  return mockSubmitAttempt.mock.calls.at(-1)?.[0].input.submittedAnswer;
}

describe("QuestionCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitAttempt.mockResolvedValue("attempt-1");
  });
  afterEach(cleanup);

  describe("single-choice", () => {
    it("renders radio buttons, the prompt and the show-answer action", () => {
      renderCard();
      expect(screen.getByText(/questionIndex/)).toBeTruthy();
      expect(
        screen.getAllByText(singleChoiceFixture.prompt).length,
      ).toBeGreaterThan(0);
      expect(screen.getAllByRole("radio")).toHaveLength(3);
      expect(screen.getByText("A.")).toBeTruthy();
      expect(screen.getByText("showAnswer")).toBeTruthy();
      expect(screen.queryByText("checkAnswer")).toBeNull();
    });

    it("gives the group an accessible name from the prompt", () => {
      renderCard();
      expect(
        screen.getByRole("group", { name: singleChoiceFixture.prompt }),
      ).toBeTruthy();
    });

    it("marks a correct click with a text badge and logs the attempt", async () => {
      const { container } = renderCard();

      await click(screen.getByRole("radio", { name: /Cloud Run/ }));

      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(screen.getAllByText("correct").length).toBeGreaterThan(0);
      expect(screen.queryByText("showAnswer")).toBeNull();
      expect(mockSubmitAttempt).toHaveBeenCalledTimes(1);
      expect(submittedAnswer()).toEqual({ type: "single-choice", value: "b" });
    });

    it("flags the wrong pick and surfaces the key and option explanation", async () => {
      renderCard();

      await click(screen.getByRole("radio", { name: /Compute Engine/ }));

      expect(screen.getAllByText("incorrect").length).toBeGreaterThan(0);
      expect(screen.getAllByText("correct").length).toBeGreaterThan(0);
      expect(screen.getByText("You manage the VMs.")).toBeTruthy();
    });

    it("keeps the submitted answer visible and lets the learner try again", async () => {
      const { container } = renderCard();

      await click(screen.getByRole("radio", { name: /Compute Engine/ }));
      expect(
        screen
          .getByRole("radio", { name: /Compute Engine/ })
          .getAttribute("aria-checked"),
      ).toBe("true");

      await click(screen.getByText("tryAgain"));
      expect(cardStatus(container)).toBe("unanswered");

      await click(screen.getByRole("radio", { name: /Cloud Run/ }));
      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(mockSubmitAttempt).toHaveBeenCalledTimes(2);
    });

    it("expands the explanation with safe reference links after answering", async () => {
      renderCard();
      expect(screen.queryByText("Cloud Run is serverless.")).toBeNull();

      await click(screen.getByRole("radio", { name: /Cloud Run/ }));

      expect(screen.getByText("Cloud Run is serverless.")).toBeTruthy();
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toBe(
        "https://cloud.google.com/run/docs",
      );
      expect(link.getAttribute("rel")).toContain("noopener");
    });

    it("omits the references list when the explanation has no URLs", async () => {
      renderCard({
        ...singleChoiceFixture,
        explanation: {
          text: "Because.",
          referenceUrls: [],
          answerProvenance: "ai",
        },
      });
      await click(screen.getByRole("radio", { name: /Cloud Run/ }));
      expect(screen.getByText("Because.")).toBeTruthy();
      expect(screen.queryByText("references")).toBeNull();
    });

    it("reveals the key without logging when show answer is used", async () => {
      const { container } = renderCard();
      await click(screen.getByText("showAnswer"));
      expect(cardStatus(container)).toBe("revealed");
      expect(screen.getAllByText("correct").length).toBeGreaterThan(0);
      expect(mockSubmitAttempt).not.toHaveBeenCalled();
    });

    it("shows a save error when persisting fails", async () => {
      mockSubmitAttempt.mockRejectedValue(new Error("offline"));
      renderCard();
      await click(screen.getByRole("radio", { name: /Cloud Run/ }));
      expect((await screen.findByRole("alert")).textContent).toBe("saveFailed");
    });

    it("renders prompt and option images with alternative text", () => {
      renderCard({
        ...singleChoiceFixture,
        promptImage: {
          url: "https://example.com/p.png",
          alt: "Prompt diagram",
        },
        options: [
          {
            id: "a",
            text: "With picture",
            imageUrl: "https://example.com/o.png",
            imageAlt: "Option picture",
          },
          { id: "b", text: "Plain" },
        ],
        correctAnswer: "a",
      });
      expect(screen.getByAltText("Prompt diagram")).toBeTruthy();
      expect(screen.getByAltText("Option picture")).toBeTruthy();
    });
  });

  describe("true-false", () => {
    it("uses radio buttons and grades on selection", async () => {
      const { container } = renderCard(trueFalseFixture);
      expect(screen.getAllByRole("radio")).toHaveLength(2);

      await click(screen.getByRole("radio", { name: /False/ }));

      expect(cardStatus(container)).toBe("answeredIncorrect");
      expect(submittedAnswer()).toEqual({ type: "true-false", value: "false" });
    });
  });

  describe("multiple-choice", () => {
    it("uses checkboxes, shows the hint, and grades only on confirmation", async () => {
      const { container } = renderCard(multipleChoiceFixture);
      expect(screen.getByText("multipleHint")).toBeTruthy();
      expect(screen.getAllByRole("checkbox")).toHaveLength(3);
      const check = screen.getByText("checkAnswer").closest("button");
      expect(check?.hasAttribute("disabled")).toBe(true);

      await click(screen.getByText("Cloud Run"));
      await click(screen.getByText("Cloud Functions"));
      expect(cardStatus(container)).toBe("unanswered");
      expect(mockSubmitAttempt).not.toHaveBeenCalled();

      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(submittedAnswer()).toEqual({
        type: "multiple-choice",
        value: ["a", "c"],
      });
    });

    it("rejects a partial selection and marks the missed key option", async () => {
      const { container } = renderCard(multipleChoiceFixture);

      await click(screen.getByText("Cloud Run"));
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredIncorrect");
      expect(screen.getAllByText("correct").length).toBeGreaterThan(1);
    });

    it("lets a checkbox be unselected before confirming", async () => {
      renderCard(multipleChoiceFixture);
      const run = screen.getByRole("checkbox", { name: /Cloud Run/ });

      await click(screen.getByText("Cloud Run"));
      expect(run.getAttribute("aria-checked")).toBe("true");
      await click(screen.getByText("Cloud Run"));
      expect(run.getAttribute("aria-checked")).toBe("false");
    });
  });

  describe("fill-blank", () => {
    it("renders a text input, normalizes the answer, and grades on confirmation", async () => {
      const { container } = renderCard(fillBlankFixture);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "  CLOUD   run " } });
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(submittedAnswer()).toEqual({
        type: "fill-blank",
        value: "  CLOUD   run ",
      });
    });

    it("shows the accepted answers after a wrong answer", async () => {
      const { container } = renderCard(fillBlankFixture);

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Functions" },
      });
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredIncorrect");
      expect(screen.getByText(/acceptedAnswers.*Run, Cloud Run/)).toBeTruthy();
      expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
        "true",
      );
    });

    it("keeps confirmation disabled until something is typed", () => {
      renderCard(fillBlankFixture);
      expect(
        screen
          .getByText("checkAnswer")
          .closest("button")
          ?.hasAttribute("disabled"),
      ).toBe(true);
    });
  });

  describe("matching", () => {
    function pick(label: string, rightId: string) {
      fireEvent.change(screen.getByLabelText(new RegExp(label)), {
        target: { value: rightId },
      });
    }

    it("renders one select per item and requires all pairs", async () => {
      const { container } = renderCard(matchingFixture);
      expect(screen.getAllByRole("combobox")).toHaveLength(2);

      pick("Cloud Run", "r1");
      expect(
        screen
          .getByText("checkAnswer")
          .closest("button")
          ?.hasAttribute("disabled"),
      ).toBe(true);

      pick("Cloud SQL", "r2");
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(submittedAnswer()).toEqual({
        type: "matching",
        value: { l1: "r1", l2: "r2" },
      });
    });

    it("marks each wrong pair and reveals the correct match", async () => {
      const { container } = renderCard(matchingFixture);

      pick("Cloud Run", "r1");
      pick("Cloud SQL", "r3");
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredIncorrect");
      expect(screen.getAllByText("incorrect").length).toBeGreaterThan(0);
      expect(screen.getByText(/correctMatch.*Database/)).toBeTruthy();
    });
  });

  describe("drag-and-drop", () => {
    it("offers draggable items and a keyboard-accessible select per slot", async () => {
      const { container } = renderCard(dragAndDropFixture);
      expect(screen.getByText("dragPool")).toBeTruthy();
      expect(screen.getAllByRole("combobox")).toHaveLength(2);

      fireEvent.change(screen.getByLabelText(/dragSlotSelectLabel.*First/), {
        target: { value: "i1" },
      });
      fireEvent.change(screen.getByLabelText(/dragSlotSelectLabel.*Second/), {
        target: { value: "i2" },
      });
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(submittedAnswer()).toEqual({
        type: "drag-and-drop",
        value: { s1: "i1", s2: "i2" },
      });
    });

    it("moves an item between slots so it sits in one place only", async () => {
      renderCard(dragAndDropFixture);
      const first = screen.getByLabelText(/dragSlotSelectLabel.*First/);
      const second = screen.getByLabelText(/dragSlotSelectLabel.*Second/);

      fireEvent.change(first, { target: { value: "i1" } });
      fireEvent.change(second, { target: { value: "i1" } });

      expect((first as HTMLSelectElement).value).toBe("");
      expect((second as HTMLSelectElement).value).toBe("i1");
    });

    it("marks a wrong slot and names the correct item", async () => {
      const { container } = renderCard(dragAndDropFixture);

      fireEvent.change(screen.getByLabelText(/dragSlotSelectLabel.*First/), {
        target: { value: "i3" },
      });
      fireEvent.change(screen.getByLabelText(/dragSlotSelectLabel.*Second/), {
        target: { value: "i2" },
      });
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredIncorrect");
      expect(screen.getByText(/correctSlotItem.*Edge/)).toBeTruthy();
    });
  });

  describe("hotspot", () => {
    it("renders the image with pressable areas named by their labels", async () => {
      const { container } = renderCard(hotspotFixture);
      expect(screen.getByAltText("Architecture diagram")).toBeTruthy();
      const area = screen.getByRole("button", { name: "Load balancer" });
      expect(area.getAttribute("aria-pressed")).toBe("false");

      await click(area);
      expect(area.getAttribute("aria-pressed")).toBe("true");

      await click(screen.getByText("checkAnswer"));
      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(submittedAnswer()).toEqual({ type: "hotspot", value: ["lb"] });
    });

    it("shows visual and textual feedback for right, wrong, and missed areas", async () => {
      renderCard({ ...hotspotFixture, correctAnswer: ["lb", "db"] });

      await click(screen.getByRole("button", { name: "Database" }));
      await click(screen.getByText("checkAnswer"));

      const feedback = screen.getAllByRole("listitem");
      expect(within(feedback[0]).getByText("hotspotAreaMissed")).toBeTruthy();
      expect(within(feedback[1]).getByText("correct")).toBeTruthy();
      expect(
        screen
          .getByRole("button", { name: "Database" })
          .getAttribute("data-result"),
      ).toBe("correct");
    });

    it("flags a wrong area and cannot be changed after grading", async () => {
      renderCard(hotspotFixture);

      await click(screen.getByRole("button", { name: "Database" }));
      await click(screen.getByText("checkAnswer"));
      expect(screen.getAllByText("incorrect").length).toBeGreaterThan(0);

      await click(screen.getByRole("button", { name: "Load balancer" }));
      expect(
        screen
          .getByRole("button", { name: "Load balancer" })
          .getAttribute("aria-pressed"),
      ).toBe("false");
    });
  });

  describe("case-study", () => {
    it("renders the title, context, tabs, and the questions", () => {
      renderCard(caseStudyFixture);
      expect(
        screen.getByRole("heading", { name: "Acme migration" }),
      ).toBeTruthy();
      expect(
        screen.getByText("Acme runs a monolith on-premises."),
      ).toBeTruthy();
      const tabs = screen.getAllByRole("tab");
      expect(tabs.map((tab) => tab.textContent)).toEqual(["Overview", "Goals"]);
      expect(screen.getByText("Acme sells widgets.")).toBeTruthy();
    });

    it("switches the visible section from the tabs", async () => {
      renderCard(caseStudyFixture);
      await click(screen.getByRole("tab", { name: "Goals" }));
      expect(screen.getByText("Reduce operational cost.")).toBeTruthy();
    });

    it("grades the structured answer and keeps part explanations", async () => {
      const { container } = renderCard({
        ...caseStudyFixture,
        parts: [
          { ...caseStudyFixture.parts[0], explanation: "Fewer servers." },
          caseStudyFixture.parts[1],
        ],
      });

      await click(screen.getByRole("radio", { name: /Serverless/ }));
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Pay per use" },
      });
      await click(screen.getByText("checkAnswer"));

      expect(cardStatus(container)).toBe("answeredCorrect");
      expect(submittedAnswer()).toEqual({
        type: "case-study",
        value: { p1: "a", p2: "Pay per use" },
      });
      expect(screen.getByText("Fewer servers.")).toBeTruthy();
    });

    it("needs every part answered", async () => {
      renderCard(caseStudyFixture);
      await click(screen.getByRole("radio", { name: /Serverless/ }));
      expect(
        screen
          .getByText("checkAnswer")
          .closest("button")
          ?.hasAttribute("disabled"),
      ).toBe(true);
    });

    it("is reveal-only without parts: no confirm button and a hint", async () => {
      const { container } = renderCard({
        ...caseStudyFixture,
        parts: [],
        correctAnswer: {},
      });
      expect(screen.getByText("revealOnly")).toBeTruthy();
      expect(screen.queryByText("checkAnswer")).toBeNull();

      await click(screen.getByText("showAnswer"));
      expect(cardStatus(container)).toBe("revealed");
      expect(mockSubmitAttempt).not.toHaveBeenCalled();
    });
  });
});
