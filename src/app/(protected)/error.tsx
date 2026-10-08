"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ProtectedError({ retry }: { retry: () => void }) {
  const translate = useTranslations("common");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h1>{translate("somethingWentWrong")}</h1>
      <Button type="button" onClick={() => retry()}>
        {translate("tryAgain")}
      </Button>
    </main>
  );
}
