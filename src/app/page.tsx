import { AuthGreetingHeader } from "@/components/notes-app/auth-greeting-header";
import { SpaceSidebar } from "@/components/notes-app/space-sidebar";

export default async function Home() {
  return (
    <SpaceSidebar>
      <div className="flex flex-1 flex-col bg-background font-sans">
        <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <AuthGreetingHeader />
        </main>
      </div>
    </SpaceSidebar>
  );
}
