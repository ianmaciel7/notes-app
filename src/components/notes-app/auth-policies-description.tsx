import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, type PolicyURL, useUI } from "@firebase-oss/ui-react";
import {
  type ComponentProps,
  Fragment,
  type PropsWithChildren,
  use,
} from "react";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type AuthPoliciesDescriptionProps = ComponentProps<"div">;

type PolicyLinkProps = PropsWithChildren<{
  onNavigate?: (url: PolicyURL) => void;
  url: PolicyURL;
}>;

function PolicyLink({ onNavigate, url, children }: PolicyLinkProps) {
  if (onNavigate) {
    return (
      <Button
        data-slot="policy-link"
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
      data-slot="policy-link"
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

function AuthPoliciesDescription({
  className,
  ...props
}: AuthPoliciesDescriptionProps) {
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
      data-slot="auth-policies-description"
      {...props}
      className={cn("text-muted-foreground text-center text-xs", className)}
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

        return <Fragment key={key}>{part}</Fragment>;
      })}
    </FieldDescription>
  );
}

export {
  AuthPoliciesDescription,
  AuthPoliciesDescription as Policies,
  type AuthPoliciesDescriptionProps,
};
