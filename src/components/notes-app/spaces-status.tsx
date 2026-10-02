"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type SpacesStatusProps = ComponentProps<"div"> & {
  error: Error | null;
  isOffline: boolean;
  loading: boolean;
  notFound: boolean;
  onBack: () => void;
  onRetry: () => void;
};

function SpacesStatus({
  error,
  isOffline,
  loading,
  notFound,
  onBack,
  onRetry,
  className,
  ...props
}: SpacesStatusProps): ReactNode {
  const t = useTranslations("spaces");
  if (error) {
    return (
      <Alert
        data-testid="spaces-status-error"
        variant="destructive"
        role="alert"
        aria-live="assertive"
        className={cn("mx-auto w-full max-w-sm", className)}
        {...props}
      >
        <AlertCircle />
        <AlertTitle>{t("connectionError")}</AlertTitle>
        <AlertDescription>
          {t(isOffline ? "offlineDescription" : "databaseErrorDescription")}
        </AlertDescription>
        <AlertAction>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            data-testid="spaces-status-retry-btn"
          >
            <RefreshCw data-icon="inline-start" />
            {t("retryConnection")}
          </Button>
        </AlertAction>
      </Alert>
    );
  }
  if (loading) {
    return (
      <Empty
        data-testid="spaces-status-loading"
        className={cn(
          "flex items-center justify-center p-4 text-xs text-muted-foreground",
          className,
        )}
        {...props}
      >
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyDescription className="sr-only">{t("loading")}</EmptyDescription>
        <Skeleton className="h-4 w-24" />
      </Empty>
    );
  }
  if (notFound) {
    return (
      <Empty
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
      </Empty>
    );
  }
  return null;
}

export { SpacesStatus, type SpacesStatusProps };
