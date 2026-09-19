import {
  BookOpenIcon,
  FolderIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireActionUser } from "@/data/action-auth";
import { getOwnedSpace } from "@/data/spaces";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export const instant = false;

export default async function SpaceOverviewPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <Suspense fallback={<div className="p-4">Loading overview...</div>}>
      <SpaceOverviewContent lang={lang as Locale} spaceId={spaceId} />
    </Suspense>
  );
}

async function SpaceOverviewContent({
  lang,
  spaceId,
}: {
  lang: Locale;
  spaceId: string;
}) {
  const user = await requireActionUser();
  const space = await getOwnedSpace(user.uid, spaceId);
  const dictionary = await getDictionary(lang);

  const modules = [
    {
      title: dictionary.objects.questions,
      description: dictionary.authoring.title,
      href: `/${lang}/spaces/${spaceId}/questions`,
      icon: HelpCircleIcon,
      actionText: dictionary.authoring.newQuestion,
    },
    {
      title: dictionary.objects.exams,
      description: dictionary.exams.title,
      href: `/${lang}/spaces/${spaceId}/exams`,
      icon: GraduationCapIcon,
      actionText: dictionary.authoring.newExam,
    },
    {
      title: dictionary.objects.study,
      description: dictionary.study.dueQuestions,
      href: `/${lang}/spaces/${spaceId}/study`,
      icon: BookOpenIcon,
      actionText: dictionary.study.dueQuestions,
    },
    {
      title: dictionary.objects.collections,
      description: dictionary.objects.collections,
      href: `/${lang}/spaces/${spaceId}/collections`,
      icon: FolderIcon,
      actionText: dictionary.objects.collections,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {space.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dictionary.spaces.overview}
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {space.visibility}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((mod) => (
          <Card key={mod.href} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                {mod.title}
              </CardTitle>
              <mod.icon
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <CardDescription>{mod.description}</CardDescription>
            </CardContent>
            <CardFooter className="pt-2">
              <Link
                href={mod.href}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "w-full gap-2",
                })}
              >
                <PlusIcon className="size-3.5" aria-hidden="true" />
                <span>{mod.actionText}</span>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
