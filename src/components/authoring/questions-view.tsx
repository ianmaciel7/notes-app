"use client";

import { FilterIcon, HelpCircleIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { QuestionSummaryDto } from "@/data/questions-v2";
import type { ObjectLifecycle } from "@/domain/objects/object";

export interface QuestionsViewProps {
  spaceId: string;
  lang: string;
  initialQuestions: QuestionSummaryDto[];
}

export function QuestionsView({
  spaceId,
  lang,
  initialQuestions,
}: QuestionsViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [lifecycleFilter, setLifecycleFilter] = React.useState<
    "all" | ObjectLifecycle
  >("all");

  const filteredQuestions = React.useMemo(() => {
    return initialQuestions.filter((q) => {
      if (lifecycleFilter !== "all" && q.lifecycle !== lifecycleFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesFormat = q.format.toLowerCase().includes(query);
        const matchesTag = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesFormat && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [initialQuestions, lifecycleFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Create, manage, and publish questions for exams and study.
          </p>
        </div>
        <Link
          href={`/${lang}/spaces/${spaceId}/questions/new`}
          className={buttonVariants({
            variant: "default",
            className: "gap-1.5 w-fit",
          })}
        >
          <PlusIcon className="size-4" aria-hidden="true" />
          <span>New Question</span>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            aria-label="Search questions"
          />
        </div>

        <fieldset
          className="m-0 flex items-center gap-1.5 overflow-x-auto border-none p-0 pb-1 sm:pb-0"
          aria-label="Filter by lifecycle"
        >
          <FilterIcon
            className="mr-1 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          {(["all", "draft", "published", "archived"] as const).map(
            (filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setLifecycleFilter(filter)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  lifecycleFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ),
          )}
        </fieldset>
      </div>

      {/* Questions list */}
      {filteredQuestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <HelpCircleIcon
              className="size-10 text-muted-foreground/60 mb-3"
              aria-hidden="true"
            />
            <h3 className="text-base font-semibold text-foreground">
              No questions found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
              {searchQuery || lifecycleFilter !== "all"
                ? "No questions match the current filter or search criteria."
                : "Get started by creating your first question in this space."}
            </p>
            <Link
              href={`/${lang}/spaces/${spaceId}/questions/new`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "gap-1.5",
              })}
            >
              <PlusIcon className="size-4" aria-hidden="true" />
              <span>New Question</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredQuestions.map((question) => (
            <Card
              key={question.id}
              className="hover:border-primary/50 transition-colors"
            >
              <Link
                href={`/${lang}/spaces/${spaceId}/questions/${question.id}`}
                className="block"
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-base font-semibold hover:text-primary transition-colors">
                      {question.title || "Untitled Question"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          question.lifecycle === "published"
                            ? "default"
                            : question.lifecycle === "archived"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-xs capitalize"
                      >
                        {question.lifecycle}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs capitalize text-muted-foreground"
                      >
                        {question.format}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {question.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[11px] px-1.5 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        No tags
                      </span>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
