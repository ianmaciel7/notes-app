import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">{t("starter")}</p>
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </header>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <h2 className="text-lg font-medium">{t("quickStart.title")}</h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>{t("quickStart.step1")}</li>
            <li>{t("quickStart.step2")}</li>
            <li>{t("quickStart.step3")}</li>
          </ol>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border p-4 transition hover:bg-muted"
          >
            <h3 className="font-medium">{t("links.nextjs")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("links.nextjsDesc")}</p>
          </a>
          <a
            href="https://ui.shadcn.com/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border p-4 transition hover:bg-muted"
          >
            <h3 className="font-medium">{t("links.shadcn")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("links.shadcnDesc")}</p>
          </a>
        </div>

        <Button>{t("cta")}</Button>
      </section>
    </main>
  );
}
