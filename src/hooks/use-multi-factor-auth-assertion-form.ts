import { useUI } from "@firebase-oss/ui-react";
import type { MultiFactorInfo } from "firebase/auth";
import { useEffect, useState } from "react";

let pendingResolverClear: ReturnType<typeof setTimeout> | undefined;

export function useMultiFactorAuthAssertionForm() {
  const ui = useUI();
  const resolver = ui.multiFactorResolver;
  const { setMultiFactorResolver } = ui;

  // Clear the resolver when the assertion UI goes away. The clear is deferred
  // so React StrictMode's simulated unmount/remount in development does not
  // discard the resolver before the user can answer the challenge.
  useEffect(() => {
    clearTimeout(pendingResolverClear);

    return () => {
      pendingResolverClear = setTimeout(() => setMultiFactorResolver(), 0);
    };
  }, [setMultiFactorResolver]);

  if (!resolver) {
    throw new Error(
      "MultiFactorAuthAssertionForm requires a multi-factor resolver",
    );
  }

  // If only a single hint is provided, select it by default to improve UX.
  const [hint, setHint] = useState<MultiFactorInfo | undefined>(
    resolver.hints.length === 1 ? resolver.hints[0] : undefined,
  );

  return { ui, resolver, hint, setHint };
}
