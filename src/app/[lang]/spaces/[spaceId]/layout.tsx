import { notFound, redirect } from "next/navigation";
import type * as React from "react";

import { SpaceShell } from "@/components/spaces/space-shell";
import { requireActionUser } from "@/data/action-auth";
import { getOwnedSpace, listOwnedSpaces } from "@/data/spaces";
import { hasLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export default async function SpaceDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  let user: { uid: string; email: string | null };
  try {
    user = await requireActionUser();
  } catch {
    redirect(`/${lang}/sign-in`);
  }

  try {
    await getOwnedSpace(user.uid, spaceId);
  } catch {
    notFound();
  }

  const spaces = await listOwnedSpaces(user.uid);

  return (
    <SpaceShell
      spaceId={spaceId}
      lang={lang as Locale}
      spaces={spaces.map((s) => ({ id: s.id, name: s.name }))}
      user={user}
    >
      {children}
    </SpaceShell>
  );
}
