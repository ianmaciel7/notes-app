"use client";

import { CheckIcon, FileTextIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface PersonalNoteCardProps {
  questionId: string;
  examId: string;
  initialNote?: string;
  onSave?: (content: string) => Promise<void> | void;
}

export function PersonalNoteCard({
  questionId: _questionId,
  examId: _examId,
  initialNote = "",
  onSave,
}: PersonalNoteCardProps) {
  const [content, setContent] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    setContent(initialNote);
  }, [initialNote]);

  const handleSave = async () => {
    if (!onSave || isSaving) return;
    setIsSaving(true);
    setShowSavedFeedback(false);

    try {
      await onSave(content);
      setShowSavedFeedback(true);
      setTimeout(() => {
        setShowSavedFeedback(false);
      }, 2500);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <FileTextIcon className="size-4 text-primary" />
          <CardTitle className="text-sm font-semibold text-foreground">
            Personal Study Note
          </CardTitle>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Private to your account
        </span>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Jot down key takeaways, architectural reasons, or mnemonics to remember this question..."
          rows={3}
          className="min-h-[75px] resize-y text-xs leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">
            {showSavedFeedback && (
              <span className="flex items-center gap-1 font-medium text-primary">
                <CheckIcon className="size-3" />
                Note saved
              </span>
            )}
          </div>

          <Button
            type="button"
            size="xs"
            onClick={handleSave}
            disabled={isSaving || content === initialNote}
            className="gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2Icon className="size-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="size-3" />
                Save Note
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
