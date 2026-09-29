import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SpaceSwitcher } from "@/components/notes-app/space-switcher";
import { UserMenu } from "@/components/notes-app/user-menu";
import { Button } from "@/components/ui/button";

interface SpacePageProps {
  params: Promise<{
    spaceId: string;
  }>;
}

export default async function SpacePage({ params }: SpacePageProps) {
  const { spaceId } = await params;

  return (
    <div className="flex flex-col flex-1 items-center justify-between min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="flex w-full max-w-3xl items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back to Home</span>
          </Button>
          <span className="font-semibold text-lg text-foreground">
            Notes App
          </span>
        </div>
        <UserMenu />
      </header>

      <main className="flex flex-col items-center justify-center text-center p-8 space-y-6 max-w-md w-full">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Active Space
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Space: {spaceId}
          </h1>
        </div>
        <SpaceSwitcher currentSpaceId={spaceId} />
      </main>

      <footer className="p-6 text-center text-xs text-zinc-500">
        Notes App • Firebase Auth • Space Scope
      </footer>
    </div>
  );
}
