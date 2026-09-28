import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, type PolicyURL, useUI } from "@firebase-oss/ui-react";
import type { ComponentProps, ReactNode } from "react";
import { use } from "react";
import { cn } from "@/lib/utils";

export interface PoliciesProps extends ComponentProps<"div"> {}

function PolicyLink({
  onNavigate,
  url,
  className,
  children,
}: {
  onNavigate?: (url: PolicyURL) => void;
  url: PolicyURL;
  className: string;
  children: ReactNode;
}) {
  if (onNavigate) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => onNavigate(url)}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={String(url)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export function Policies({ className, ...props }: PoliciesProps) {
  const ui = useUI();
  const policies = use(PolicyContext);

  if (!policies) {
    return null;
  }

  const { termsOfServiceUrl, privacyPolicyUrl, onNavigate } = policies;
  const termsAndPrivacyText = getTranslation(ui, "messages", "termsAndPrivacy");
  const parts = termsAndPrivacyText.split(/(\{tos\}|\{privacy\})/);

  const linkClassName = cn("hover:underline font-semibold");

  return (
    <div
      className={cn("text-text-muted text-center text-xs", className)}
      {...props}
    >
      {parts.map((part: string, index: number) => {
        if (part === "{tos}") {
          return (
            <PolicyLink
              // biome-ignore lint/suspicious/noArrayIndexKey: parts come from a fixed, non-reorderable string split
              key={index}
              onNavigate={onNavigate}
              url={termsOfServiceUrl}
              className={linkClassName}
            >
              {getTranslation(ui, "labels", "termsOfService")}
            </PolicyLink>
          );
        }

        if (part === "{privacy}") {
          return (
            <PolicyLink
              // biome-ignore lint/suspicious/noArrayIndexKey: parts come from a fixed, non-reorderable string split
              key={index}
              onNavigate={onNavigate}
              url={privacyPolicyUrl}
              className={linkClassName}
            >
              {getTranslation(ui, "labels", "privacyPolicy")}
            </PolicyLink>
          );
        }

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: parts come from a fixed, non-reorderable string split
          <span key={index}>{part}</span>
        );
      })}
    </div>
  );
}
