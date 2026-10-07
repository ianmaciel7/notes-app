import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTranslation } from "@firebase-oss/ui-core";
import { PolicyContext, useUI } from "@firebase-oss/ui-react";
import { useContext } from "react";

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
    url: string,
    key: number,
  ) => {
    if (onNavigate) {
      return (
        <Button
          key={key}
          type="button"
          variant="link"
          className={className}
          onClick={() => onNavigate(url)}
        >
          {label}
        </Button>
      );
    }

    return (
      <a
        key={key}
        href={url}
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
        if (part === "{tos}") {
          return renderPolicyLink(
            getTranslation(ui, "labels", "termsOfService"),
            termsOfServiceUrl,
            index,
          );
        }

        if (part === "{privacy}") {
          return renderPolicyLink(
            getTranslation(ui, "labels", "privacyPolicy"),
            privacyPolicyUrl,
            index,
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
