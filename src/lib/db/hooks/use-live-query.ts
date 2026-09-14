"use client";

import { useLiveQuery as dexieUseLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

export function useSafeLiveQuery<T>(
  querier: () => Promise<T> | T,
  deps: unknown[],
  fallback: T
): T {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const result = dexieUseLiveQuery(querier, deps);

  if (!mounted || result === undefined) {
    return fallback;
  }

  return result;
}
