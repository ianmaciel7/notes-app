import { getTranslations } from "next-intl/server";
import { AuthGreetingHeader } from "@/components/notes-app/auth-greeting-header";
import { SpaceSidebar } from "@/components/notes-app/space-sidebar";
import { UserMenu } from "@/components/notes-app/user-menu";

export default async function Home() {
  const t = await getTranslations("app");

  return (
    <div className="flex flex-col flex-1 items-center justify-between min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="flex w-full max-w-3xl items-center justify-between p-6">
        <span className="font-semibold text-lg text-foreground">
          {t("title")}
        </span>
        <UserMenu />
      </header>

      <main className="flex flex-col items-center justify-center text-center p-8 space-y-6 max-w-md w-full">
        <AuthGreetingHeader />
        <SpaceSidebar />
      </main>

      <footer className="p-6 text-center text-xs text-zinc-500">
        {t("footer")}
      </footer>
    </div>
  );
}
