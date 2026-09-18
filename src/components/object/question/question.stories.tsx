import type { Story } from "@ladle/react";
import { useState } from "react";

import { I18nProvider } from "@/components/i18n-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import en from "@/lib/i18n/dictionaries/en.json";

import { type ExamQuestion, ExamQuestionnaire } from "./question";

export default {
  title: "Components / Object / Question",
};

const questions = [
  {
    name: "web-basics-1",
    number: 1,
    type: "single-choice",
    statement: "Which HTML element is used to define the main heading?",
    instructions: "Select one answer.",
    options: [
      { value: "a", label: "A", text: "<heading>" },
      { value: "b", label: "B", text: "<h1>" },
      { value: "c", label: "C", text: "<head>" },
      { value: "d", label: "D", text: "<title>" },
    ],
    correctAnswers: ["b"],
    explanation: "The h1 element represents the highest-level heading.",
  },
  {
    name: "web-basics-2",
    number: 2,
    type: "multiple-choice",
    statement: "Which two features improve keyboard accessibility?",
    instructions: "Select two answers.",
    options: [
      { value: "a", label: "A", text: "Visible focus indicators" },
      { value: "b", label: "B", text: "Keyboard-operable controls" },
      { value: "c", label: "C", text: "Removing focus outlines" },
      { value: "d", label: "D", text: "Using placeholder text as labels" },
    ],
    correctAnswers: ["a", "b"],
    explanation:
      "Users need visible focus and controls that can be operated from the keyboard.",
  },
] satisfies ExamQuestion[];

export const Default: Story = () => {
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<
    string,
    string[]
  > | null>(null);

  return (
    <I18nProvider dictionary={en} locale="en">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Web accessibility practice</CardTitle>
          <CardDescription>
            Work through the questions and submit your answers when you are
            ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ExamQuestionnaire
            questions={questions}
            onSubmitAction={setSubmittedAnswers}
          />
          {submittedAnswers ? (
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(submittedAnswers, null, 2)}
            </pre>
          ) : null}
        </CardContent>
      </Card>
    </I18nProvider>
  );
};
