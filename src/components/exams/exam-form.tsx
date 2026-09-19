"use client";

import {
  AlertTriangleIcon,
  ArchiveIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  SaveIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { QuestionPicker } from "@/components/exams/question-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ExamAuthoringViewDto } from "@/data/exam-authoring";
import type { QuestionSummaryDto } from "@/data/questions-v2";
import type { ExamQuestionReference } from "@/domain/exams/exam";
import type { ObjectLifecycle } from "@/domain/objects/object";
import {
  archiveExamAction,
  publishExamAction,
  replaceExamQuestionsAction,
  saveExamDraftAction,
} from "@/lib/actions/exam-authoring-actions";

export interface ExamFormProps {
  spaceId: string;
  exam: ExamAuthoringViewDto;
  availableQuestions: QuestionSummaryDto[];
  lang?: string;
  onSaved?: () => void;
  onPublished?: (revisionId: string) => void;
  onArchived?: () => void;
}

export function ExamForm({
  spaceId,
  exam,
  availableQuestions,
  onSaved,
  onPublished,
  onArchived,
}: ExamFormProps) {
  const initialPayload = exam.draftPayload ?? exam.publishedPayload;

  const [instructions, setInstructions] = useState(
    initialPayload?.instructions ?? "",
  );
  const [passingPercentage, setPassingPercentage] = useState(
    initialPayload?.passingPercentage ?? 70,
  );
  const [questions, setQuestions] = useState<ExamQuestionReference[]>(
    initialPayload?.questions ?? [],
  );
  const [lifecycle, setLifecycle] = useState<ObjectLifecycle>(exam.lifecycle);
  const [, setPublishedRevisionId] = useState<string | undefined>(
    exam.publishedRevisionId,
  );

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isPending, setIsPending] = useState(false);

  // Map available questions by ID for quick lookup
  const questionMap = useMemo(() => {
    return new Map(availableQuestions.map((q) => [q.id, q]));
  }, [availableQuestions]);

  const handleSelectQuestion = (q: QuestionSummaryDto) => {
    const revisionId = q.publishedRevisionId;
    if (!revisionId) return;
    if (questions.some((item) => item.questionId === q.id)) return;

    setQuestions((prev) => [
      ...prev,
      {
        questionId: q.id,
        questionRevisionId: revisionId,
        points: 1,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    setQuestions((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleUpdatePoints = (index: number, points: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        points: Math.max(1, points),
      };
      return updated;
    });
  };

  const handleUpgradeQuestionRevision = (
    index: number,
    newRevisionId: string,
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        questionRevisionId: newRevisionId,
      };
      return updated;
    });
  };

  const handleSaveDraft = async () => {
    setIsPending(true);
    setStatusMessage(null);

    try {
      const saveRes = await saveExamDraftAction({
        spaceId,
        examId: exam.id,
        payload: {
          schemaVersion: 1,
          instructions,
          passingPercentage,
          questions,
        },
      });

      if (!saveRes.ok) {
        setStatusMessage({
          type: "error",
          text: `Failed to save draft: ${saveRes.error.code}`,
        });
        setIsPending(false);
        return;
      }

      const replaceRes = await replaceExamQuestionsAction({
        spaceId,
        examId: exam.id,
        questionRefs: questions,
      });

      if (!replaceRes.ok) {
        setStatusMessage({
          type: "error",
          text: `Failed to link questions: ${replaceRes.error.code}`,
        });
        setIsPending(false);
        return;
      }

      setStatusMessage({
        type: "success",
        text: "Draft saved successfully.",
      });
      onSaved?.();
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred while saving draft.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handlePublish = async () => {
    setStatusMessage(null);

    if (questions.length === 0) {
      setStatusMessage({
        type: "error",
        text: "Exam must have at least one question to publish.",
      });
      return;
    }

    if (passingPercentage < 0 || passingPercentage > 100) {
      setStatusMessage({
        type: "error",
        text: "Passing percentage must be between 0 and 100.",
      });
      return;
    }

    if (questions.some((q) => q.points <= 0)) {
      setStatusMessage({
        type: "error",
        text: "Each question must have positive points.",
      });
      return;
    }

    setIsPending(true);

    try {
      // First save latest draft state
      const saveRes = await saveExamDraftAction({
        spaceId,
        examId: exam.id,
        payload: {
          schemaVersion: 1,
          instructions,
          passingPercentage,
          questions,
        },
      });

      if (!saveRes.ok) {
        setStatusMessage({
          type: "error",
          text: `Failed to save draft before publishing: ${saveRes.error.code}`,
        });
        setIsPending(false);
        return;
      }

      await replaceExamQuestionsAction({
        spaceId,
        examId: exam.id,
        questionRefs: questions,
      });

      // Now publish
      const publishRes = await publishExamAction({
        spaceId,
        examId: exam.id,
      });

      if (!publishRes.ok) {
        setStatusMessage({
          type: "error",
          text: `Failed to publish exam: ${publishRes.error.code}`,
        });
        setIsPending(false);
        return;
      }

      setLifecycle("published");
      setPublishedRevisionId(publishRes.data.id);
      setStatusMessage({
        type: "success",
        text: "Exam published successfully.",
      });
      onPublished?.(publishRes.data.id);
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred while publishing exam.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleArchive = async () => {
    setIsPending(true);
    setStatusMessage(null);

    try {
      const archiveRes = await archiveExamAction({
        spaceId,
        examId: exam.id,
      });

      if (!archiveRes.ok) {
        setStatusMessage({
          type: "error",
          text: `Failed to archive exam: ${archiveRes.error.code}`,
        });
        setIsPending(false);
        return;
      }

      setLifecycle("archived");
      setStatusMessage({
        type: "success",
        text: "Exam archived successfully.",
      });
      onArchived?.();
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred while archiving exam.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {exam.title}
            </h1>
            <Badge
              variant={
                lifecycle === "published"
                  ? "default"
                  : lifecycle === "archived"
                    ? "destructive"
                    : "secondary"
              }
              className="capitalize"
            >
              {lifecycle}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure exam instructions, passing criteria, and composed
            questions.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isPending || lifecycle === "archived"}
            className="gap-1.5"
          >
            <SaveIcon className="size-3.5" aria-hidden="true" />
            <span>Save Draft</span>
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handlePublish}
            disabled={isPending || lifecycle === "archived"}
            className="gap-1.5"
          >
            <SendIcon className="size-3.5" aria-hidden="true" />
            <span>Publish</span>
          </Button>
          {lifecycle !== "archived" && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleArchive}
              disabled={isPending}
              className="gap-1.5"
            >
              <ArchiveIcon className="size-3.5" aria-hidden="true" />
              <span>Archive</span>
            </Button>
          )}
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <Alert
          variant={statusMessage.type === "error" ? "destructive" : "default"}
        >
          {statusMessage.type === "error" ? (
            <AlertTriangleIcon className="size-4" aria-hidden="true" />
          ) : (
            <CheckCircle2Icon className="size-4" aria-hidden="true" />
          )}
          <AlertTitle>
            {statusMessage.type === "error" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{statusMessage.text}</AlertDescription>
        </Alert>
      )}

      {/* Exam Details Section */}
      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="exam-instructions">Instructions</FieldLabel>
          <Textarea
            id="exam-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter instructions for test takers..."
            disabled={isPending || lifecycle === "archived"}
            rows={3}
          />
          <FieldDescription>
            Instructions will be presented to the candidate before starting the
            exam.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="exam-passing-percentage">
            Passing Percentage (%)
          </FieldLabel>
          <Input
            id="exam-passing-percentage"
            type="number"
            min={0}
            max={100}
            value={passingPercentage}
            onChange={(e) => setPassingPercentage(Number(e.target.value))}
            disabled={isPending || lifecycle === "archived"}
            className="w-32"
          />
          <FieldDescription>
            Minimum percentage score required to pass (0 - 100).
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Total Questions</FieldLabel>
          <div className="text-lg font-semibold text-foreground">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </div>
          <FieldDescription>
            At least 1 question is required to publish this exam.
          </FieldDescription>
        </Field>
      </div>

      {/* Exam Questions Composition */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Questions in Exam
          </h2>
          <span className="text-xs text-muted-foreground">
            Total Points:{" "}
            {questions.reduce((sum, q) => sum + (q.points || 0), 0)}
          </span>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No questions added yet. Pick published questions below to add them
            to this exam.
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((ref, index) => {
              const qSummary = questionMap.get(ref.questionId);
              const questionTitle = qSummary?.title ?? ref.questionId;
              const hasNewerRevision =
                Boolean(qSummary?.publishedRevisionId) &&
                qSummary?.publishedRevisionId !== ref.questionRevisionId;

              return (
                <div
                  key={ref.questionId}
                  data-testid="exam-question-item"
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1 sm:max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {questionTitle}
                      </span>
                      {qSummary?.format && (
                        <Badge
                          variant="secondary"
                          className="capitalize text-xs"
                        >
                          {qSummary.format}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {ref.questionRevisionId}
                      </span>
                    </div>

                    {/* Warning if a newer published revision exists */}
                    {hasNewerRevision && qSummary?.publishedRevisionId && (
                      <div className="mt-1 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                        <AlertTriangleIcon
                          className="size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          Newer revision available (
                          {qSummary.publishedRevisionId})
                        </span>
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            const newRev = qSummary?.publishedRevisionId;
                            if (newRev) {
                              handleUpgradeQuestionRevision(index, newRev);
                            }
                          }}
                          aria-label={`Upgrade ${questionTitle} to latest revision`}
                          disabled={isPending || lifecycle === "archived"}
                        >
                          Upgrade to latest
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Points and Reordering Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <label
                        htmlFor={`points-${ref.questionId}`}
                        className="text-xs text-muted-foreground"
                      >
                        Points:
                      </label>
                      <Input
                        id={`points-${ref.questionId}`}
                        type="number"
                        min={1}
                        className="h-8 w-20 text-sm"
                        value={ref.points}
                        onChange={(e) =>
                          handleUpdatePoints(index, Number(e.target.value))
                        }
                        aria-label={`Points for ${questionTitle}`}
                        disabled={isPending || lifecycle === "archived"}
                      />
                    </div>

                    {/* Reordering buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        disabled={
                          index === 0 || isPending || lifecycle === "archived"
                        }
                        onClick={() => handleMoveQuestion(index, "up")}
                        aria-label={`Move question ${index + 1} up`}
                      >
                        <ChevronUpIcon
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </Button>
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        disabled={
                          index === questions.length - 1 ||
                          isPending ||
                          lifecycle === "archived"
                        }
                        onClick={() => handleMoveQuestion(index, "down")}
                        aria-label={`Move question ${index + 1} down`}
                      >
                        <ChevronDownIcon
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      </Button>
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        disabled={isPending || lifecycle === "archived"}
                        onClick={() => handleRemoveQuestion(index)}
                        aria-label={`Remove question ${index + 1}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2Icon className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Questions Picker */}
      {lifecycle !== "archived" && (
        <QuestionPicker
          questions={availableQuestions}
          onSelectQuestion={handleSelectQuestion}
          selectedQuestionIds={questions.map((q) => q.questionId)}
          disabled={isPending}
        />
      )}
    </div>
  );
}
