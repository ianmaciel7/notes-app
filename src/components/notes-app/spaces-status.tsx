"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SpacesStatusProps = ComponentProps<"div"> & {
  error: Error | null;
  isOffline: boolean;
  loading: boolean;
  notFound: boolean;
  onBack: () => void;
  onRetry: () => void;
  t: (key: string) => string;
};

function SpacesStatus({
  error,
  isOffline,
  loading,
  notFound,
  onBack,
  onRetry,
  className,
  t,
  ...props
}: SpacesStatusProps): ReactNode {
  if (error) {
    return (
      <div
        data-testid="spaces-status-error"
        className={cn(
          "mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3",
          className,
        )}
        {...props}
      >
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertCircle data-icon="inline-start" />
          <AlertTitle>{t("connectionError")}</AlertTitle>
          <AlertDescription>
            {t(isOffline ? "offlineDescription" : "databaseErrorDescription")}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          data-testid="spaces-status-retry-btn"
        >
          <RefreshCw data-icon="inline-start" />
          {t("retryConnection")}
        </Button>
      </div>
    );
  }
  if (loading) {
    return (
      <div
        data-testid="spaces-status-loading"
        className={cn(
          "flex items-center justify-center p-4 text-xs text-muted-foreground",
          className,
        )}
        {...props}
      >
        <output className="sr-only">{t("loading")}</output>
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }
  if (notFound) {
    return (
      <div
        data-testid="spaces-status-not-found"
        className={cn("flex flex-1 items-center justify-center p-8", className)}
        {...props}
      >
        <Empty className="max-w-sm border border-dashed p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>{t("spaceNotFoundTitle")}</EmptyTitle>
            <EmptyDescription>{t("spaceNotFoundDescription")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              data-testid="spaces-status-back-btn"
            >
              {t("backToSpaces")}
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }
  return null;
}

export { SpacesStatus, type SpacesStatusProps };
