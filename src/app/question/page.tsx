import { ArrowLeft, ArrowRight, Link2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceFrame } from "@/components/workspace-frame";

export default function QuestionPage() {
  return (
    <WorkspaceFrame title="Question" eyebrow="Object detail">
      <Link
        href="/workspace"
        className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Back to Space
      </Link>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="border-hairline bg-canvas shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-coral/40 text-coral">
                QUESTION
              </Badge>
              <span className="text-xs text-muted-foreground">
                Updated just now
              </span>
            </div>
            <CardTitle className="display-face mt-5 text-3xl font-normal">
              What is eventual consistency?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-8 text-body">
              A system is eventually consistent when, given no new updates, all
              replicas converge to the same value.
            </p>
            <div className="mt-8 rounded-xl bg-surface-soft p-5">
              <p className="text-sm font-medium text-ink">
                Choose the best answer
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {[
                  "All reads always return the latest write",
                  "Replicas converge when updates stop",
                  "Writes are rejected when replicas differ",
                ].map((answer, index) => (
                  <button
                    key={answer}
                    type="button"
                    className="flex items-center gap-3 rounded-lg border border-hairline bg-canvas p-4 text-left text-sm hover:border-coral"
                  >
                    <span className="flex size-7 items-center justify-center rounded-full border border-hairline text-xs text-muted-foreground">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {answer}
                  </button>
                ))}
              </div>
            </div>
            <Button className="mt-6 bg-coral text-white hover:bg-coral-active">
              Check answer <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
        <Card className="h-fit border-hairline bg-surface-soft shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="size-4 text-coral" /> Linked objects
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="#" className="rounded-lg bg-canvas p-3 text-sm">
              Distributed systems notes
              <span className="mt-1 block text-xs text-muted-foreground">
                Note
              </span>
            </Link>
            <Link href="#" className="rounded-lg bg-canvas p-3 text-sm">
              CAP theorem citation
              <span className="mt-1 block text-xs text-muted-foreground">
                Citation
              </span>
            </Link>
            <Link href="#" className="text-sm text-coral">
              View backlinks
            </Link>
          </CardContent>
        </Card>
      </div>
    </WorkspaceFrame>
  );
}
