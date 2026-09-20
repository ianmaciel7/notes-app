import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceFrame } from "@/components/workspace-frame";

export default function StudyPage() {
  return (
    <WorkspaceFrame title="Study session" eyebrow="Practice">
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="border-hairline bg-canvas shadow-none">
          <CardHeader>
            <CardTitle className="display-face text-3xl font-normal">
              Set up your session
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <label className="flex flex-col gap-2 text-sm">
              Scope
              <select className="h-11 rounded-lg border border-hairline bg-canvas px-3">
                <option>All due reviews</option>
                <option>AWS Solutions Architect</option>
                <option>Distributed systems</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Question count
              <input
                className="h-11 rounded-lg border border-hairline bg-canvas px-3"
                type="number"
                defaultValue={10}
              />
            </label>
            <div>
              <p className="text-sm">Mode</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-lg border-2 border-coral bg-surface-soft p-4 text-left"
                >
                  <span className="block font-medium">Practice</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Immediate feedback
                  </span>
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-hairline p-4 text-left"
                >
                  <span className="block font-medium">Simulated exam</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Timed, feedback at end
                  </span>
                </button>
              </div>
            </div>
            <Button className="w-fit bg-coral text-white hover:bg-coral-active">
              Begin session <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
        <Card className="h-fit border-0 bg-surface-dark text-white shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="size-4 text-coral" /> Session preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-white/65">
            <p>10 questions from your due review queue.</p>
            <p className="flex items-center gap-2">
              <Clock3 className="size-4 text-coral" /> No time limit in practice
              mode.
            </p>
            <Link href="/review" className="text-coral">
              Review queue first <ArrowRight className="ml-1 inline size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </WorkspaceFrame>
  );
}
