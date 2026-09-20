import { ArrowRight, CheckCircle2, CircleHelp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorkspaceFrame } from "@/components/workspace-frame";

export default function ReviewPage() {
  return (
    <WorkspaceFrame title="Review queue" eyebrow="Spaced repetition">
      <div className="mt-10 flex flex-col gap-5">
        <Card className="border-0 bg-coral text-white shadow-none">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/75">Due today</p>
              <p className="display-face mt-2 text-4xl">12 questions</p>
            </div>
            <Button className="w-fit bg-white text-ink hover:bg-surface-soft">
              Start review <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <h2 className="display-face text-2xl">Questions to revisit</h2>
          <Badge variant="outline" className="border-hairline">
            SM-2 schedule
          </Badge>
        </div>
        {[
          "What is eventual consistency?",
          "When should a read be strongly consistent?",
          "How does a quorum write work?",
        ].map((question, index) => (
          <Card
            key={question}
            className="border-hairline bg-canvas shadow-none"
          >
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-surface-soft text-coral">
                <CircleHelp className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href="/question"
                  className="text-sm text-ink hover:text-coral"
                >
                  {question}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {index + 1} day{index ? "s" : ""} overdue · interval{" "}
                  {index + 1} day
                </p>
              </div>
              <CheckCircle2 className="size-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspaceFrame>
  );
}
