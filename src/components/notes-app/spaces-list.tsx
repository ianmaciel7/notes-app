"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { SpacesEmpty } from "@/components/notes-app/spaces-empty";

type SpaceSidebarMainProps = PropsWithChildren & {
  notFound: boolean;
  onCreate: () => void;
  showEmptyState: boolean;
  status: ReactNode;
};

function SpacesList({
  children,
  notFound,
  onCreate,
  showEmptyState,
  status,
}: SpaceSidebarMainProps) {
  if (notFound) return status;
  if (showEmptyState) return <SpacesEmpty onCreate={onCreate} />;
  return children;
}

export { SpacesList, type SpaceSidebarMainProps };
