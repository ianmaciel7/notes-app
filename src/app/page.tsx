import { AuthGreetingHeader } from "@/components/notes-app/auth-greeting-header";
import { UserMenu } from "@/components/notes-app/user-menu";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-between min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="flex w-full max-w-3xl items-center justify-between p-6">
        <span className="font-semibold text-lg text-foreground">Notes App</span>
        <UserMenu />
      </header>

      <main className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md">
        <AuthGreetingHeader />
      </main>

      <footer className="p-6 text-center text-xs text-zinc-500">
        Notes App • Firebase Auth
      </footer>
    </div>
  );
}
