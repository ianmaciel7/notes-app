import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/lib/auth-context";
import {
  dropdownFixture,
  makeQuestionObject,
  matrixFixture,
  orderingFixture,
  simulationFixture,
  singleChoiceFixture,
} from "@/lib/exam/question-fixtures";
import type { Card } from "@/types/card";
import { QuestionButtonGroup } from "./question-button-group";
import { QuestionCard } from "./question-card";
import { QuestionCardContent } from "./question-card-content";
import { QuestionCardDescription } from "./question-card-description";
import { QuestionCardFooter } from "./question-card-footer";
import { QuestionCardHeader } from "./question-card-header";
import { QuestionCardTitle } from "./question-card-title";
import { QuestionChoiceFieldSet } from "./question-choice-field-set";
import { QuestionChoiceItem } from "./question-choice-item";
import { QuestionDropdownField } from "./question-dropdown-field";
import { QuestionFillBlankField } from "./question-fill-blank-field";
import { QuestionFillBlankInput } from "./question-fill-blank-input";
import { QuestionImageFigure } from "./question-image-figure";
import { QuestionResultBadge } from "./question-result-badge";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}));

vi.mock("@/lib/firebase/attempts", () => ({
  submitAttempt: vi.fn(),
}));

const dummyCard: Card = {
  id: "c1",
  spaceId: "s1",
  schemaVersion: 4,
  questionId: "q1",
  cardIndex: 0,
  state: 0,
  due: new Date(),
  stability: 0,
  difficulty: 0,
  elapsedDays: 0,
  scheduledDays: 0,
  reps: 0,
  lapses: 0,
  lastReview: null,
  stateVersion: 1,
  updatedAt: new Date(),
};

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthContext
      value={{
        user: null,
        isLoading: false,
        signOutUser: async () => {},
      }}
    >
      {children}
    </AuthContext>
  );
}

describe("question atomic components", () => {
  afterEach(() => {
    cleanup();
  });

  describe("QuestionCardTitle", () => {
    it("renders title content and data-slot", () => {
      render(
        <QuestionCardTitle className="custom-title-class">
          <span>Question 1 of 10</span>
        </QuestionCardTitle>,
      );

      const title = screen
        .getByText("Question 1 of 10")
        .closest('[data-slot="question-card-title"]');
      expect(title).toBeTruthy();
      expect(title?.className).toContain("custom-title-class");
    });
  });

  describe("QuestionImageFigure", () => {
    it("renders fixed ratio container with image and data-slot", () => {
      const { container } = render(
        <QuestionImageFigure
          url="https://example.com/diag.png"
          alt="Architecture diagram"
        />,
      );

      const figure = container.querySelector(
        '[data-slot="question-image-figure"]',
      );
      expect(figure).toBeTruthy();
      const img = screen.getByRole("img", { name: "Architecture diagram" });
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("https://example.com/diag.png");
    });
  });

  describe("QuestionResultBadge", () => {
    it("renders correct state badge with icon and label", () => {
      render(<QuestionResultBadge state="correct" />);
      const badge = screen
        .getByText("correct")
        .closest('[data-slot="question-result-badge"]');
      expect(badge).toBeTruthy();
      expect(badge?.getAttribute("data-state")).toBe("correct");
    });

    it("renders incorrect state badge with destructive variant and label", () => {
      render(<QuestionResultBadge state="incorrect" />);
      const badge = screen
        .getByText("incorrect")
        .closest('[data-slot="question-result-badge"]');
      expect(badge).toBeTruthy();
      expect(badge?.getAttribute("data-state")).toBe("incorrect");
    });
  });

  describe("QuestionCardHeader", () => {
    it("renders card header container with data-slot", () => {
      render(
        <QuestionCardHeader className="custom-header">
          <span>Header Content</span>
        </QuestionCardHeader>,
      );
      const header = screen
        .getByText("Header Content")
        .closest('[data-slot="question-card-header"]');
      expect(header).toBeTruthy();
      expect(header?.className).toContain("custom-header");
    });
  });

  describe("QuestionCardDescription", () => {
    it("renders description text with data-slot", () => {
      render(
        <QuestionCardDescription className="custom-desc">
          Multiple choice hint
        </QuestionCardDescription>,
      );
      const desc = screen
        .getByText("Multiple choice hint")
        .closest('[data-slot="question-card-description"]');
      expect(desc).toBeTruthy();
      expect(desc?.className).toContain("custom-desc");
    });
  });

  describe("QuestionCardContent", () => {
    it("renders card content with data-slot", () => {
      render(
        <QuestionCardContent className="custom-content">
          <span>Body Content</span>
        </QuestionCardContent>,
      );
      const content = screen
        .getByText("Body Content")
        .closest('[data-slot="question-card-content"]');
      expect(content).toBeTruthy();
      expect(content?.className).toContain("custom-content");
    });
  });

  describe("QuestionButtonGroup", () => {
    it("renders action buttons when resolved or unconfirmed", () => {
      const { rerender } = render(
        <QuestionButtonGroup
          needsConfirmation={true}
          canSubmit={true}
          submit={() => {}}
          showAnswer={() => {}}
        />,
      );
      expect(screen.getByText("checkAnswer")).toBeTruthy();
      expect(screen.getByText("showAnswer")).toBeTruthy();

      rerender(<QuestionButtonGroup resolved={true} retry={() => {}} />);
      expect(screen.getByText("tryAgain")).toBeTruthy();
    });
  });

  describe("QuestionCardFooter", () => {
    it("renders footer container with data-slot", () => {
      render(
        <QuestionCardFooter className="custom-footer">
          <span>Footer Actions</span>
        </QuestionCardFooter>,
      );
      const footer = screen
        .getByText("Footer Actions")
        .closest('[data-slot="question-card-footer"]');
      expect(footer).toBeTruthy();
      expect(footer?.className).toContain("custom-footer");
    });
  });

  describe("QuestionChoiceItem", () => {
    it("renders choice item with marker, text and data-slot", () => {
      render(
        <QuestionChoiceItem
          option={{ id: "opt-1", text: "Cloud Storage" }}
          marker="A"
          mode="single"
          inputId="choice-1"
          selected={false}
        />,
      );
      const item = screen
        .getByText("Cloud Storage")
        .closest('[data-slot="question-choice-item"]');
      expect(item).toBeTruthy();
      expect(screen.getByText("A.")).toBeTruthy();
    });

    it("triggers selection when clicking the item container", () => {
      render(
        <QuestionChoiceItem
          option={{ id: "opt-1", text: "Cloud Storage" }}
          marker="A"
          mode="single"
          inputId="choice-1"
          selected={false}
        />,
      );
      const item = screen
        .getByText("Cloud Storage")
        .closest('[data-slot="question-choice-item"]') as HTMLElement;
      expect(item).toBeTruthy();

      const radio = document.getElementById("choice-1") as HTMLElement;
      const clickSpy = vi.spyOn(radio, "click");

      item.click();
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe("QuestionChoiceFieldSet", () => {
    it("renders fieldset with legend and choice items", () => {
      render(
        <QuestionChoiceFieldSet
          legend="Select an option"
          mode="single"
          options={[
            { id: "opt-a", text: "Option A" },
            { id: "opt-b", text: "Option B" },
          ]}
          value={["opt-a"]}
          correctIds={["opt-a"]}
          resolved={false}
          onValueChange={() => {}}
        />,
      );
      expect(
        screen
          .getByText("Select an option")
          .closest('[data-slot="question-choice-field-set"]'),
      ).toBeTruthy();
      expect(screen.getByText("Option A")).toBeTruthy();
      expect(screen.getByText("Option B")).toBeTruthy();
    });
  });

  describe("QuestionFillBlankInput", () => {
    it("renders input control with data-slot and value", () => {
      render(
        <QuestionFillBlankInput
          value="my answer"
          resolved={false}
          onValueChange={() => {}}
        />,
      );
      const input = screen.getByDisplayValue("my answer");
      expect(input.getAttribute("data-slot")).toBe("question-fill-blank-input");
    });
  });

  describe("QuestionFillBlankField (wrapper)", () => {
    it("renders fill blank field with label and input", () => {
      render(
        <QuestionFillBlankField
          value="my answer"
          acceptedAnswers={["correct answer"]}
          resolved={false}
          onValueChange={() => {}}
        />,
      );
      expect(screen.getByText("fillBlankLabel")).toBeTruthy();
      expect(screen.getByDisplayValue("my answer")).toBeTruthy();
    });
  });

  describe("QuestionDropdownField", () => {
    it("renders dropdown field with select and options", () => {
      render(
        <QuestionDropdownField
          dropdown={{
            id: "dd-1",
            label: "Select Region",
            options: [
              { id: "us-central1", text: "Iowa" },
              { id: "europe-west1", text: "Belgium" },
            ],
          }}
          value="us-central1"
          resolved={false}
          onValueChange={() => {}}
        />,
      );
      expect(
        screen
          .getByText("Select Region")
          .closest('[data-slot="question-dropdown-field"]'),
      ).toBeTruthy();
    });
  });

  describe("QuestionCard atomic integration across question patterns", () => {
    it("renders single-choice question card", () => {
      render(
        <Wrapper>
          <QuestionCard
            spaceId="space-1"
            question={makeQuestionObject(singleChoiceFixture, "q-sc")}
            card={dummyCard}
            index={0}
            total={5}
          />
        </Wrapper>,
      );
      expect(
        screen.getAllByText(
          "Which service runs stateless containers without servers?",
        ).length,
      ).toBeGreaterThan(0);
    });

    it("renders dropdown question card", () => {
      render(
        <Wrapper>
          <QuestionCard
            spaceId="space-1"
            question={makeQuestionObject(dropdownFixture, "q-dd")}
            card={dummyCard}
            index={1}
            total={5}
          />
        </Wrapper>,
      );
      expect(screen.getAllByText("dropdownPlaceholder").length).toBeGreaterThan(
        0,
      );
    });

    it("renders ordering question card", () => {
      render(
        <Wrapper>
          <QuestionCard
            spaceId="space-1"
            question={makeQuestionObject(orderingFixture, "q-ord")}
            card={dummyCard}
            index={2}
            total={5}
          />
        </Wrapper>,
      );
      expect(screen.getByText("Commit Code")).toBeTruthy();
    });

    it("renders matrix question card", () => {
      render(
        <Wrapper>
          <QuestionCard
            spaceId="space-1"
            question={makeQuestionObject(matrixFixture, "q-mat")}
            card={dummyCard}
            index={3}
            total={5}
          />
        </Wrapper>,
      );
      expect(
        screen.getByText("Cloud Run can scale to zero instances."),
      ).toBeTruthy();
    });

    it("renders simulation question card", () => {
      render(
        <Wrapper>
          <QuestionCard
            spaceId="space-1"
            question={makeQuestionObject(simulationFixture, "q-sim")}
            card={dummyCard}
            index={4}
            total={5}
          />
        </Wrapper>,
      );
      expect(screen.getByText("simulationTitle")).toBeTruthy();
    });
  });
});
