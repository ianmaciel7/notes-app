import type * as React from "react";
import type { ObjectIconName, ObjectIconTone } from "@/lib/space-object-types";
import { cn } from "@/lib/utils";
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonContent,
  SplitButtonGroup,
  SplitButtonItem,
  SplitButtonSeparator,
  SplitButtonTrigger,
} from "@/components/ui/split-button";
import { ObjectIcon } from "@/components/objects/icons/icon-registry";
import { toneStyles } from "./split-button-base";

export interface ObjectSplitButtonOption {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  onClick?: () => void;
}

export interface ObjectSplitButtonProps {
  /** The icon identifier registered in objectIconRegistry (e.g., 'page', 'book', 'task') */
  type?: ObjectIconName | (string & {});
  /** The displayed text label (e.g. 'Page') */
  label?: string;
  /** The color tone key for styling */
  tone?: ObjectIconTone;
  /** Callback when the main label/icon area is clicked */
  onLabelClick?: () => void;
  /** Dropdown menu options when clicking the disclosure chevron */
  options?: ObjectSplitButtonOption[];
  /** Optional custom dropdown trigger callback */
  onChevronClick?: () => void;
  /** Size variant, maps to Button size scale */
  size?: "sm" | "md" | "lg";
  /** Additional CSS class names */
  className?: string;
  /** Accessible label for the dropdown trigger */
  dropdownAriaLabel?: string;
}

const objectSplitButtonSizes = {
  sm: { action: "xs", trigger: "icon-xs" },
  md: { action: "sm", trigger: "icon-sm" },
  lg: { action: "default", trigger: "icon" },
} as const;

export function ObjectSplitButton({
  type = "page",
  label = "",
  tone = "blue",
  onLabelClick,
  options = [],
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Object type options",
}: ObjectSplitButtonProps) {
  const toneStyle = toneStyles[tone] ?? toneStyles.blue;
  const buttonSize = objectSplitButtonSizes[size];
  const triggerDisabled = options.length === 0 && !onChevronClick;

  return (
    <SplitButton>
      <SplitButtonGroup
        aria-label={label || dropdownAriaLabel}
        className={cn(
          "border font-medium transition-colors select-none",
          toneStyle.bg,
          toneStyle.text,
          toneStyle.border,
          className,
        )}
      >
        <SplitButtonAction
          aria-label={label || undefined}
          onClick={onLabelClick}
          size={buttonSize.action}
          variant="ghost"
          className="gap-1.5"
        >
          <ObjectIcon type={type} />
          {label && <span>{label}</span>}
        </SplitButtonAction>
        <SplitButtonSeparator orientation="vertical" />
        <SplitButtonTrigger
          aria-label={dropdownAriaLabel}
          disabled={triggerDisabled}
          onClick={onChevronClick}
          size={buttonSize.trigger}
        />
        <SplitButtonContent>
          {options.map((option) => (
            <SplitButtonItem key={option.id} onClick={option.onClick}>
              {option.leadingIcon}
              <span>{option.label}</span>
            </SplitButtonItem>
          ))}
        </SplitButtonContent>
      </SplitButtonGroup>
    </SplitButton>
  );
}
