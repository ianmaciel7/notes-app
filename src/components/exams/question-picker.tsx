"use client";

import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QuestionSummaryDto } from "@/data/questions-v2";

export interface QuestionPickerProps {
  questions: QuestionSummaryDto[];
  onSelectQuestion: (question: QuestionSummaryDto) => void;
  selectedQuestionIds?: string[];
  disabled?: boolean;
}

export function QuestionPicker({
  questions,
  onSelectQuestion,
  selectedQuestionIds = [],
  disabled = false,
}: QuestionPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const publishedQuestions = useMemo(() => {
    return questions.filter((q) => Boolean(q.publishedRevisionId));
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return publishedQuestions;

    return publishedQuestions.filter(
      (q) =>
        q.title.toLowerCase().includes(query) ||
        q.format.toLowerCase().includes(query) ||
        q.publishedRevisionId?.toLowerCase().includes(query),
    );
  }, [publishedQuestions, searchQuery]);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Select Questions
        </h3>
        <div className="relative w-full sm:w-64">
          <SearchIcon
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search published questions..."
            className="pl-8 text-sm"
            disabled={disabled}
            aria-label="Search published questions"
          />
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No published questions found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-32">Format</TableHead>
              <TableHead className="w-48">Published Revision</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((question) => {
              const isAdded = selectedQuestionIds.includes(question.id);
              return (
                <TableRow key={question.id}>
                  <TableCell className="font-medium text-foreground">
                    {question.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {question.format}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {question.publishedRevisionId}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="xs"
                      variant={isAdded ? "secondary" : "outline"}
                      disabled={disabled || isAdded}
                      onClick={() => onSelectQuestion(question)}
                      aria-label={
                        isAdded
                          ? `Already added ${question.title}`
                          : `Add ${question.title}`
                      }
                    >
                      {isAdded ? "Added" : "Add"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
