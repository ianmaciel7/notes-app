import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, useUI } from "@firebase-oss/ui-react";
import { use, type ReactNode } from "react";

type PolicyActionProps = {
  children: ReactNode;
  href: string | URL;
  onNavigate?: (url: string | URL) => void;
};

function PolicyAction({ children, href, onNavigate }: PolicyActionProps) {
  const className = "font-semibold hover:underline";

  if (onNavigate) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => onNavigate(href)}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={href.toString()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

function Policies() {
  const ui = useUI();
  const policies = use(PolicyContext);

  if (!policies) return null;

  const { termsOfServiceUrl, privacyPolicyUrl, onNavigate } = policies;
  const parts = getTranslation(ui, "messages", "termsAndPrivacy").split(
    /(\{tos\}|\{privacy\})/,
  );

  return (
    <div className="text-center text-xs text-muted-foreground">
      {parts.map((part) => {
        if (part === "{tos}") {
          return (
            <PolicyAction
              key="terms-of-service"
              href={termsOfServiceUrl}
              onNavigate={onNavigate}
            >
              {getTranslation(ui, "labels", "termsOfService")}
            </PolicyAction>
          );
        }

        if (part === "{privacy}") {
          return (
            <PolicyAction
              key="privacy-policy"
              href={privacyPolicyUrl}
              onNavigate={onNavigate}
            >
              {getTranslation(ui, "labels", "privacyPolicy")}
            </PolicyAction>
          );
        }

        return part;
      })}
    </div>
  );
}

export { Policies };
