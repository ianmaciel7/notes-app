"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type {
  AssessmentQuestionState,
  AssessmentSessionState,
} from "@/components/object/assessment/assessment-state";
import { AssessmentToolbar } from "@/components/object/assessment/assessment-toolbar";
import { ContinuousQuestions } from "@/components/object/assessment/continuous-questions";
import { FocusQuestion } from "@/components/object/assessment/focus-question";
import type { QuestionCardProps } from "@/components/object/question/question-card";
import type { AssessmentViewMode } from "@/domain/assessment/preferences";
import type { CorrectAnswer, Question } from "@/domain/catalog/question";
import type { QuestionProgress } from "@/domain/learning/progress";
import { saveAssessmentViewModeAction } from "@/lib/actions/assessment-actions";
import {
  recordAttemptAction,
  saveNoteAction,
  toggleBookmarkAction,
} from "@/lib/actions/exam-actions";
import {
  getInitialQuestionId,
  groupQuestionsByDomain,
} from "@/lib/assessment/state";

function createSessionState(
  progress: Record<string, QuestionProgress>,
): AssessmentSessionState {
  return Object.fromEntries(
    Object.entries(progress).map(([questionId, value]) => [
      questionId,
      {
        answer: value.lastSubmittedAnswer ?? undefined,
        checked: value.isCompleted,
        correct: value.isCorrect,
        revealed: value.isCompleted,
        bookmarked: value.bookmarked,
        note: "",
      },
    ]),
  );
}

export function Assessment({
  examId,
  questions,
  domainNames,
  initialMode,
  initialProgress,
  labels,
}: {
  examId: string;
  questions: Question[];
  domainNames: Record<string, string>;
  initialMode: AssessmentViewMode;
  initialProgress: Record<string, QuestionProgress>;
  labels: {
    noQuestions: string;
    view: string;
    continuous: string;
    focus: string;
    question: string;
    of: string;
    answered: string;
    previousQuestion: string;
    nextQuestion: string;
    viewPreferenceError: string;
  };
}) {
  const questionIds = useMemo(
    () => questions.map((question) => question.id),
    [questions],
  );
  const groups = useMemo(
    () => groupQuestionsByDomain(questions, domainNames),
    [domainNames, questions],
  );
  const [mode, setMode] = useState<AssessmentViewMode>(initialMode);
  const [session, setSession] = useState<AssessmentSessionState>(() =>
    createSessionState(initialProgress),
  );
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(() =>
    getInitialQuestionId(questions, initialProgress),
  );
  const [scrollTargetId, setScrollTargetId] = useState<string | null>(null);
  const [modeError, setModeError] = useState<string>();
  const modeRequestId = useRef(0);
  const interactionLockUntil = useRef(0);

  const markActive = useCallback((questionId: string) => {
    interactionLockUntil.current = Date.now() + 1200;
    setActiveQuestionId(questionId);
  }, []);

  const handleVisibleQuestion = useCallback((questionId: string) => {
    if (Date.now() < interactionLockUntil.current) return;
    setActiveQuestionId(questionId);
  }, []);

  const handleModeChange = useCallback(
    (nextMode: AssessmentViewMode) => {
      if (nextMode === mode) return;
      const previousMode = mode;
      const requestId = ++modeRequestId.current;
      if (nextMode === "continuous") setScrollTargetId(activeQuestionId);
      setMode(nextMode);
      setModeError(undefined);

      void saveAssessmentViewModeAction(nextMode).then((result) => {
        if (requestId !== modeRequestId.current) return;
        if (!result.success) {
          setMode(previousMode);
          setModeError(labels.viewPreferenceError);
        }
      });
    },
    [activeQuestionId, labels.viewPreferenceError, mode],
  );

  const updateQuestionState = useCallback(
    (questionId: string, update: Partial<AssessmentQuestionState>) => {
      setSession((current) => {
        const previous = current[questionId] ?? {
          checked: false,
          revealed: false,
          bookmarked: false,
          note: "",
        };
        return {
          ...current,
          [questionId]: { ...previous, ...update },
        };
      });
    },
    [],
  );

  const getCardProps = useCallback(
    (questionId: string): QuestionCardProps => {
      const question = questions.find((item) => item.id === questionId);
      if (!question) throw new Error(`Question ${questionId} not found`);
      const state = session[questionId] ?? {
        checked: false,
        revealed: false,
        bookmarked: false,
        note: "",
      };

      return {
        question,
        initialAnswer: state.answer,
        initialChecked: state.checked,
        initialRevealed: state.revealed,
        isBookmarked: state.bookmarked,
        initialNote: state.note,
        onInteraction: () => markActive(questionId),
        onAnswerChange: (answer) =>
          updateQuestionState(questionId, {
            answer: answer as CorrectAnswer | undefined,
          }),
        onCheckedChange: (checked, correct) =>
          updateQuestionState(questionId, { checked, correct }),
        onRevealedChange: (revealed) =>
          updateQuestionState(questionId, { revealed }),
        onSubmitAnswer: async (answer) => {
          const result = await recordAttemptAction({
            examId,
            questionId,
            submittedAnswer: answer,
          });
          if (!result.success) {
            updateQuestionState(questionId, {
              checked: false,
              revealed: false,
            });
          }
        },
        onToggleBookmark: async () => {
          const next = !state.bookmarked;
          updateQuestionState(questionId, { bookmarked: next });
          const result = await toggleBookmarkAction({
            examId,
            questionId,
            bookmarked: next,
          });
          if (!result.success) {
            updateQuestionState(questionId, { bookmarked: !next });
          }
        },
        onSaveNote: async (content) => {
          const result = await saveNoteAction({ examId, questionId, content });
          if (result.success)
            updateQuestionState(questionId, { note: content });
        },
      };
    },
    [examId, markActive, questions, session, updateQuestionState],
  );

  if (questions.length === 0 || !activeQuestionId) {
    return (
      <p className="rounded-xl border bg-background p-8 text-center text-muted-foreground">
        {labels.noQuestions}
      </p>
    );
  }

  const answeredCount = Object.values(session).filter(
    (value) => value.checked,
  ).length;

  return (
    <div className="space-y-6">
      <AssessmentToolbar
        mode={mode}
        onModeChange={handleModeChange}
        error={modeError}
        labels={labels}
      />
      {mode === "continuous" ? (
        <ContinuousQuestions
          groups={groups}
          getCardProps={getCardProps}
          onVisibleQuestion={handleVisibleQuestion}
          activeQuestionId={activeQuestionId}
          scrollToQuestionId={scrollTargetId}
        />
      ) : (
        <FocusQuestion
          questionIds={questionIds}
          activeQuestionId={activeQuestionId}
          getCardProps={getCardProps}
          onActiveQuestionChange={setActiveQuestionId}
          answeredCount={answeredCount}
          labels={labels}
        />
      )}
    </div>
  );
}
