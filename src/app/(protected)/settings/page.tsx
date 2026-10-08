import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SecondFactorPanel } from "@/components/notes-app/second-factor-panel";
import { getCurrentIdentity } from "@/lib/firebase/identity";

export const instant = false;
export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const identity = await getCurrentIdentity();
  const translate = await getTranslations("common");

  if (!identity) {
    redirect("/sign-in");
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <h1 className="sr-only">{translate("settings")}</h1>
      <SecondFactorPanel />
    </main>
  );
}
