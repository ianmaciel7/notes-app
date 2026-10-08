"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFirebaseClient } from "@/lib/firebase/client";
import { clearServerSession } from "@/lib/firebase/session-client";

export function useSignOutButton() {
  const router = useRouter();
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
      setError("Could not sign out. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return { error, handleSignOut, pending };
}
