"use client";

import type { ComponentProps, ReactNode } from "react";
import { QuestionCaseStudyTabs } from "@/components/notes-app/question-case-study-tabs";
import { QuestionChoiceFieldSet } from "@/components/notes-app/question-choice-field-set";
import { QuestionDraggableItemGroup } from "@/components/notes-app/question-draggable-item-group";
import { QuestionDropdownFieldSet } from "@/components/notes-app/question-dropdown-field-set";
import { QuestionFillBlankField } from "@/components/notes-app/question-fill-blank-field";
import { QuestionHotspotFigure } from "@/components/notes-app/question-hotspot-figure";
import { QuestionMatchingFieldSet } from "@/components/notes-app/question-matching-field-set";
import { QuestionMatrixTable } from "@/components/notes-app/question-matrix-table";
import { QuestionOrderingItemGroup } from "@/components/notes-app/question-ordering-item-group";
import { QuestionSimulationCard } from "@/components/notes-app/question-simulation-card";
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
    <QuestionChoiceFieldSet
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
    <QuestionChoiceFieldSet
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
    <QuestionFillBlankField
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
    <QuestionMatchingFieldSet
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
    <QuestionDraggableItemGroup
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
    <QuestionHotspotFigure
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

function dropdownAnswer(
  question: QuestionPropertiesOf<"dropdown">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionDropdownFieldSet
      legend={question.prompt}
      dropdowns={question.dropdowns}
      value={answer?.type === "dropdown" ? answer.value : {}}
      correctAnswer={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function matrixAnswer(
  question: QuestionPropertiesOf<"matrix">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionMatrixTable
      legend={question.prompt}
      columns={question.columns}
      rows={question.rows}
      value={answer?.type === "matrix" ? answer.value : {}}
      correctAnswer={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function orderingAnswer(
  question: QuestionPropertiesOf<"ordering">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionOrderingItemGroup
      legend={question.prompt}
      items={question.items}
      value={answer?.type === "ordering" ? answer.value : []}
      correctAnswer={question.correctAnswer}
      resolved={resolved}
      onValueChange={(value) => onAnswerChange({ type: question.type, value })}
    />
  );
}

function simulationAnswer(
  question: QuestionPropertiesOf<"simulation">,
  { answer, resolved, onAnswerChange }: Context,
): ReactNode {
  return (
    <QuestionSimulationCard
      legend={question.prompt}
      scenarioDescription={question.scenarioDescription}
      terminalPrompt={question.terminalPrompt}
      allowedCommands={question.allowedCommands}
      correctAnswer={question.correctAnswer}
      value={answer?.type === "simulation" ? answer.value : []}
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
    case "dropdown":
      return dropdownAnswer(question, context);
    case "matching":
      return matchingAnswer(question, context);
    case "ordering":
      return orderingAnswer(question, context);
    case "drag-and-drop":
      return dragAndDropAnswer(question, context);
    case "hotspot":
      return hotspotAnswer(question, context);
    case "matrix":
      return matrixAnswer(question, context);
    case "simulation":
      return simulationAnswer(question, context);
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
