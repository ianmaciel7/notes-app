"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces } from "@/hooks/use-spaces";

function useSpaceSidebar({ currentSpaceId }: { currentSpaceId?: string }) {
  const router = useRouter();
  const { user, isLoading: authLoading, signOutUser } = useAuth();
  const { spaces, loading, error, isOffline, retry, createSpace } = useSpaces();
  const firstSpaceId = spaces[0]?.id;

  useEffect(() => {
    if (authLoading || currentSpaceId) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!loading && !error && firstSpaceId) router.replace(`/${firstSpaceId}`);
  }, [authLoading, currentSpaceId, error, firstSpaceId, loading, router, user]);

  return {
    authLoading,
    createSpace,
    error,
    isOffline,
    loading,
    retry,
    router,
    signOutUser,
    spaces,
    user,
  };
}

export { useSpaceSidebar };
