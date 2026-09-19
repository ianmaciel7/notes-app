import { FileQuestionIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow-sm">
        <FileQuestionIcon className="size-8 text-muted-foreground" />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The resource or page you are looking for does not exist or has been
            moved.
          </p>
        </div>
        <Link href="/" className={buttonVariants()}>
          <HomeIcon data-icon="inline-start" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
