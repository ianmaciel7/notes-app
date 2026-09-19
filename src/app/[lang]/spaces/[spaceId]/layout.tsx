import { notFound, redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { SpaceLayout } from "@/components/spaces/space-layout";
import { requireActionUser } from "@/data/action-auth";
import { getOwnedSpace, listOwnedSpaces } from "@/data/spaces";
import { hasLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export default async function SpaceDetailLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading space...
        </div>
      }
    >
      <SpaceDetailContent lang={lang as Locale} spaceId={spaceId}>
        {children}
      </SpaceDetailContent>
    </Suspense>
  );
}

async function SpaceDetailContent({
  children,
  lang,
  spaceId,
}: {
  children: ReactNode;
  lang: Locale;
  spaceId: string;
}) {
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
    <SpaceLayout
      spaceId={spaceId}
      lang={lang}
      spaces={spaces.map((s) => ({ id: s.id, name: s.name }))}
      user={user}
    >
      {children}
    </SpaceLayout>
  );
}
