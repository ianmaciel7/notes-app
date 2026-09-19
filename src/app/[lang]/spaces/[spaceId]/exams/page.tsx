import { GraduationCapIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireActionUser } from "@/data/action-auth";
import { listObjects } from "@/data/objects";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/types";

export default async function SpaceExamsPage({
  params,
}: {
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

  const dictionary = await getDictionary(lang as Locale);
  const exams = await listObjects(user.uid, spaceId, "exam");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {dictionary.objects.exams}
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and publish practice exams for this space.
          </p>
        </div>

        <Link
          href={`/${lang}/spaces/${spaceId}/exams/new`}
          prefetch={false}
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "gap-1.5",
          })}
        >
          <PlusIcon className="size-3.5" aria-hidden="true" />
          <span>{dictionary.authoring.newExam}</span>
        </Link>
      </div>

      {/* Exam List or Empty State */}
      {exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
          <GraduationCapIcon
            className="size-12 text-muted-foreground/60"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-base font-semibold text-foreground">
            No exams found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first versioned exam.
          </p>
          <div className="mt-6">
            <Link
              href={`/${lang}/spaces/${spaceId}/exams/new`}
              prefetch={false}
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <PlusIcon className="size-3.5" aria-hidden="true" />
              <span>{dictionary.authoring.newExam}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-48">Updated</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium text-foreground">
                    <Link
                      href={`/${lang}/spaces/${spaceId}/exams/${exam.id}`}
                      className="hover:underline"
                    >
                      {exam.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        exam.lifecycle === "published"
                          ? "default"
                          : exam.lifecycle === "archived"
                            ? "destructive"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {exam.lifecycle}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(exam.updatedAt).toLocaleDateString(lang, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/${lang}/spaces/${spaceId}/exams/${exam.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "xs",
                      })}
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
