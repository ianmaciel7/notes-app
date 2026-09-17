"use client";

import { onIdTokenChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { auth } from "@/lib/firebase/client";
import { localePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";

export function AuthGate({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const router = useRouter();
  const signInPath = localePath(locale, "/sign-in");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onIdTokenChanged(auth, async (nextUser) => {
        if (!nextUser) {
          await fetch("/api/session", { method: "DELETE" });
          setUser(null);
          setLoading(false);
          router.replace(signInPath);
          return;
        }

        const idToken = await nextUser.getIdToken();
        const response = await fetch("/api/session", {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!response.ok) {
          setUser(null);
          setLoading(false);
          router.replace(signInPath);
          return;
        }

        setUser(nextUser);
        setLoading(false);
      }),
    [router, signInPath],
  );

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading…
      </main>
    );
  }

  return children;
}
