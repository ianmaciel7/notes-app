"use client";

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <main className="flex min-h-screen items-center justify-center px-6">
          <section className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm">
            <AlertTriangleIcon className="size-8 text-destructive" />
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                Please try again. If the problem continues, reload the page.
              </p>
            </div>
            <Button type="button" onClick={() => reset()}>
              <RefreshCwIcon data-icon="inline-start" />
              Try again
            </Button>
          </section>
        </main>
      </body>
    </html>
  );
}
