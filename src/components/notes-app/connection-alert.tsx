"use client";

import { WifiOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { createContext, use, useEffect, useState } from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BACKEND_UNREACHABLE_EVENT } from "@/lib/error-capture/firebase-logs";
import { reconnectFirestore } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";

type ConnectionAlertProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

type ConnectionAlertIconProps = React.ComponentProps<typeof WifiOffIcon>;

type ConnectionAlertTitleProps = React.ComponentProps<typeof AlertTitle>;

type ConnectionAlertDescriptionProps = React.ComponentProps<
  typeof AlertDescription
>;

type ConnectionAlertActionProps = React.ComponentProps<typeof AlertAction>;

type ConnectionAlertContextValue = {
  onReconnect: () => Promise<void>;
  reconnecting: boolean;
};

const ConnectionAlertContext =
  createContext<ConnectionAlertContextValue | null>(null);

function ConnectionAlertIcon({ ...props }: ConnectionAlertIconProps) {
  return <WifiOffIcon {...props} aria-hidden="true" />;
}

function ConnectionAlertTitle({ ...props }: ConnectionAlertTitleProps) {
  const t = useTranslations("connection");
  return <AlertTitle {...props}>{t("title")}</AlertTitle>;
}

function ConnectionAlertDescription({
  ...props
}: ConnectionAlertDescriptionProps) {
  const t = useTranslations("connection");
  return <AlertDescription {...props}>{t("description")}</AlertDescription>;
}

function ConnectionAlertAction({ ...props }: ConnectionAlertActionProps) {
  const t = useTranslations("connection");
  const context = use(ConnectionAlertContext);

  if (!context) {
    throw new Error(
      "ConnectionAlertAction must be used within ConnectionAlert.",
    );
  }

  return (
    <AlertAction {...props}>
      <Button
        size="sm"
        variant="outline"
        disabled={context.reconnecting}
        onClick={context.onReconnect}
      >
        {context.reconnecting ? <Spinner data-icon="inline-start" /> : null}
        {context.reconnecting ? t("retrying") : t("retry")}
      </Button>
    </AlertAction>
  );
}

function ConnectionAlert({
  children,
  className,
  ...props
}: ConnectionAlertProps) {
  const [visible, setVisible] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const onUnreachable = () => setVisible(true);
    const onOnline = () => setVisible(false);

    window.addEventListener(BACKEND_UNREACHABLE_EVENT, onUnreachable);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener(BACKEND_UNREACHABLE_EVENT, onUnreachable);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  if (!visible) return null;

  const handleReconnect = async () => {
    setReconnecting(true);
    try {
      await reconnectFirestore();
    } finally {
      setReconnecting(false);
    }
  };

  return (
    <ConnectionAlertContext.Provider
      value={{ onReconnect: handleReconnect, reconnecting }}
    >
      <Alert
        {...props}
        className={cn("fixed inset-x-4 top-3 sm:inset-x-6", className)}
        variant="destructive"
        aria-live="assertive"
        aria-atomic="true"
      >
        {children}
      </Alert>
    </ConnectionAlertContext.Provider>
  );
}

export {
  ConnectionAlert,
  ConnectionAlertAction,
  ConnectionAlertDescription,
  ConnectionAlertIcon,
  ConnectionAlertTitle,
  type ConnectionAlertActionProps,
  type ConnectionAlertDescriptionProps,
  type ConnectionAlertIconProps,
  type ConnectionAlertProps,
  type ConnectionAlertTitleProps,
};
