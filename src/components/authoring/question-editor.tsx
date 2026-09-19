"use client";

import {
  AlertCircleIcon,
  ArchiveIcon,
  CheckIcon,
  PlusIcon,
  SaveIcon,
  SendIcon,
  TagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type {
  ObjectLifecycle,
  ObjectRecord,
  ObjectRevision,
} from "@/domain/objects/object";
import type {
  AnswerOption,
  QuestionFormat,
  QuestionRevisionPayload,
} from "@/domain/questions/question";
import {
  archiveQuestionAction,
  publishQuestionAction,
  saveQuestionDraftAction,
  setQuestionTagsAction,
} from "@/lib/actions/question-actions";

export interface QuestionEditorProps {
  spaceId: string;
  questionId: string;
  initialTitle?: string;
  initialLifecycle?: ObjectLifecycle;
  initialVersion?: number;
  initialPayload?: Partial<QuestionRevisionPayload>;
  initialTags?: string[];
  onSaved?: (revision: ObjectRevision<QuestionRevisionPayload>) => void;
  onPublished?: (revision: ObjectRevision<unknown>) => void;
  onArchived?: (record: ObjectRecord) => void;
}

export function QuestionEditor({
  spaceId,
  questionId,
  initialTitle,
  initialLifecycle = "draft",
  initialVersion = 1,
  initialPayload,
  initialTags = [],
  onSaved,
  onPublished,
  onArchived,
}: QuestionEditorProps) {
  const [lifecycle, setLifecycle] =
    React.useState<ObjectLifecycle>(initialLifecycle);
  const [version, setVersion] = React.useState<number>(initialVersion);

  React.useEffect(() => {
    setLifecycle(initialLifecycle);
  }, [initialLifecycle]);

  React.useEffect(() => {
    setVersion(initialVersion);
  }, [initialVersion]);

  const [format, setFormat] = React.useState<QuestionFormat>(
    initialPayload?.format ?? "single-choice",
  );
  const [prompt, setPrompt] = React.useState<string>(
    initialPayload?.prompt ?? "",
  );
  const [options, setOptions] = React.useState<AnswerOption[]>(() => {
    if (initialPayload?.options && initialPayload.options.length > 0) {
      return initialPayload.options;
    }
    if (initialPayload?.format === "true-false") {
      return [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ];
    }
    return [
      { id: "opt-1", text: "" },
      { id: "opt-2", text: "" },
    ];
  });
  const [correctOptionIds, setCorrectOptionIds] = React.useState<string[]>(
    () => {
      if (initialPayload?.correctOptionIds) {
        return initialPayload.correctOptionIds;
      }
      if (initialPayload?.format === "true-false") {
        return ["true"];
      }
      return ["opt-1"];
    },
  );
  const [explanation, setExplanation] = React.useState<string>(
    initialPayload?.explanation ?? "",
  );
  const [authorNotes, setAuthorNotes] = React.useState<string>(
    initialPayload?.authorNotes ?? "",
  );

  const [tags, setTags] = React.useState<string[]>(initialTags);
  const [tagInput, setTagInput] = React.useState<string>("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFormatChange = (newFormat: QuestionFormat) => {
    setFormat(newFormat);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.format;
      delete next.options;
      delete next.correctOptionIds;
      return next;
    });

    if (newFormat === "true-false") {
      setOptions([
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ]);
      if (
        !correctOptionIds.includes("true") &&
        !correctOptionIds.includes("false")
      ) {
        setCorrectOptionIds(["true"]);
      } else {
        setCorrectOptionIds([
          correctOptionIds[0] === "false" ? "false" : "true",
        ]);
      }
    } else if (newFormat === "single-choice") {
      if (correctOptionIds.length > 1) {
        setCorrectOptionIds([correctOptionIds[0]]);
      } else if (correctOptionIds.length === 0 && options.length > 0) {
        setCorrectOptionIds([options[0].id]);
      }
    }
  };

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    );
    if (errors.options) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.options;
        return next;
      });
    }
  };

  const handleAddOption = () => {
    const newId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setOptions((prev) => [...prev, { id: newId, text: "" }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
    setCorrectOptionIds((prev) => prev.filter((oid) => oid !== id));
  };

  const handleToggleCorrectOption = (id: string) => {
    if (format === "multiple-choice") {
      setCorrectOptionIds((prev) =>
        prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id],
      );
    } else {
      setCorrectOptionIds([id]);
    }
    if (errors.correctOptionIds) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.correctOptionIds;
        return next;
      });
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      const nextTags = [...tags, trimmed];
      setTags(nextTags);
      setTagInput("");
      setQuestionTagsAction({ spaceId, questionId, tagIds: nextTags }).catch(
        () => {},
      );
    } else {
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const nextTags = tags.filter((t) => t !== tagToRemove);
    setTags(nextTags);
    setQuestionTagsAction({ spaceId, questionId, tagIds: nextTags }).catch(
      () => {},
    );
  };

  const validateForm = (): {
    isValid: boolean;
    errors: Record<string, string>;
  } => {
    const newErrors: Record<string, string> = {};

    if (!prompt.trim()) {
      newErrors.prompt = "Prompt is required.";
    }

    if (!explanation.trim()) {
      newErrors.explanation = "Explanation is required.";
    }

    if (format === "true-false") {
      if (
        correctOptionIds.length !== 1 ||
        (correctOptionIds[0] !== "true" && correctOptionIds[0] !== "false")
      ) {
        newErrors.correctOptionIds =
          "Exactly one correct option must be selected.";
      }
    } else {
      if (options.length < 2) {
        newErrors.options = "At least two options are required.";
      } else if (options.some((opt) => !opt.text.trim())) {
        newErrors.options = "All options must have text.";
      }

      if (format === "single-choice") {
        if (correctOptionIds.length !== 1) {
          newErrors.correctOptionIds =
            "Exactly one correct option must be selected.";
        }
      } else if (format === "multiple-choice") {
        if (correctOptionIds.length < 1) {
          newErrors.correctOptionIds =
            "At least one correct option must be selected.";
        }
      }
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleSaveDraft = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload: QuestionRevisionPayload = {
        schemaVersion: 1,
        format,
        prompt: prompt.trim(),
        options: options.map((o) => ({
          id: o.id.trim(),
          text: o.text.trim(),
        })),
        correctOptionIds,
        explanation: explanation.trim(),
        authorNotes: authorNotes.trim() ? authorNotes.trim() : undefined,
      };

      const res = await saveQuestionDraftAction({
        spaceId,
        questionId,
        payload,
      });

      if (res.ok) {
        setVersion(res.data.version);
        setLifecycle("draft");
        setStatusMessage({
          type: "success",
          text: "Draft saved successfully.",
        });
        onSaved?.(res.data);
      } else {
        if (res.error.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(res.error.fieldErrors)) {
            if (msgs && msgs.length > 0) {
              fieldErrors[key] = msgs[0];
            }
          }
          setErrors(fieldErrors);
        }
        setStatusMessage({
          type: "error",
          text: `Failed to save draft: ${res.error.code}`,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save draft.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setErrors({});
    setIsPublishing(true);
    setStatusMessage(null);

    try {
      const res = await publishQuestionAction({
        spaceId,
        questionId,
      });

      if (res.ok) {
        setVersion(res.data.version);
        setLifecycle("published");
        setStatusMessage({
          type: "success",
          text: "Question published successfully.",
        });
        onPublished?.(res.data);
      } else {
        if (res.error.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(res.error.fieldErrors)) {
            if (msgs && msgs.length > 0) {
              fieldErrors[key] = msgs[0];
            }
          }
          setErrors(fieldErrors);
        }
        setStatusMessage({
          type: "error",
          text: `Failed to publish: ${res.error.code}`,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to publish question.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleArchive = async () => {
    setErrors({});
    setIsArchiving(true);
    setStatusMessage(null);

    try {
      const res = await archiveQuestionAction({
        spaceId,
        questionId,
      });

      if (res.ok) {
        setLifecycle("archived");
        setStatusMessage({
          type: "success",
          text: "Question archived successfully.",
        });
        onArchived?.(res.data);
      } else {
        setStatusMessage({
          type: "error",
          text: `Failed to archive: ${res.error.code}`,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to archive question.",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
        <div>
          <CardTitle className="text-xl font-bold">
            {initialTitle || "Question Editor"}
          </CardTitle>
          <CardDescription>
            Configure question prompt, format, options, explanation, and tags.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              lifecycle === "published"
                ? "default"
                : lifecycle === "archived"
                  ? "outline"
                  : "secondary"
            }
            data-testid="lifecycle-badge"
            data-slot="lifecycle-badge"
          >
            {lifecycle.charAt(0).toUpperCase() + lifecycle.slice(1)}
          </Badge>
          <Badge
            variant="outline"
            data-testid="version-badge"
            data-slot="version-badge"
          >
            v{version}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {statusMessage && (
          <output
            className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
              statusMessage.type === "success"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckIcon className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
            )}
            <span>{statusMessage.text}</span>
          </output>
        )}

        {/* Question Format */}
        <div className="space-y-2">
          <Label htmlFor="question-format">Format</Label>
          <NativeSelect
            id="question-format"
            aria-label="Question format"
            value={format}
            onChange={(e) =>
              handleFormatChange(e.target.value as QuestionFormat)
            }
          >
            <NativeSelectOption value="single-choice">
              Single Choice
            </NativeSelectOption>
            <NativeSelectOption value="multiple-choice">
              Multiple Choice
            </NativeSelectOption>
            <NativeSelectOption value="true-false">
              True / False
            </NativeSelectOption>
          </NativeSelect>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <Label htmlFor="question-prompt">Prompt</Label>
          <Textarea
            id="question-prompt"
            name="prompt"
            aria-label="Prompt"
            aria-invalid={!!errors.prompt}
            aria-describedby={errors.prompt ? "prompt-error" : undefined}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (errors.prompt) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.prompt;
                  return next;
                });
              }
            }}
            placeholder="Enter the question prompt..."
            rows={4}
          />
          {errors.prompt && (
            <p
              id="prompt-error"
              data-testid="prompt-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.prompt}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <span className="text-xs text-muted-foreground">
              {format === "multiple-choice"
                ? "Check all options that are correct"
                : "Select the single correct option"}
            </span>
          </div>

          <div className="space-y-2.5">
            {options.map((option, index) => {
              const isChecked = correctOptionIds.includes(option.id);
              return (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type={format === "multiple-choice" ? "checkbox" : "radio"}
                    name="correct-option"
                    aria-label={`Mark option ${index + 1} as correct`}
                    checked={isChecked}
                    onChange={() => handleToggleCorrectOption(option.id)}
                    className="size-4 shrink-0 accent-primary cursor-pointer"
                  />
                  <Input
                    value={option.text}
                    aria-label={`Option ${index + 1}`}
                    placeholder={`Option ${index + 1}`}
                    disabled={format === "true-false"}
                    onChange={(e) =>
                      handleOptionTextChange(option.id, e.target.value)
                    }
                    className="flex-1"
                  />
                  {format !== "true-false" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove option ${index + 1}`}
                      onClick={() => handleRemoveOption(option.id)}
                      disabled={options.length <= 2}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {format !== "true-false" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="gap-1.5"
            >
              <PlusIcon className="size-4" aria-hidden="true" />
              <span>Add Option</span>
            </Button>
          )}

          {errors.options && (
            <p
              id="options-error"
              data-testid="options-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.options}
            </p>
          )}

          {errors.correctOptionIds && (
            <p
              id="correct-options-error"
              data-testid="correct-options-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.correctOptionIds}
            </p>
          )}
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <Label htmlFor="question-explanation">Explanation</Label>
          <Textarea
            id="question-explanation"
            name="explanation"
            aria-label="Explanation"
            aria-invalid={!!errors.explanation}
            aria-describedby={
              errors.explanation ? "explanation-error" : undefined
            }
            value={explanation}
            onChange={(e) => {
              setExplanation(e.target.value);
              if (errors.explanation) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.explanation;
                  return next;
                });
              }
            }}
            placeholder="Explain why the correct answer is right..."
            rows={3}
          />
          {errors.explanation && (
            <p
              id="explanation-error"
              data-testid="explanation-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.explanation}
            </p>
          )}
        </div>

        {/* Author Notes */}
        <div className="space-y-2">
          <Label htmlFor="question-author-notes">
            Author Notes{" "}
            <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="question-author-notes"
            name="authorNotes"
            aria-label="Author Notes"
            value={authorNotes}
            onChange={(e) => setAuthorNotes(e.target.value)}
            placeholder="Private notes for authoring reference..."
            rows={2}
          />
          {errors.authorNotes && (
            <p
              id="authorNotes-error"
              data-testid="authorNotes-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.authorNotes}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="question-tags">Tags</Label>
          <div className="flex flex-wrap items-center gap-1.5 min-h-8">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1 pr-1 text-xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => handleRemoveTag(tag)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <XIcon className="size-3" aria-hidden="true" />
                </button>
              </Badge>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-muted-foreground">No tags</span>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Input
              id="question-tags"
              placeholder="Add tag..."
              value={tagInput}
              aria-label="Add tag"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="max-w-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              className="gap-1"
            >
              <TagIcon className="size-3.5" aria-hidden="true" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing || isArchiving}
            className="gap-1.5"
          >
            <SaveIcon className="size-4" aria-hidden="true" />
            <span>Save Draft</span>
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handlePublish}
            disabled={isSaving || isPublishing || isArchiving}
            className="gap-1.5"
          >
            <SendIcon className="size-4" aria-hidden="true" />
            <span>Publish</span>
          </Button>
        </div>

        <Button
          type="button"
          variant="destructive"
          onClick={handleArchive}
          disabled={
            isSaving || isPublishing || isArchiving || lifecycle === "archived"
          }
          className="gap-1.5"
        >
          <ArchiveIcon className="size-4" aria-hidden="true" />
          <span>Archive</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
