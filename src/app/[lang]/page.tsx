import { notFound, redirect } from "next/navigation";

import { requireActionUser } from "@/data/action-auth";
import { createPrivateSpace, listOwnedSpaces } from "@/data/spaces";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  let user: { uid: string; email: string | null };
  try {
    user = await requireActionUser();
  } catch {
    redirect(`/${lang}/sign-in`);
  }

  const spaces = await listOwnedSpaces(user.uid);
  if (spaces.length > 0) {
    redirect(`/${lang}/spaces/${spaces[0].id}`);
  }

  const dictionary = await getDictionary(lang as Locale);
  const defaultSpace = await createPrivateSpace(
    user.uid,
    dictionary.spaces.mySpaces,
  );
  redirect(`/${lang}/spaces/${defaultSpace.id}`);
}
