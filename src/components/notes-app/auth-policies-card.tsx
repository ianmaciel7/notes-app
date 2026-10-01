import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, type PolicyURL, useUI } from "@firebase-oss/ui-react";
import type { ComponentProps, ReactNode } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AuthPoliciesCardProps extends ComponentProps<"div"> {}

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
      <Button
        variant="link"
        type="button"
        className={className}
        onClick={() => onNavigate(url)}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant="link"
      nativeButton={false}
      render={
        <a href={String(url)} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      }
      className={className}
    />
  );
}

export function AuthPoliciesCard({
  className,
  ...props
}: AuthPoliciesCardProps) {
  const ui = useUI();
  const policies = use(PolicyContext);

  if (!policies) {
    return null;
  }

  const { termsOfServiceUrl, privacyPolicyUrl, onNavigate } = policies;
  const termsAndPrivacyText = getTranslation(ui, "messages", "termsAndPrivacy");
  const parts = termsAndPrivacyText.split(/(\{tos\}|\{privacy\})/);

  const linkClassName = cn("h-auto px-0 font-semibold");
  const partCounts = new Map<string, number>();
  const keyedParts = parts.map((part) => {
    const type =
      part === "{tos}" ? "tos" : part === "{privacy}" ? "privacy" : "text";
    const occurrence = (partCounts.get(type) ?? 0) + 1;
    partCounts.set(type, occurrence);
    return { key: `${type}-${occurrence}`, part };
  });

  return (
    <div
      className={cn("text-muted-foreground text-center text-xs", className)}
      {...props}
    >
      {keyedParts.map(({ key, part }) => {
        if (part === "{tos}") {
          return (
            <PolicyLink
              key={key}
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
              key={key}
              onNavigate={onNavigate}
              url={privacyPolicyUrl}
              className={linkClassName}
            >
              {getTranslation(ui, "labels", "privacyPolicy")}
            </PolicyLink>
          );
        }

        return <span key={key}>{part}</span>;
      })}
    </div>
  );
}

export { AuthPoliciesCard as Policies };

export type PoliciesProps = AuthPoliciesCardProps;
