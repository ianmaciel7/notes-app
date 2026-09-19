"use client";

import { onIdTokenChanged, type User } from "firebase/auth";
import { RefreshCwIcon, WifiOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { syncSession } from "@/lib/auth/client-session";
import { auth } from "@/lib/firebase/client";
import { localePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";

export function AuthGate({
  children,
  locale,
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  const { t, locale: contextLocale } = useI18n();
  const router = useRouter();
  const resolvedLocale = locale ?? contextLocale;
  const signInPath = localePath(resolvedLocale, "/sign-in");
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "offline">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onIdTokenChanged(auth, (nextUser) => {
      void (async () => {
        if (!nextUser) {
          if (typeof navigator !== "undefined" && !navigator.onLine) {
            if (!cancelled) setStatus("offline");
            return;
          }

          if (!cancelled) {
            setUser(null);
            setStatus("loading");
            router.replace(signInPath);
          }
          return;
        }

        try {
          const idToken = await nextUser.getIdToken();
          const sessionSynced = await syncSession(idToken);

          if (!sessionSynced) {
            if (!cancelled) {
              setUser(null);
              setStatus("loading");
              router.replace(signInPath);
            }
            return;
          }

          if (!cancelled) {
            setUser(nextUser);
            setStatus("ready");
          }
        } catch {
          // Keep the Firebase user locally available when the server is offline.
          if (!cancelled) {
            setUser(nextUser);
            setStatus("offline");
          }
        }
      })();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router, signInPath]);

  if (status === "loading" || (!user && status !== "offline")) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        {t("common.loading")}
      </main>
    );
  }

  if (status === "offline") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <Alert className="max-w-md">
          <WifiOffIcon />
          <AlertTitle>{t("errors.generic.network")}</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            {t("errors.generic.network")}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => window.location.reload()}
            >
              <RefreshCwIcon data-icon="inline-start" />
              {t("common.loading")}
            </Button>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return children;
}
