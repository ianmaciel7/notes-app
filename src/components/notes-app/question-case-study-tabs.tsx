"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionPartItem } from "@/components/notes-app/question-part-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  CaseStudyPart,
  CaseStudyPartAnswer,
  CaseStudySection,
} from "@/types/question";

type QuestionCaseStudyTabsProps = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  title: string;
  context: string;
  sections: CaseStudySection[];
  parts: CaseStudyPart[];
  /** partId -> answer given so far. */
  value: Readonly<Record<string, CaseStudyPartAnswer>>;
  /** partId -> key, used to mark parts once `resolved`. */
  correctAnswer: Readonly<Record<string, CaseStudyPartAnswer>>;
  resolved: boolean;
  onValueChange: (next: Record<string, CaseStudyPartAnswer>) => void;
};

/** Case-study material in tabs, followed by the questions about it. */
function QuestionCaseStudyTabs({
  title,
  context,
  sections,
  parts,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionCaseStudyTabsProps) {
  const t = useTranslations("exam");

  return (
    <section
      data-slot="question-case-study-tabs"
      aria-label={title}
      {...props}
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="whitespace-pre-wrap text-sm text-foreground">{context}</p>
      <Tabs defaultValue={sections[0]?.id}>
        <TabsList
          aria-label={t("caseStudySections")}
          className="h-auto flex-wrap"
        >
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <p className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-foreground">
              {section.content}
            </p>
          </TabsContent>
        ))}
      </Tabs>
      {parts.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-foreground">
            {t("caseStudyQuestions")}
          </h4>
          {parts.map((part, index) => (
            <QuestionPartItem
              key={part.id}
              item={part}
              position={index + 1}
              value={value[part.id]}
              correctAnswer={correctAnswer[part.id]}
              resolved={resolved}
              onValueChange={(next) =>
                onValueChange({ ...value, [part.id]: next })
              }
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export { QuestionCaseStudyTabs, type QuestionCaseStudyTabsProps };
