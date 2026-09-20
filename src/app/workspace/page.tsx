import { ArrowRight, CircleHelp, FileText, Link2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceFrame } from "@/components/workspace-frame";

export default function WorkspacePage() {
  return (
    <WorkspaceFrame title="Overview" eyebrow="Space home">
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-0 bg-surface-dark text-white shadow-none">
          <CardHeader>
            <Badge className="w-fit bg-coral text-white">TODAY</Badge>
            <CardTitle className="display-face mt-5 text-3xl font-normal text-white">
              Keep learning visible.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-md leading-7 text-white/65">
              Pick up where you left off, review what is due, or add a new
              object to your Space.
            </p>
            <Link
              href="/study"
              className="mt-8 inline-flex items-center gap-2 text-sm text-coral"
            >
              Start a study session <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
        <Card className="border-0 bg-surface-card shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Review today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <span className="display-face text-5xl">12</span>
              <span className="pb-2 text-sm text-muted-foreground">
                questions due
              </span>
            </div>
            <Link
              href="/review"
              className="mt-6 inline-flex items-center gap-2 text-sm text-coral"
            >
              Open review queue <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="display-face text-2xl">Recent objects</h2>
          <Link href="/question" className="text-sm text-coral">
            View all
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: CircleHelp,
              title: "What is eventual consistency?",
              type: "Question",
            },
            {
              icon: FileText,
              title: "Distributed systems notes",
              type: "Note",
            },
            { icon: Link2, title: "Citations to revisit", type: "Collection" },
          ].map(({ icon: Icon, title, type }) => (
            <Card key={title} className="border-hairline bg-canvas shadow-none">
              <CardContent className="flex items-start gap-3 p-5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-surface-card text-coral">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm text-ink">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{type}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </WorkspaceFrame>
  );
}
