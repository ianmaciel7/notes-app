"use client";

import { disableNetwork, enableNetwork } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Toaster, toast } from "@/components/ui/toast";
import { BACKEND_UNREACHABLE_EVENT } from "@/lib/error-capture/firebase-logs";
import { db } from "@/lib/firebase/firestore";

const TOAST_ID = "backend-unreachable";

// Closing first lets a failed attempt re-open the toast via a fresh SDK log.
async function reconnect() {
  toast.close(TOAST_ID);
  await disableNetwork(db);
  await enableNetwork(db);
}

export function BackendStatusToaster() {
  const t = useTranslations("connection");

  useEffect(() => {
    const onUnreachable = () => {
      toast.add({
        id: TOAST_ID,
        type: "warning",
        priority: "high",
        title: t("title"),
        description: t("description"),
        timeout: 0,
        actionProps: { children: t("retry"), onClick: () => void reconnect() },
      });
    };
    const onOnline = () => toast.close(TOAST_ID);

    window.addEventListener(BACKEND_UNREACHABLE_EVENT, onUnreachable);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener(BACKEND_UNREACHABLE_EVENT, onUnreachable);
      window.removeEventListener("online", onOnline);
    };
  }, [t]);

  return <Toaster />;
}
