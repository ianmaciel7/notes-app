import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SignOutButton } from "@/components/notes-app/sign-out-button";
import { getCurrentIdentity } from "@/lib/firebase/identity";

export const instant = false;
export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const identity = await getCurrentIdentity();
  const translate = await getTranslations("common");

  if (!identity) {
    redirect("/sign-in");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1>{translate("studyWorkspace")}</h1>
      <p>
        {translate("signedInAs", { email: identity.email ?? identity.uid })}
      </p>
      <Link href="/settings" className="underline underline-offset-4">
        {translate("settings")}
      </Link>
      <SignOutButton />
    </main>
  );
}
