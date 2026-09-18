import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, useUI } from "@firebase-oss/ui-react";
import { useContext } from "react";
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

  const className = cn("hover:underline font-semibold");

  return (
    <div className="text-muted-foreground text-center text-xs">
      {parts.map((part: string, index: number) => {
        const itemKey = `${part}-${index}`;
        if (part === "{tos}") {
          return onNavigate ? (
            <button
              type="button"
              key={itemKey}
              onClick={() => onNavigate(termsOfServiceUrl)}
              className={className}
            >
              {getTranslation(ui, "labels", "termsOfService")}
            </button>
          ) : (
            <a
              key={itemKey}
              target="_blank"
              rel="noopener noreferrer"
              href={termsOfServiceUrl ? String(termsOfServiceUrl) : undefined}
              className={className}
            >
              {getTranslation(ui, "labels", "termsOfService")}
            </a>
          );
        }

        if (part === "{privacy}") {
          return onNavigate ? (
            <button
              type="button"
              key={itemKey}
              onClick={() => onNavigate(privacyPolicyUrl)}
              className={className}
            >
              {getTranslation(ui, "labels", "privacyPolicy")}
            </button>
          ) : (
            <a
              key={itemKey}
              target="_blank"
              rel="noopener noreferrer"
              href={privacyPolicyUrl ? String(privacyPolicyUrl) : undefined}
              className={className}
            >
              {getTranslation(ui, "labels", "privacyPolicy")}
            </a>
          );
        }

        return <span key={itemKey}>{part}</span>;
      })}
    </div>
  );
}
