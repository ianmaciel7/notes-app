"use client";

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm">
        <AlertTriangleIcon className="size-8 text-destructive" />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            An unexpected error occurred
          </h2>
          <p className="text-sm text-muted-foreground">
            We were unable to load this section. Please try again.
          </p>
        </div>
        <Button type="button" onClick={() => reset()}>
          <RefreshCwIcon data-icon="inline-start" />
          Try again
        </Button>
      </div>
    </div>
  );
}
