"use client";

import { Button } from "@/components/ui/button";

export default function RootError({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1>Something went wrong</h1>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
