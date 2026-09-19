import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ObjectRecord, ObjectRevision } from "@/domain/objects/object";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import * as questionActions from "@/lib/actions/question-actions";
import { QuestionEditor } from "./question-editor";

describe("QuestionEditor", () => {
  const defaultProps = {
    spaceId: "space-1",
    questionId: "q-100",
    initialTitle: "Sample Question",
    initialLifecycle: "draft" as const,
    initialVersion: 1,
    initialPayload: {
      schemaVersion: 1 as const,
      format: "single-choice" as const,
      prompt: "What is 2 + 2?",
      options: [
        { id: "opt-1", text: "3" },
        { id: "opt-2", text: "4" },
      ],
      correctOptionIds: ["opt-2"],
      explanation: "2 + 2 equals 4.",
      authorNotes: "Basic math",
    },
    initialTags: ["math", "arithmetic"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders with initial values, lifecycle badge, and version badge", () => {
    render(<QuestionEditor {...defaultProps} />);

    expect(screen.getByText("Sample Question")).toBeDefined();
    expect(screen.getByTestId("lifecycle-badge").textContent).toBe("Draft");
    expect(screen.getByTestId("version-badge").textContent).toBe("v1");

    expect(screen.getByLabelText("Prompt")).toHaveProperty(
      "value",
      "What is 2 + 2?",
    );
    expect(screen.getByLabelText("Explanation")).toHaveProperty(
      "value",
      "2 + 2 equals 4.",
    );
    expect(screen.getByLabelText("Author Notes")).toHaveProperty(
      "value",
      "Basic math",
    );
    expect(screen.getByLabelText("Option 1")).toHaveProperty("value", "3");
    expect(screen.getByLabelText("Option 2")).toHaveProperty("value", "4");
    expect(screen.getByText("math")).toBeDefined();
    expect(screen.getByText("arithmetic")).toBeDefined();
  });

  it("renders published and archived lifecycle badges correctly", () => {
    const { rerender } = render(
      <QuestionEditor {...defaultProps} initialLifecycle="published" />,
    );
    expect(screen.getByTestId("lifecycle-badge").textContent).toBe("Published");

    rerender(<QuestionEditor {...defaultProps} initialLifecycle="archived" />);
    expect(screen.getByTestId("lifecycle-badge").textContent).toBe("Archived");
  });

  it("allows changing format and sets options for true-false", () => {
    render(<QuestionEditor {...defaultProps} />);

    const formatSelect = screen.getByLabelText("Question format");
    fireEvent.change(formatSelect, { target: { value: "true-false" } });

    expect(screen.getByLabelText("Option 1")).toHaveProperty("value", "True");
    expect(screen.getByLabelText("Option 2")).toHaveProperty("value", "False");
  });

  it("allows adding and removing options for single/multiple choice", () => {
    render(<QuestionEditor {...defaultProps} />);

    const addBtn = screen.getByRole("button", { name: /Add Option/i });
    fireEvent.click(addBtn);

    expect(screen.getByLabelText("Option 3")).toBeDefined();

    const removeBtn = screen.getByRole("button", {
      name: "Remove option 3",
    });
    fireEvent.click(removeBtn);

    expect(screen.queryByLabelText("Option 3")).toBeNull();
  });

  it("supports selecting multiple options in multiple-choice format", () => {
    render(<QuestionEditor {...defaultProps} />);

    const formatSelect = screen.getByLabelText("Question format");
    fireEvent.change(formatSelect, { target: { value: "multiple-choice" } });

    const opt1Check = screen.getByRole("checkbox", {
      name: "Mark option 1 as correct",
    });
    const opt2Check = screen.getByRole("checkbox", {
      name: "Mark option 2 as correct",
    });

    fireEvent.click(opt1Check);
    expect(opt1Check).toBeChecked();
    expect(opt2Check).toBeChecked();
  });

  it("validates empty prompt and empty explanation on save", async () => {
    const saveSpy = vi.spyOn(questionActions, "saveQuestionDraftAction");

    render(
      <QuestionEditor
        {...defaultProps}
        initialPayload={{
          ...defaultProps.initialPayload,
          prompt: "",
          explanation: "",
        }}
      />,
    );

    const saveBtn = screen.getByRole("button", { name: /Save Draft/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByTestId("prompt-error")).toBeDefined();
      expect(screen.getByTestId("explanation-error")).toBeDefined();
    });

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it("validates empty option text", async () => {
    const saveSpy = vi.spyOn(questionActions, "saveQuestionDraftAction");

    render(
      <QuestionEditor
        {...defaultProps}
        initialPayload={{
          ...defaultProps.initialPayload,
          options: [
            { id: "opt-1", text: "" },
            { id: "opt-2", text: "4" },
          ],
        }}
      />,
    );

    const saveBtn = screen.getByRole("button", { name: /Save Draft/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByTestId("options-error")).toBeDefined();
    });

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it("calls saveQuestionDraftAction when valid and updates version/lifecycle", async () => {
    const savedRevision: ObjectRevision<QuestionRevisionPayload> = {
      id: "rev-2",
      objectId: "q-100",
      objectType: "question",
      version: 2,
      publicationState: "draft",
      payload: {
        schemaVersion: 1,
        format: "single-choice",
        prompt: "What is 2 + 2?",
        options: [
          { id: "opt-1", text: "3" },
          { id: "opt-2", text: "4" },
        ],
        correctOptionIds: ["opt-2"],
        explanation: "2 + 2 equals 4.",
      },
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: new Date().toISOString(),
    };

    const saveSpy = vi
      .spyOn(questionActions, "saveQuestionDraftAction")
      .mockResolvedValue({
        ok: true,
        data: savedRevision,
      });

    render(<QuestionEditor {...defaultProps} />);

    const saveBtn = screen.getByRole("button", { name: /Save Draft/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(saveSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        questionId: "q-100",
        payload: {
          schemaVersion: 1,
          format: "single-choice",
          prompt: "What is 2 + 2?",
          options: [
            { id: "opt-1", text: "3" },
            { id: "opt-2", text: "4" },
          ],
          correctOptionIds: ["opt-2"],
          explanation: "2 + 2 equals 4.",
          authorNotes: "Basic math",
        },
      });
      expect(screen.getByTestId("version-badge").textContent).toBe("v2");
    });
  });

  it("displays server field errors when saveQuestionDraftAction fails with fieldErrors", async () => {
    vi.spyOn(questionActions, "saveQuestionDraftAction").mockResolvedValue({
      ok: false,
      error: {
        code: "validation-failed",
        fieldErrors: {
          prompt: ["Prompt is too long."],
        },
      },
    });

    render(<QuestionEditor {...defaultProps} />);

    const saveBtn = screen.getByRole("button", { name: /Save Draft/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText("Prompt is too long.")).toBeDefined();
    });
  });

  it("calls publishQuestionAction and updates lifecycle badge to published", async () => {
    const pubRev: ObjectRevision<unknown> = {
      id: "rev-pub",
      objectId: "q-100",
      objectType: "question",
      version: 3,
      publicationState: "published",
      payload: {},
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: new Date().toISOString(),
    };

    const publishSpy = vi
      .spyOn(questionActions, "publishQuestionAction")
      .mockResolvedValue({
        ok: true,
        data: pubRev,
      });

    render(<QuestionEditor {...defaultProps} />);

    const publishBtn = screen.getByRole("button", { name: /Publish/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(publishSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        questionId: "q-100",
      });
      expect(screen.getByTestId("lifecycle-badge").textContent).toBe(
        "Published",
      );
      expect(screen.getByTestId("version-badge").textContent).toBe("v3");
    });
  });

  it("calls archiveQuestionAction and updates lifecycle badge to archived", async () => {
    const archivedRecord: ObjectRecord = {
      id: "q-100",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "question",
      title: "Sample Question",
      lifecycle: "archived",
      latestRevisionId: "rev-1",
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const archiveSpy = vi
      .spyOn(questionActions, "archiveQuestionAction")
      .mockResolvedValue({
        ok: true,
        data: archivedRecord,
      });

    render(<QuestionEditor {...defaultProps} initialLifecycle="published" />);

    const archiveBtn = screen.getByRole("button", { name: /Archive/i });
    fireEvent.click(archiveBtn);

    await waitFor(() => {
      expect(archiveSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        questionId: "q-100",
      });
      expect(screen.getByTestId("lifecycle-badge").textContent).toBe(
        "Archived",
      );
    });
  });

  it("supports adding and removing tags", async () => {
    const tagSpy = vi
      .spyOn(questionActions, "setQuestionTagsAction")
      .mockResolvedValue({
        ok: true,
        data: undefined,
      });

    render(<QuestionEditor {...defaultProps} />);

    const tagInput = screen.getByRole("textbox", { name: "Add tag" });
    fireEvent.change(tagInput, { target: { value: "algebra" } });

    const addTagBtn = screen.getByRole("button", { name: "Add" });
    fireEvent.click(addTagBtn);

    expect(screen.getByText("algebra")).toBeDefined();
    expect(tagSpy).toHaveBeenCalledWith({
      spaceId: "space-1",
      questionId: "q-100",
      tagIds: ["math", "arithmetic", "algebra"],
    });

    const removeMathBtn = screen.getByRole("button", {
      name: "Remove tag math",
    });
    fireEvent.click(removeMathBtn);

    expect(screen.queryByText("math")).toBeNull();
  });
});
