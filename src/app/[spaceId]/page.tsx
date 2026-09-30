import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RequireAuth } from "@/components/notes-app/require-auth";
import { SpaceSwitcher } from "@/components/notes-app/space-switcher";
import { UserMenu } from "@/components/notes-app/user-menu";
import { Button } from "@/components/ui/button";

export default async function SpacePage({
  params,
}: PageProps<"/[spaceId]">) {
  const { spaceId } = await params;
  const [appT, spacesT] = await Promise.all([
    getTranslations("app"),
    getTranslations("spaces"),
  ]);
  const nextPath = `/${spaceId}`;

  return (
    <RequireAuth redirectTo={`/login?next=${encodeURIComponent(nextPath)}`}>
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
              <span className="sr-only">{spacesT("backToHome")}</span>
            </Button>
            <span className="font-semibold text-lg text-foreground">
              {appT("title")}
            </span>
          </div>
          <UserMenu />
        </header>

        <main className="flex flex-col items-center justify-center text-center p-8 space-y-6 max-w-md w-full">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {spacesT("activeSpace")}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {spacesT("spaceHeading", { id: spaceId })}
            </h1>
          </div>
          <SpaceSwitcher currentSpaceId={spaceId} />
        </main>

        <footer className="p-6 text-center text-xs text-zinc-500">
          {appT("footer")}
        </footer>
      </div>
    </RequireAuth>
  );
}
