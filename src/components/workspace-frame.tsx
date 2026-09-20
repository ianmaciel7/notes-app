"use client";

import {
  BookOpen,
  Brain,
  CircleHelp,
  FileText,
  Link2,
  PanelLeft,
  Search,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function WorkspaceFrame({
  children,
  title,
  eyebrow,
}: {
  children: ReactNode;
  title: string;
  eyebrow: string;
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-hairline bg-surface-soft lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-hairline px-6 text-sm font-medium">
          <span className="text-xl text-coral" aria-hidden="true">
            ✳
          </span>{" "}
          Recall
        </div>
        <div className="flex flex-col gap-1 p-4">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Personal Space
          </p>
          <Link
            className="rounded-lg bg-surface-card px-3 py-2.5 text-sm text-ink"
            href="/workspace"
          >
            Overview
          </Link>
          <Link
            className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-card hover:text-ink"
            href="/question"
          >
            Questions
          </Link>
          <Link
            className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-card hover:text-ink"
            href="/study"
          >
            Study session
          </Link>
          <Link
            className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-card hover:text-ink"
            href="/review"
          >
            Review queue
          </Link>
        </div>
        <div className="mt-auto border-t border-hairline p-4">
          <Button
            variant="outline"
            className="w-full justify-start border-hairline bg-canvas"
          >
            <Search data-icon="inline-start" /> Search workspace
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-hairline bg-canvas px-5 lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
            >
              <PanelLeft />
            </Button>
            <span className="text-sm text-muted-foreground">
              Personal Space
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-ink">{title}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-hairline bg-canvas"
          >
            New object
          </Button>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-10 lg:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-coral">
            {eyebrow}
          </p>
          <h1 className="display-face mt-3 text-4xl text-ink">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

export const objectIcon = {
  question: CircleHelp,
  note: FileText,
  exam: BookOpen,
  review: Brain,
  link: Link2,
};
