"use client";

import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import { useState } from "react";
import { QuestionRenderer } from "@/components/object/question/question-renderer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  recordAttemptAction,
  saveNoteAction,
  toggleBookmarkAction,
} from "@/lib/actions/exam-actions";
import type { CorrectAnswer, Question } from "@/types/question";

interface PracticeLabels {
  practice: string;
  nextQuestion: string;
  previousQuestion: string;
  complete: string;
}

export function ExamPractice({
  examId,
  questions,
  labels,
}: {
  examId: string;
  questions: Question[];
  labels: PracticeLabels;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CorrectAnswer>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-8 text-center text-muted-foreground">
        No questions are available for this exam yet.
      </div>
    );
  }

  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-foreground">
          {labels.practice} {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-muted-foreground">
          {answeredCount} / {questions.length} answered
        </span>
      </div>

      <Progress
        value={(answeredCount / questions.length) * 100}
        aria-label="Practice progress"
      />

      <QuestionRenderer
        key={question.id}
        question={question}
        initialAnswer={answers[question.id]}
        isBookmarked={bookmarks[question.id] ?? false}
        onAnswerChange={(answer) => {
          if (answer === undefined) {
            setAnswers((current) => {
              const next = { ...current };
              delete next[question.id];
              return next;
            });
            return;
          }
          setAnswers((current) => ({ ...current, [question.id]: answer }));
        }}
        onSubmitAnswer={async (answer, isCorrect) => {
          await recordAttemptAction({
            examId,
            questionId: question.id,
            submittedAnswer: answer,
            isCorrect,
          });
        }}
        onToggleBookmark={async () => {
          const next = !bookmarks[question.id];
          setBookmarks((current) => ({ ...current, [question.id]: next }));
          await toggleBookmarkAction({
            examId,
            questionId: question.id,
            bookmarked: next,
          });
        }}
        onSaveNote={async (content) => {
          await saveNoteAction({
            examId,
            questionId: question.id,
            content,
          });
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isFirst}
          onClick={() => setCurrentIndex((index) => index - 1)}
          className="gap-2"
        >
          <ArrowLeftIcon className="size-4" />
          {labels.previousQuestion}
        </Button>

        <Button
          type="button"
          disabled={isLast}
          onClick={() => setCurrentIndex((index) => index + 1)}
          className="gap-2"
        >
          {isLast ? (
            <>
              <CheckCircle2Icon className="size-4" />
              {labels.complete}
            </>
          ) : (
            <>
              {labels.nextQuestion}
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
