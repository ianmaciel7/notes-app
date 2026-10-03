"use client";

import type { ComponentProps, ReactNode } from "react";
import { QuestionCaseStudyTabs } from "@/components/notes-app/question-case-study-tabs";
import { QuestionChoiceGroup } from "@/components/notes-app/question-choice-group";
import { QuestionDragDropGroup } from "@/components/notes-app/question-drag-drop-group";
import { QuestionFillBlankInput } from "@/components/notes-app/question-fill-blank-input";
import { QuestionHotspotGroup } from "@/components/notes-app/question-hotspot-group";
import { QuestionMatchingGroup } from "@/components/notes-app/question-matching-group";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type {
  QuestionProperties,
  QuestionPropertiesOf,
  SubmittedAnswer,
  TrueFalseValue,
} from "@/types/question";

type QuestionAnswerGroupProps = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  question: QuestionProperties;
  /** The draft while answering and the submitted answer once graded. */
  answer: SubmittedAnswer | null;
  /** True once graded or revealed: marks the key and locks the controls. */
  resolved: boolean;
  onAnswerChange: (answer: SubmittedAnswer) => void;
};

function isTrueFalse(value: string | undefined): value is TrueFalseValue {
  return value === "true" || value === "false";
}

type Context = Pick<
  QuestionAnswerGroupProps,
  "answer" | "resolved" | "onAnswerChange"
>;

function choiceAnswer(
  question: QuestionPropertiesOf<"single-choice" | "true-false">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  const current = answer?.type === question.type ? answer.value : "";
  return (
    <QuestionChoiceGroup
      legend={question.prompt}
      mode="single"
      options={question.options}
      value={current ? [current] : []}
      correctIds={[question.correctAnswer]}
      resolved={resolved}
      onValueChange={([id]) => {
        if (question.type === "true-false" && isTrueFalse(id)) {
          onAnswerChange({ type: "true-false", value: id });
        } else if (question.type === "single-choice" && id) {
          onAnswerChange({ type: "single-choice", value: id });
        }
      }}
    />
  );
}

function multipleChoiceAnswer(
  question: QuestionPropertiesOf<"multiple-choice">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionChoiceGroup
      legend={question.prompt}
      mode="multiple"
      options={question.options}
      value={answer?.type === "multiple-choice" ? answer.value : []}
      correctIds={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function fillBlankAnswer(
  question: QuestionPropertiesOf<"fill-blank">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionFillBlankInput
      value={answer?.type === "fill-blank" ? answer.value : ""}
      acceptedAnswers={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function matchingAnswer(
  question: QuestionPropertiesOf<"matching">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionMatchingGroup
      legend={question.prompt}
      leftItems={question.leftItems}
      rightItems={question.rightItems}
      value={answer?.type === "matching" ? answer.value : {}}
      correctAnswer={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function dragAndDropAnswer(
  question: QuestionPropertiesOf<"drag-and-drop">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionDragDropGroup
      legend={question.prompt}
      items={question.items}
      slots={question.slots}
      value={answer?.type === "drag-and-drop" ? answer.value : {}}
      correctAnswer={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function hotspotAnswer(
  question: QuestionPropertiesOf<"hotspot">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionHotspotGroup
      legend={question.prompt}
      image={question.image}
      areas={question.areas}
      value={answer?.type === "hotspot" ? answer.value : []}
      correctIds={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function caseStudyAnswer(
  question: QuestionPropertiesOf<"case-study">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionCaseStudyTabs
      title={question.title}
      context={question.context}
      sections={question.sections}
      parts={question.parts}
      value={answer?.type === "case-study" ? answer.value : {}}
      correctAnswer={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function answerControl(
  question: QuestionProperties,
  context: Context,
): ReactNode {
  switch (question.type) {
    case "single-choice":
    case "true-false":
      return choiceAnswer(question, context);
    case "multiple-choice":
      return multipleChoiceAnswer(question, context);
    case "fill-blank":
      return fillBlankAnswer(question, context);
    case "matching":
      return matchingAnswer(question, context);
    case "drag-and-drop":
      return dragAndDropAnswer(question, context);
    case "hotspot":
      return hotspotAnswer(question, context);
    case "case-study":
      return caseStudyAnswer(question, context);
  }
}

/** Picks the answering control that fits the question type. */
function QuestionAnswerGroup({
  question,
  answer,
  resolved,
  onAnswerChange,
  className,
  ...props
}: QuestionAnswerGroupProps) {
  return (
    <FieldGroup
      data-slot="question-answer-group"
      data-type={question.type}
      {...props}
      className={cn("min-w-0 gap-4", className)}
    >
      {answerControl(question, { answer, resolved, onAnswerChange })}
    </FieldGroup>
  );
}

export { QuestionAnswerGroup, type QuestionAnswerGroupProps };
