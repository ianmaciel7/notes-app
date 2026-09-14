import type * as React from "react";
import type { ObjectIconName, ObjectIconTone } from "../../../lib/space-object-types";
import { cn } from "../../../lib/utils";
import { SplitButton, type SplitButtonSize } from "../../ui/split-button";
import { ObjectIcon } from "../icons/icon-registry";
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

const objectSplitButtonSizes: Record<
  NonNullable<ObjectSplitButtonProps["size"]>,
  SplitButtonSize
> = {
  sm: "xs",
  md: "sm",
  lg: "default",
};

export function ObjectSplitButton({
  type = "page",
  label = "",
  tone = "blue",
  onLabelClick,
  options,
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Object type options",
}: ObjectSplitButtonProps) {
  const toneStyle = toneStyles[tone] ?? toneStyles.blue;

  return (
    <SplitButton
      ariaLabel={label}
      dropdownAriaLabel={dropdownAriaLabel}
      label={label}
      leadingIcon={<ObjectIcon type={type} />}
      onPrimaryClick={onLabelClick}
      onDisclosureClick={onChevronClick}
      options={options?.map((option) => ({
        id: option.id,
        label: option.label,
        leadingIcon: option.leadingIcon,
        onClick: option.onClick,
      }))}
      size={objectSplitButtonSizes[size]}
      className={cn(
        "border font-medium transition-colors select-none",
        toneStyle.bg,
        toneStyle.text,
        toneStyle.border,
        className,
      )}
    />
  );
}
