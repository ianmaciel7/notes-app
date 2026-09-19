import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExamAuthoringViewDto } from "@/data/exam-authoring";
import type { QuestionSummaryDto } from "@/data/questions-v2";
import * as examAuthoringActions from "@/lib/actions/exam-authoring-actions";
import { ExamEditor } from "./exam-editor";

vi.mock("@/lib/actions/exam-authoring-actions", () => ({
  saveExamDraftAction: vi.fn(),
  replaceExamQuestionsAction: vi.fn(),
  publishExamAction: vi.fn(),
  archiveExamAction: vi.fn(),
}));

describe("ExamEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const sampleAvailableQuestions: QuestionSummaryDto[] = [
    {
      id: "q-1",
      spaceId: "space-1",
      title: "Question One",
      format: "single-choice",
      lifecycle: "published",
      latestRevisionId: "q-1_rev_2",
      publishedRevisionId: "q-1_rev_2",
      tags: ["tag-1"],
      updatedAt: "2026-09-19T00:00:00.000Z",
    },
    {
      id: "q-2",
      spaceId: "space-1",
      title: "Question Two",
      format: "multiple-choice",
      lifecycle: "published",
      latestRevisionId: "q-2_rev_1",
      publishedRevisionId: "q-2_rev_1",
      tags: ["tag-2"],
      updatedAt: "2026-09-19T00:00:00.000Z",
    },
  ];

  const samplePayload = {
    schemaVersion: 1 as const,
    instructions: "Answer all questions carefully.",
    passingPercentage: 75,
    questions: [
      {
        questionId: "q-1",
        questionRevisionId: "q-1_rev_1", // older revision (q-1 has publishedRevisionId = q-1_rev_2)
        points: 5,
      },
    ],
  };

  const sampleExam: ExamAuthoringViewDto = {
    id: "exam-1",
    spaceId: "space-1",
    ownerId: "user-1",
    title: "AWS Certification Practice",
    lifecycle: "draft",
    latestRevisionId: "exam-1_rev_1",
    draftPayload: samplePayload,
    updatedAt: "2026-09-19T00:00:00.000Z",
  };

  it("renders exam initial title, instructions, passing percentage, and question list", () => {
    render(
      <ExamEditor
        spaceId="space-1"
        exam={sampleExam}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    expect(screen.getByText("AWS Certification Practice")).toBeDefined();
    expect(
      screen.getByDisplayValue("Answer all questions carefully."),
    ).toBeDefined();
    expect(screen.getByDisplayValue("75")).toBeDefined();

    const questionItem = screen.getByTestId("exam-question-item");
    expect(within(questionItem).getByText("Question One")).toBeDefined();
    expect(screen.getByDisplayValue("5")).toBeDefined();
    expect(screen.getByText("draft")).toBeDefined();
  });

  it("warns when a referenced question has a newer published revision and allows explicit upgrade", () => {
    render(
      <ExamEditor
        spaceId="space-1"
        exam={sampleExam}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    // Question One currently references q-1_rev_1, but available has q-1_rev_2
    expect(screen.getByText(/newer revision available/i)).toBeDefined();

    const upgradeBtn = screen.getByRole("button", {
      name: /upgrade.*to latest revision/i,
    });
    expect(upgradeBtn).toBeDefined();

    // Click upgrade
    fireEvent.click(upgradeBtn);

    // Warning should disappear and new revision shown
    expect(screen.queryByText(/newer revision available/i)).toBeNull();

    const questionItem = screen.getByTestId("exam-question-item");
    expect(within(questionItem).getByText("q-1_rev_2")).toBeDefined();
  });

  it("adds a question from the picker and updates points", () => {
    render(
      <ExamEditor
        spaceId="space-1"
        exam={{
          ...sampleExam,
          draftPayload: {
            ...samplePayload,
            questions: [],
          },
        }}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    // Initially 0 questions in exam list
    expect(screen.getByText(/no questions added yet/i)).toBeDefined();

    // Click add on Question Two in QuestionPicker
    const addButton = screen.getByRole("button", {
      name: /add question two/i,
    });
    fireEvent.click(addButton);

    // Question Two should now be in the exam question list
    const questionItem = screen.getByTestId("exam-question-item");
    expect(within(questionItem).getByText("Question Two")).toBeDefined();

    // Update points
    const pointsInput = screen.getByRole("spinbutton", {
      name: /points for question two/i,
    });
    fireEvent.change(pointsInput, { target: { value: "10" } });
    expect(screen.getByDisplayValue("10")).toBeDefined();
  });

  it("reorders questions using accessible up and down buttons", () => {
    const twoQuestionsExam: ExamAuthoringViewDto = {
      ...sampleExam,
      draftPayload: {
        ...samplePayload,
        questions: [
          {
            questionId: "q-1",
            questionRevisionId: "q-1_rev_2",
            points: 5,
          },
          {
            questionId: "q-2",
            questionRevisionId: "q-2_rev_1",
            points: 10,
          },
        ],
      },
    };

    render(
      <ExamEditor
        spaceId="space-1"
        exam={twoQuestionsExam}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    const moveUpButtons = screen.getAllByRole("button", {
      name: /move question \d+ up/i,
    });
    const moveDownButtons = screen.getAllByRole("button", {
      name: /move question \d+ down/i,
    });

    // First question: up is disabled, down is enabled
    expect(moveUpButtons[0].hasAttribute("disabled")).toBe(true);
    expect(moveDownButtons[0].hasAttribute("disabled")).toBe(false);

    // Move first question down
    fireEvent.click(moveDownButtons[0]);

    // Now Question Two is first, Question One is second
    const rows = screen.getAllByTestId("exam-question-item");
    expect(rows[0].textContent).toContain("Question Two");
    expect(rows[1].textContent).toContain("Question One");
  });

  it("removes a question from the exam list", () => {
    render(
      <ExamEditor
        spaceId="space-1"
        exam={sampleExam}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    const questionItem = screen.getByTestId("exam-question-item");
    expect(within(questionItem).getByText("Question One")).toBeDefined();

    const removeBtn = screen.getByRole("button", {
      name: /remove question 1/i,
    });
    fireEvent.click(removeBtn);

    expect(screen.queryByTestId("exam-question-item")).toBeNull();
    expect(screen.getByText(/no questions added yet/i)).toBeDefined();
  });

  it("saves exam draft when Save Draft is clicked", async () => {
    const saveSpy = vi
      .spyOn(examAuthoringActions, "saveExamDraftAction")
      .mockResolvedValue({
        ok: true,
        data: {
          id: "exam-1_rev_2",
          objectId: "exam-1",
          objectType: "exam",
          version: 2,
          publicationState: "draft",
          payload: {
            schemaVersion: 1,
            instructions: "Updated instructions",
            passingPercentage: 80,
            questions: [
              {
                questionId: "q-1",
                questionRevisionId: "q-1_rev_1",
                points: 5,
              },
            ],
          },
          schemaVersion: 1,
          createdBy: "user-1",
          createdAt: "2026-09-19T00:00:00.000Z",
        },
      });

    const replaceQuestionsSpy = vi
      .spyOn(examAuthoringActions, "replaceExamQuestionsAction")
      .mockResolvedValue({
        ok: true,
        data: undefined,
      });

    render(
      <ExamEditor
        spaceId="space-1"
        exam={sampleExam}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    const instructionsInput = screen.getByDisplayValue(
      "Answer all questions carefully.",
    );
    fireEvent.change(instructionsInput, {
      target: { value: "Updated instructions" },
    });

    const passingInput = screen.getByDisplayValue("75");
    fireEvent.change(passingInput, { target: { value: "80" } });

    const saveDraftBtn = screen.getByRole("button", { name: /save draft/i });
    fireEvent.click(saveDraftBtn);

    await waitFor(() => {
      expect(saveSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        examId: "exam-1",
        payload: {
          schemaVersion: 1,
          instructions: "Updated instructions",
          passingPercentage: 80,
          questions: [
            {
              questionId: "q-1",
              questionRevisionId: "q-1_rev_1",
              points: 5,
            },
          ],
        },
      });
      expect(replaceQuestionsSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        examId: "exam-1",
        questionRefs: [
          {
            questionId: "q-1",
            questionRevisionId: "q-1_rev_1",
            points: 5,
          },
        ],
      });
    });

    expect(screen.getByText(/draft saved successfully/i)).toBeDefined();
  });

  it("prevents publishing when questions list is empty", async () => {
    const publishSpy = vi.spyOn(examAuthoringActions, "publishExamAction");

    render(
      <ExamEditor
        spaceId="space-1"
        exam={{
          ...sampleExam,
          draftPayload: {
            ...samplePayload,
            questions: [],
          },
        }}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    const publishBtn = screen.getByRole("button", { name: /publish/i });
    fireEvent.click(publishBtn);

    expect(
      screen.getByText(/exam must have at least one question to publish/i),
    ).toBeDefined();
    expect(publishSpy).not.toHaveBeenCalled();
  });

  it("publishes exam when valid and updates status", async () => {
    vi.spyOn(examAuthoringActions, "saveExamDraftAction").mockResolvedValue({
      ok: true,
      data: {} as never,
    });
    vi.spyOn(
      examAuthoringActions,
      "replaceExamQuestionsAction",
    ).mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const publishSpy = vi
      .spyOn(examAuthoringActions, "publishExamAction")
      .mockResolvedValue({
        ok: true,
        data: {
          id: "exam-1_rev_published",
          objectId: "exam-1",
          objectType: "exam",
          version: 2,
          publicationState: "published",
          payload: samplePayload,
          schemaVersion: 1,
          createdBy: "user-1",
          createdAt: "2026-09-19T00:00:00.000Z",
        },
      });

    render(
      <ExamEditor
        spaceId="space-1"
        exam={sampleExam}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    const publishBtn = screen.getByRole("button", { name: /publish/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(publishSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        examId: "exam-1",
      });
    });

    expect(screen.getByText(/exam published successfully/i)).toBeDefined();
    expect(screen.getByText("published")).toBeDefined();
  });

  it("archives exam when Archive is clicked", async () => {
    const archiveSpy = vi
      .spyOn(examAuthoringActions, "archiveExamAction")
      .mockResolvedValue({
        ok: true,
        data: {
          id: "exam-1",
          spaceId: "space-1",
          ownerId: "user-1",
          type: "exam",
          title: "AWS Certification Practice",
          lifecycle: "archived",
          latestRevisionId: "exam-1_rev_1",
          schemaVersion: 1,
          createdAt: "2026-09-19T00:00:00.000Z",
          updatedAt: "2026-09-19T00:00:00.000Z",
        },
      });

    render(
      <ExamEditor
        spaceId="space-1"
        exam={sampleExam}
        availableQuestions={sampleAvailableQuestions}
      />,
    );

    const archiveBtn = screen.getByRole("button", { name: /archive/i });
    fireEvent.click(archiveBtn);

    await waitFor(() => {
      expect(archiveSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        examId: "exam-1",
      });
    });

    expect(screen.getByText(/exam archived successfully/i)).toBeDefined();
    expect(screen.getByText("archived")).toBeDefined();
  });
});
