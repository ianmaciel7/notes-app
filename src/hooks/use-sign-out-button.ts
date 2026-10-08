"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getFirebaseClient } from "@/lib/firebase/client";
import { clearServerSession } from "@/lib/firebase/session-client";

export function useSignOutButton() {
  const router = useRouter();
  const translate = useTranslations("common");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      await clearServerSession();
      await signOut(getFirebaseClient().auth);
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setError(translate("signOutError"));
    } finally {
      setPending(false);
    }
  }

  return { error, handleSignOut, pending };
}
