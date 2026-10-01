import { getTranslations } from "next-intl/server";
import { AuthGreetingHeader } from "@/components/notes-app/auth-greeting-header";
import { SpaceSidebar } from "@/components/notes-app/space-sidebar";

export default async function Home() {
  const t = await getTranslations("app");

  return (
    <SpaceSidebar>
      <div className="flex flex-1 flex-col bg-background font-sans">
        <header className="flex items-center justify-between p-6">
          <span className="text-lg font-semibold text-foreground">
            {t("title")}
          </span>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <AuthGreetingHeader />
        </main>
        <footer className="p-6 text-center text-xs text-muted-foreground">
          {t("footer")}
        </footer>
      </div>
    </SpaceSidebar>
  );
}
