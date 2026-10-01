import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, type PolicyURL, useUI } from "@firebase-oss/ui-react";
import type { ComponentProps, ReactNode } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface AuthPoliciesCardProps extends ComponentProps<"div"> {}

function PolicyLink({
  onNavigate,
  url,
  children,
}: {
  onNavigate?: (url: PolicyURL) => void;
  url: PolicyURL;
  children: ReactNode;
}) {
  if (onNavigate) {
    return (
      <Button
        variant="link"
        size="sm"
        type="button"
        onClick={() => onNavigate(url)}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant="link"
      size="sm"
      nativeButton={false}
      render={
        <a href={String(url)} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      }
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

  const partCounts = new Map<string, number>();
  const keyedParts = parts.map((part) => {
    const type =
      part === "{tos}" ? "tos" : part === "{privacy}" ? "privacy" : "text";
    const occurrence = (partCounts.get(type) ?? 0) + 1;
    partCounts.set(type, occurrence);
    return { key: `${type}-${occurrence}`, part };
  });

  return (
    <FieldDescription
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
            >
              {getTranslation(ui, "labels", "privacyPolicy")}
            </PolicyLink>
          );
        }

        return <span key={key}>{part}</span>;
      })}
    </FieldDescription>
  );
}

export { AuthPoliciesCard as Policies };

export type PoliciesProps = AuthPoliciesCardProps;
