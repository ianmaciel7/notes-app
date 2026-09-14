import { ChevronDown } from "lucide-react";
import type { ObjectIconName, ObjectIconTone } from "../../../lib/space-object-types";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "../../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { ObjectIcon } from "../icons/icon-registry";
import { toneStyles } from "./split-button-base";

export interface ObjectTypeSplitChipOption {
  id: string;
  label: string;
  icon?: ObjectIconName | (string & {});
  onClick?: () => void;
}

export interface ObjectTypeSplitChipProps {
  /** The icon identifier registered in objectIconRegistry (e.g., 'page', 'book', 'task') */
  iconType?: ObjectIconName | (string & {});
  /** The displayed text label (e.g. 'Página') */
  label?: string;
  /** The color tone key for styling */
  tone?: ObjectIconTone;
  /** Callback when the main label/icon area is clicked */
  onLabelClick?: () => void;
  /** Dropdown menu options when clicking the disclosure chevron */
  options?: ObjectTypeSplitChipOption[];
  /** Optional custom dropdown trigger callback */
  onChevronClick?: () => void;
  /** Size variant — maps to Button size scale */
  size?: "sm" | "md" | "lg";
  /** Additional CSS class names */
  className?: string;
  /** Accessible label for the dropdown trigger */
  dropdownAriaLabel?: string;
}

export function ObjectTypeSplitChip({
  iconType = "page",
  label = "",
  tone = "blue",
  onLabelClick,
  options,
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Opções do tipo de objeto",
}: ObjectTypeSplitChipProps) {
  const toneStyle = toneStyles[tone] ?? toneStyles.blue;

  // Map to Button's size scale: sm→xs, md→sm, lg→default
  const buttonSize = ({ sm: "xs", md: "sm", lg: "default" } as const)[size];

  const hasOptions = options && options.length > 0;
  const hasChevronAction = Boolean(onChevronClick);

  return (
    <ButtonGroup
      aria-label={label}
      className={cn(
        "border font-medium transition-colors select-none",
        toneStyle.bg,
        toneStyle.text,
        toneStyle.border,
        className,
      )}
    >
      {/* Label + icon hit target */}
      <Button
        size={buttonSize}
        variant="ghost"
        onClick={onLabelClick}
        disabled={!onLabelClick}
        className={cn(
          "gap-1.5 rounded-r-none border-0",
          toneStyle.hoverBg,
          !onLabelClick && "pointer-events-none opacity-100",
        )}
      >
        <ObjectIcon type={iconType} />
        {label && <span>{label}</span>}
      </Button>

      {/* Vertical divider */}
      <ButtonGroupSeparator
        orientation="vertical"
        className={cn("bg-transparent border-l", toneStyle.divider)}
      />

      {/* Chevron / dropdown trigger */}
      {hasOptions ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex items-center justify-center rounded-l-none border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
              buttonSize === "xs" && "h-6 px-1.5",
              buttonSize === "sm" && "h-7 px-2",
              buttonSize === "default" && "h-8 px-2.5",
              toneStyle.hoverBg,
            )}
            aria-label={dropdownAriaLabel}
          >
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {options.map((opt) => (
              <DropdownMenuItem key={opt.id} onClick={opt.onClick}>
                {opt.icon && <ObjectIcon type={opt.icon} className="mr-2 size-4" />}
                <span>{opt.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          size={buttonSize}
          variant="ghost"
          onClick={onChevronClick}
          disabled={!hasChevronAction}
          aria-label={hasChevronAction ? dropdownAriaLabel : undefined}
          className={cn(
            "rounded-l-none border-0",
            toneStyle.hoverBg,
            !hasChevronAction && "pointer-events-none opacity-80",
          )}
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </Button>
      )}
    </ButtonGroup>
  );
}
