import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RequireAuth } from "@/components/notes-app/require-auth";
import { SpaceSidebar } from "@/components/notes-app/space-sidebar";

export default async function SpacePage({ params }: PageProps<"/[spaceId]">) {
  const { spaceId } = await params;
  const [appT, spacesT] = await Promise.all([
    getTranslations("app"),
    getTranslations("spaces"),
  ]);
  const nextPath = `/${spaceId}`;

  return (
    <RequireAuth redirectTo={`/login?next=${encodeURIComponent(nextPath)}`}>
      <SpaceSidebar currentSpaceId={spaceId}>
        <div className="flex flex-1 flex-col bg-background font-sans">
          <header className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                aria-label={spacesT("backToHome")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <span className="text-lg font-semibold text-foreground">
                {appT("title")}
              </span>
            </div>
          </header>
          <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {spacesT("activeSpace")}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {spacesT("spaceHeading", { id: spaceId })}
              </h1>
            </div>
          </main>
          <footer className="p-6 text-center text-xs text-muted-foreground">
            {appT("footer")}
          </footer>
        </div>
      </SpaceSidebar>
    </RequireAuth>
  );
}
