"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, useUI } from "@firebase-oss/ui-react";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Policies() {
  const ui = useUI();
  const policies = useContext(PolicyContext);

  if (!policies) {
    return null;
  }

  const { termsOfServiceUrl, privacyPolicyUrl, onNavigate } = policies;
  const termsAndPrivacyText = getTranslation(ui, "messages", "termsAndPrivacy");
  const parts = termsAndPrivacyText.split(/(\{tos\}|\{privacy\})/);
  const className = cn("h-auto p-0 text-xs font-semibold");

  const renderPolicyLink = (
    label: string,
    url: string | URL,
    partKey: string,
  ) => {
    const urlString = typeof url === "string" ? url : url.toString();
    if (onNavigate) {
      return (
        <Button
          key={partKey}
          type="button"
          variant="link"
          className={className}
          onClick={() => onNavigate(urlString)}
        >
          {label}
        </Button>
      );
    }

    return (
      <a
        key={partKey}
        href={urlString}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold hover:underline"
      >
        {label}
      </a>
    );
  };

  return (
    <div className="text-text-muted text-center text-xs">
      {parts.map((part: string, index: number) => {
        const partKey = `${index}-${part}`;
        if (part === "{tos}") {
          return renderPolicyLink(
            getTranslation(ui, "labels", "termsOfService"),
            termsOfServiceUrl,
            partKey,
          );
        }

        if (part === "{privacy}") {
          return renderPolicyLink(
            getTranslation(ui, "labels", "privacyPolicy"),
            privacyPolicyUrl,
            partKey,
          );
        }

        return <span key={partKey}>{part}</span>;
      })}
    </div>
  );
}
