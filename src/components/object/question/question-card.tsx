"use client";

import {
  BookmarkCheckIcon,
  BookmarkIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  LightbulbIcon,
  RotateCcwIcon,
  StickyNoteIcon,
  XCircleIcon,
} from "lucide-react";
import { type PropsWithChildren, useEffect, useState } from "react";
import { CaseStudy } from "@/components/object/question/case-study";
import { DndQuestion } from "@/components/object/question/dnd-question";
import { HotspotQuestion } from "@/components/object/question/hotspot-question";
import { MarkdownPrompt } from "@/components/object/question/markdown-prompt";
import { MultiChoiceQuestion } from "@/components/object/question/multi-choice-question";
import { PersonalNoteCard } from "@/components/object/question/personal-note-card";
import { SingleChoiceQuestion } from "@/components/object/question/single-choice-question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CorrectAnswer,
  Question,
  QuestionType,
} from "@/domain/catalog/question";
import { cn } from "@/lib/utils";

export function evaluateAnswerCorrectness(
  type: QuestionType,
  submitted: CorrectAnswer | undefined,
  correct: CorrectAnswer,
): boolean {
  if (submitted === undefined || submitted === null) return false;

  switch (type) {
    case "single-choice": {
      return String(submitted).trim() === String(correct).trim();
    }
    case "multiple-choice": {
      if (!Array.isArray(submitted) || !Array.isArray(correct)) return false;
      if (submitted.length !== correct.length) return false;
      const subSorted = [...submitted].sort();
      const corSorted = [...correct].sort();
      return subSorted.every((val, idx) => val === corSorted[idx]);
    }
    case "drag-and-drop": {
      if (typeof submitted !== "object" || typeof correct !== "object") {
        return false;
      }
      const corObj = correct as Record<string, string>;
      const subObj = submitted as Record<string, string>;
      const corKeys = Object.keys(corObj);
      if (corKeys.length === 0) return false;
      return corKeys.every((key) => subObj[key] === corObj[key]);
    }
    case "hotspot": {
      if (!Array.isArray(submitted) || !Array.isArray(correct)) {
        return String(submitted) === String(correct);
      }
      if (submitted.length !== correct.length) return false;
      const subSorted = [...submitted].sort();
      const corSorted = [...correct].sort();
      return subSorted.every((val, idx) => val === corSorted[idx]);
    }
    case "case-study": {
      if (Array.isArray(correct)) {
        if (!Array.isArray(submitted)) return false;
        const subSorted = [...submitted].sort();
        const corSorted = [...correct].sort();
        return subSorted.every((val, idx) => val === corSorted[idx]);
      }
      if (typeof correct === "object" && correct !== null) {
        const corObj = correct as Record<string, string>;
        const subObj = (submitted ?? {}) as Record<string, string>;
        return Object.keys(corObj).every((key) => subObj[key] === corObj[key]);
      }
      return String(submitted).trim() === String(correct).trim();
    }
    default:
      return false;
  }
}

export interface QuestionCardProps {
  question: Question;
  initialAnswer?: CorrectAnswer;
  initialChecked?: boolean;
  initialRevealed?: boolean;
  isBookmarked?: boolean;
  onAnswerChange?: (answer: CorrectAnswer) => void;
  onSubmitAnswer?: (
    answer: CorrectAnswer,
    isCorrect: boolean,
  ) => Promise<void> | void;
  onToggleBookmark?: () => Promise<void> | void;
  initialNote?: string;
  onSaveNote?: (content: string) => Promise<void> | void;
  onInteraction?: () => void;
  onCheckedChange?: (checked: boolean, isCorrect: boolean) => void;
  onRevealedChange?: (revealed: boolean) => void;
  mode?: "practice" | "simulation" | "review";
  readOnly?: boolean;
  forceReveal?: boolean;
  className?: string;
}

type QuestionSectionProps = PropsWithChildren<{ className?: string }>;

export function QuestionHeader({ children, className }: QuestionSectionProps) {
  return (
    <CardHeader
      data-slot="question-header"
      className={cn("border-b border-border/60 pb-3", className)}
    >
      {children}
    </CardHeader>
  );
}

export function QuestionStem({ children, className }: QuestionSectionProps) {
  return (
    <div data-slot="question-stem" className={cn(className)}>
      {children}
    </div>
  );
}

export function QuestionChoices({ children, className }: QuestionSectionProps) {
  return (
    <div data-slot="question-choices" className={cn(className)}>
      {children}
    </div>
  );
}

export function QuestionActions({ children, className }: QuestionSectionProps) {
  return (
    <div data-slot="question-actions" className={cn(className)}>
      {children}
    </div>
  );
}

export function QuestionFeedback({
  children,
  className,
}: QuestionSectionProps) {
  return (
    <div data-slot="question-feedback" className={cn(className)}>
      {children}
    </div>
  );
}

export function QuestionCard({
  question,
  initialAnswer,
  initialChecked = false,
  initialRevealed = false,
  isBookmarked = false,
  onAnswerChange,
  onSubmitAnswer,
  onToggleBookmark,
  initialNote = "",
  onSaveNote,
  onInteraction,
  onCheckedChange,
  onRevealedChange,
  mode = "practice",
  readOnly = false,
  forceReveal = false,
  className,
}: QuestionCardProps) {
  const [currentAnswer, setCurrentAnswer] = useState<CorrectAnswer | undefined>(
    initialAnswer,
  );
  const [isChecked, setIsChecked] = useState(initialChecked || forceReveal);
  const [isRevealed, setIsRevealed] = useState(initialRevealed || forceReveal);
  const [showNoteCard, setShowNoteCard] = useState(false);
  const [bookmarkedState, setBookmarkedState] = useState(isBookmarked);

  useEffect(() => {
    setCurrentAnswer(initialAnswer);
    setIsChecked(initialChecked || forceReveal);
    setIsRevealed(initialRevealed || forceReveal);
  }, [initialAnswer, initialChecked, initialRevealed, forceReveal]);

  useEffect(() => {
    setBookmarkedState(isBookmarked);
  }, [isBookmarked]);

  const handleSelectAnswer = (ans: CorrectAnswer) => {
    if (readOnly || isRevealed) return;
    setCurrentAnswer(ans);
    onAnswerChange?.(ans);
    onInteraction?.();
  };

  const handleCheckAnswer = async () => {
    if (!currentAnswer) return;
    const isCorrect = evaluateAnswerCorrectness(
      question.type,
      currentAnswer,
      question.correctAnswer,
    );
    setIsChecked(true);
    setIsRevealed(true);
    onInteraction?.();
    onCheckedChange?.(true, isCorrect);
    onRevealedChange?.(true);
    await onSubmitAnswer?.(currentAnswer, isCorrect);
  };

  const handleToggleReveal = () => {
    setIsRevealed((prev) => {
      const next = !prev;
      onInteraction?.();
      onRevealedChange?.(next);
      return next;
    });
  };

  const handleResetAnswer = () => {
    if (readOnly) return;
    setCurrentAnswer(undefined);
    setIsChecked(false);
    setIsRevealed(false);
    onCheckedChange?.(false, false);
    onRevealedChange?.(false);
    onInteraction?.();
    onAnswerChange?.(undefined as unknown as CorrectAnswer);
  };

  const handleBookmarkClick = async () => {
    setBookmarkedState((prev) => !prev);
    onInteraction?.();
    await onToggleBookmark?.();
  };

  const isAnswerCorrect =
    currentAnswer !== undefined
      ? evaluateAnswerCorrectness(
          question.type,
          currentAnswer,
          question.correctAnswer,
        )
      : false;

  const hasAnswerSelected =
    currentAnswer !== undefined &&
    currentAnswer !== null &&
    (Array.isArray(currentAnswer)
      ? currentAnswer.length > 0
      : typeof currentAnswer === "object"
        ? Object.keys(currentAnswer).length > 0
        : String(currentAnswer).trim().length > 0);

  // Render the specific question core
  const renderQuestionBody = () => {
    const isEffectiveRevealed = isRevealed || forceReveal;

    switch (question.type) {
      case "single-choice":
        return (
          <SingleChoiceQuestion
            options={question.options ?? []}
            selectedAnswer={currentAnswer as string | undefined}
            onSelectAnswer={handleSelectAnswer}
            isRevealed={isEffectiveRevealed}
            correctAnswer={question.correctAnswer as string}
            disabled={readOnly}
          />
        );

      case "multiple-choice":
        return (
          <MultiChoiceQuestion
            options={question.options ?? []}
            selectedAnswer={(currentAnswer as string[]) ?? []}
            onSelectAnswer={handleSelectAnswer}
            isRevealed={isEffectiveRevealed}
            correctAnswer={(question.correctAnswer as string[]) ?? []}
            disabled={readOnly}
          />
        );

      case "drag-and-drop":
        return (
          <DndQuestion
            slots={question.dragDropSlots ?? []}
            items={question.dragDropItems ?? []}
            selectedAnswer={(currentAnswer as Record<string, string>) ?? {}}
            onSelectAnswer={handleSelectAnswer}
            isRevealed={isEffectiveRevealed}
            correctAnswer={
              (question.correctAnswer as Record<string, string>) ?? {}
            }
            disabled={readOnly}
          />
        );

      case "hotspot":
        return (
          <HotspotQuestion
            imageUrl={question.hotspotImage}
            areas={question.hotspotAreas ?? []}
            selectedAnswer={(currentAnswer as string[]) ?? []}
            onSelectAnswer={handleSelectAnswer}
            isRevealed={isEffectiveRevealed}
            correctAnswer={
              Array.isArray(question.correctAnswer)
                ? question.correctAnswer
                : [question.correctAnswer as string]
            }
            disabled={readOnly}
          />
        );

      case "case-study":
        // In a case study question, the interactive part is typically options (single or multiple choice)
        return Array.isArray(question.correctAnswer) ? (
          <MultiChoiceQuestion
            options={question.options ?? []}
            selectedAnswer={(currentAnswer as string[]) ?? []}
            onSelectAnswer={handleSelectAnswer}
            isRevealed={isEffectiveRevealed}
            correctAnswer={question.correctAnswer as string[]}
            disabled={readOnly}
          />
        ) : (
          <SingleChoiceQuestion
            options={question.options ?? []}
            selectedAnswer={currentAnswer as string | undefined}
            onSelectAnswer={handleSelectAnswer}
            isRevealed={isEffectiveRevealed}
            correctAnswer={question.correctAnswer as string}
            disabled={readOnly}
          />
        );

      default:
        return null;
    }
  };

  const questionCardContent = (
    <Card className="border-border/80 bg-card shadow-xs">
      {/* Question Header with badges & action toggles */}
      <QuestionHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {question.type.replace(/-/g, " ")}
            </Badge>

            {question.difficulty && (
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  question.difficulty === "easy" &&
                    "border-primary text-primary",
                  question.difficulty === "medium" &&
                    "border-accent text-accent-foreground",
                  question.difficulty === "hard" &&
                    "border-destructive text-destructive",
                )}
              >
                {question.difficulty}
              </Badge>
            )}

            {mode === "practice" && isChecked && (
              <Badge
                className={cn(
                  isAnswerCorrect
                    ? "bg-primary text-primary-foreground"
                    : "bg-destructive text-destructive-foreground",
                )}
              >
                {isAnswerCorrect ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2Icon className="size-3.5" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <XCircleIcon className="size-3.5" /> Incorrect
                  </span>
                )}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark button */}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleBookmarkClick}
              aria-label={
                bookmarkedState ? "Remove bookmark" : "Bookmark question"
              }
              className={cn(
                "cursor-pointer",
                bookmarkedState &&
                  "text-accent-foreground hover:text-foreground",
              )}
            >
              {bookmarkedState ? (
                <BookmarkCheckIcon className="size-4 fill-current text-accent-foreground" />
              ) : (
                <BookmarkIcon className="size-4" />
              )}
            </Button>

            {/* Note toggle */}
            {onSaveNote && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  setShowNoteCard((prev) => !prev);
                  onInteraction?.();
                }}
                aria-label="Toggle study note"
                className={cn(
                  "cursor-pointer",
                  showNoteCard && "bg-muted text-foreground",
                )}
              >
                <StickyNoteIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Prompt */}
        <QuestionStem>
          <CardTitle className="pt-2 font-medium text-base text-foreground leading-relaxed">
            <MarkdownPrompt prompt={question.prompt} />
          </CardTitle>
        </QuestionStem>
      </QuestionHeader>

      <CardContent className="space-y-6 pt-5">
        {/* Render Interactive Options/Hotspot/DnD */}
        <QuestionChoices>{renderQuestionBody()}</QuestionChoices>

        {/* Action Controls for Practice Mode */}
        {mode === "practice" && !readOnly && (
          <QuestionActions className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleCheckAnswer}
                disabled={!hasAnswerSelected}
                className="gap-1.5"
              >
                <CheckCircle2Icon className="size-4" />
                Check Answer
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleToggleReveal}
                className="gap-1.5"
              >
                {isRevealed ? (
                  <>
                    <EyeOffIcon className="size-4" />
                    Hide Solution
                  </>
                ) : (
                  <>
                    <EyeIcon className="size-4" />
                    Reveal Solution
                  </>
                )}
              </Button>
            </div>

            {hasAnswerSelected && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetAnswer}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <RotateCcwIcon className="size-3.5" />
                Reset
              </Button>
            )}
          </QuestionActions>
        )}

        {/* Detailed Explanation Panel */}
        {(isRevealed || forceReveal) && question.explanation && (
          <QuestionFeedback className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground uppercase tracking-wider">
              <LightbulbIcon className="size-4 text-accent-foreground" />
              <span>Explanation &amp; Architecture Insights</span>
            </div>

            <div className="text-sm leading-relaxed text-foreground/90">
              <MarkdownPrompt prompt={question.explanation.general} />
            </div>

            {question.explanation.references &&
              question.explanation.references.length > 0 && (
                <div className="border-t border-border/50 pt-2 text-xs">
                  <span className="font-semibold text-muted-foreground">
                    Official Documentation &amp; References:
                  </span>
                  <ul className="mt-1 space-y-1">
                    {question.explanation.references.map((ref, idx) => (
                      <li key={`ref-${ref.url || idx}`}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          <span>{ref.title}</span>
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </QuestionFeedback>
        )}

        {/* Personal Note Card (Collapsible) */}
        {showNoteCard && onSaveNote && (
          <div className="pt-2">
            <PersonalNoteCard
              questionId={question.id}
              examId={question.examId}
              initialNote={initialNote}
              onSave={onSaveNote}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (question.type === "case-study" && question.caseStudy) {
    return (
      <div className={cn("w-full", className)}>
        <CaseStudy caseStudy={question.caseStudy}>
          {questionCardContent}
        </CaseStudy>
      </div>
    );
  }

  return <div className={cn("w-full", className)}>{questionCardContent}</div>;
}
