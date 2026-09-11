"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { bootstrapSpace } from "@/lib/spaces/bootstrap-space";

export function useBootstrapSpace() {
  const [bootstrapError, setBootstrapError] = useState<Error | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void bootstrapSpace(db)
      .then(() => {
        if (!cancelled) setBootstrapped(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setBootstrapError(error instanceof Error ? error : new Error(String(error)));
        setBootstrapped(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { bootstrapped, bootstrapError };
}
