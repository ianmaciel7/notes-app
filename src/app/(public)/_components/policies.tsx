"use client";

import { PolicyContext } from "@firebase-oss/ui-react";
import { type ComponentProps, useContext } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

type PoliciesProps = ComponentProps<"div">;

export function Policies(props: PoliciesProps) {
  const translate = useTranslation();
  const policies = useContext(PolicyContext);

  if (!policies) {
    return null;
  }

  const { termsOfServiceUrl, privacyPolicyUrl, onNavigate } = policies;
  const termsAndPrivacyText = translate("messages", "termsAndPrivacy");
  const parts = termsAndPrivacyText.split(/(\{tos\}|\{privacy\})/);
  const className = cn("h-auto p-0 text-sm font-semibold");

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
    <div {...props} className="text-muted-foreground text-center text-sm">
      {parts.map((part: string, index: number) => {
        const partKey = `${index}-${part}`;
        if (part === "{tos}") {
          return renderPolicyLink(
            translate("labels", "termsOfService"),
            termsOfServiceUrl,
            partKey,
          );
        }

        if (part === "{privacy}") {
          return renderPolicyLink(
            translate("labels", "privacyPolicy"),
            privacyPolicyUrl,
            partKey,
          );
        }

        return <span key={partKey}>{part}</span>;
      })}
    </div>
  );
}
