import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/components/notes-app/auth-provider";
import { SmsEnrollmentPanel } from "@/components/notes-app/sms-enrollment-panel";
import { getCurrentIdentity } from "@/lib/firebase/identity";

export const instant = false;
export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  return (
    <AuthProvider>
      <main className="flex flex-1 items-center justify-center p-6">
        <h1 className="sr-only">Settings</h1>
        <SmsEnrollmentPanel />
      </main>
    </AuthProvider>
  );
}
