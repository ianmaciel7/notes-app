import { ChevronDown } from "lucide-react";
import { ObjectIcon } from "@/components/objects/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ObjectIconName, ObjectIconTone } from "@/lib/space-object-types";
import { cn } from "@/lib/utils";

export interface ObjectTypeSplitChipOption {
  id: string;
  label: string;
  icon?: ObjectIconName | (string & {});
  onClick?: () => void;
}

export interface ObjectTypeSplitChipProps {
  /** The icon identifier registered in objectIconRegistry (e.g., 'page', 'book', 'task') */
  iconType?: ObjectIconName | (string & {});
  /** The displayed text label (e.g. 'PÁgina') */
  label: string;
  /** The color tone key for styling */
  tone?: ObjectIconTone;
  /** Callback when the main label/icon area is clicked */
  onLabelClick?: () => void;
  /** Dropdown menu options when clicking the disclosure chevron */
  options?: ObjectTypeSplitChipOption[];
  /** Optional custom dropdown trigger callback */
  onChevronClick?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS class names */
  className?: string;
  /** Accessible label for the dropdown trigger */
  dropdownAriaLabel?: string;
}

interface ToneStyle {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  divider: string;
}

// Complete tone color mappings for all 19 ObjectIconTone values
const toneStyles: Record<ObjectIconTone, ToneStyle> = {
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    hoverBg: "hover:bg-amber-500/20 dark:hover:bg-amber-500/30",
    divider: "border-amber-300/80 dark:border-amber-700/80",
  },
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hoverBg: "hover:bg-blue-500/20 dark:hover:bg-blue-500/30",
    divider: "border-blue-300/80 dark:border-blue-700/80",
  },
  cyan: {
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
    hoverBg: "hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30",
    divider: "border-cyan-300/80 dark:border-cyan-700/80",
  },
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    hoverBg: "hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30",
    divider: "border-emerald-300/80 dark:border-emerald-700/80",
  },
  fuchsia: {
    bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-200 dark:border-fuchsia-800",
    hoverBg: "hover:bg-fuchsia-500/20 dark:hover:bg-fuchsia-500/30",
    divider: "border-fuchsia-300/80 dark:border-fuchsia-700/80",
  },
  gray: {
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    hoverBg: "hover:bg-slate-500/20 dark:hover:bg-slate-500/30",
    divider: "border-slate-300/80 dark:border-slate-700/80",
  },
  green: {
    bg: "bg-green-500/10 dark:bg-green-500/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    hoverBg: "hover:bg-green-500/20 dark:hover:bg-green-500/30",
    divider: "border-green-300/80 dark:border-green-700/80",
  },
  indigo: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    hoverBg: "hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30",
    divider: "border-indigo-300/80 dark:border-indigo-700/80",
  },
  lime: {
    bg: "bg-lime-500/10 dark:bg-lime-500/20",
    text: "text-lime-600 dark:text-lime-400",
    border: "border-lime-200 dark:border-lime-800",
    hoverBg: "hover:bg-lime-500/20 dark:hover:bg-lime-500/30",
    divider: "border-lime-300/80 dark:border-lime-700/80",
  },
  neutral: {
    bg: "bg-muted/80",
    text: "text-foreground",
    border: "border-border",
    hoverBg: "hover:bg-muted",
    divider: "border-border",
  },
  orange: {
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    hoverBg: "hover:bg-orange-500/20 dark:hover:bg-orange-500/30",
    divider: "border-orange-300/80 dark:border-orange-700/80",
  },
  pink: {
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
    hoverBg: "hover:bg-pink-500/20 dark:hover:bg-pink-500/30",
    divider: "border-pink-300/80 dark:border-pink-700/80",
  },
  purple: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    hoverBg: "hover:bg-purple-500/20 dark:hover:bg-purple-500/30",
    divider: "border-purple-300/80 dark:border-purple-700/80",
  },
  red: {
    bg: "bg-red-500/10 dark:bg-red-500/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    hoverBg: "hover:bg-red-500/20 dark:hover:bg-red-500/30",
    divider: "border-red-300/80 dark:border-red-700/80",
  },
  rose: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    hoverBg: "hover:bg-rose-500/20 dark:hover:bg-rose-500/30",
    divider: "border-rose-300/80 dark:border-rose-700/80",
  },
  sky: {
    bg: "bg-sky-500/10 dark:bg-sky-500/20",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-800",
    hoverBg: "hover:bg-sky-500/20 dark:hover:bg-sky-500/30",
    divider: "border-sky-300/80 dark:border-sky-700/80",
  },
  teal: {
    bg: "bg-teal-500/10 dark:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800",
    hoverBg: "hover:bg-teal-500/20 dark:hover:bg-teal-500/30",
    divider: "border-teal-300/80 dark:border-teal-700/80",
  },
  violet: {
    bg: "bg-violet-500/10 dark:bg-violet-500/20",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    hoverBg: "hover:bg-violet-500/20 dark:hover:bg-violet-500/30",
    divider: "border-violet-300/80 dark:border-violet-700/80",
  },
  yellow: {
    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    hoverBg: "hover:bg-yellow-500/20 dark:hover:bg-yellow-500/30",
    divider: "bordey-yellow-300/80 dark:border-yellow-700/80",
  },
};

export function ObjectTypeSplitChip({
  iconType = "page",
  label,
  tone = "blue",
  onLabelClick,
  options,
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Opções do tipo de objeto",
}: ObjectTypeSplitChipProps) {
  const toneStyle = toneStyles[tone] || toneStyles.blue;

  const sizeClasses = {
    sm: "h-6 text-xs rounded-md",
    md: "h-7 text-xs rounded-lg",
    lg: "h-8 text-sm rounded-lg",
  }[size];

  const leftPadding = {
    sm: "pl-2 pr-1 gap-1",
    md: "pl-2.5 pr-1.5 gap-1.5",
    lg: "pl-3 pr-2 gap-2",
  }[size];

  const rightPadding = {
    sm: "pl-1 pr-2",
    md: "pl-1.5 pr-2.5",
    lg: "pl-2 pr-3",
  }[size];

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }[size];

  const hasOptions = options && options.length > 0;
  const hasChevronAction = Boolean(onChevronClick);

  return (
    // biome-ignore lint/a11y/useSemanticElements: split chip group container
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flix items-center select-none font-medium border transition-colors",
        toneStyle.bg,
        toneStyle.text,
        toneStyle.border,
        sizeClasses,
        className,
      )}
    >
      {onLabelClick ? (
        <button
          type="button"
          onClick={onLabelClick}
          className={cn(
            "h-full inline-flix items-center rounded-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-colors",
            leftPadding,
            toneStyle.hoverBg,
          )}
        >
          <ObjectIcon type={iconType} className={iconSizes} />
          <span>{label}</span>
        </button>
      ) : (
        <span
          className={cn("h-full inline-flex items-center rounded-l cursor-default", leftPadding)}
        >
          <ObjectIcon type={iconType} className={iconSizes} />
          <span>{label}</span>
        </span>
      )}

      <span
        aria-hidden="true"
        className={cn("h-3.5 border-l my-auto shrink-0", toneStyle.divider)}
      />

      {hasOptions ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "h-full inline-flex items-center justify-center rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-colors",
              rightPadding,
              toneStyle.hoverBg,
            )}
            aria-label={dropdownAriaLabel}
          >
            <ChevronDown className={iconSizes} aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {options.map((opt) => (
              <DropdownMenuItem key={opt.id} onClick={opt.onClick}>
                {opt.icon && <ObjectIcon type={opt.icon} className="mr-2 h-4 w-4" />}
                <span>{opt.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : hasChevronAction ? (
        <button
          type="button"
          onClick={onChevronClick}
          className={cn(
            "h-full inline-flex items-center justify-center rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-colors",
            rightPadding,
            toneStyle.hoverBg,
          )}
          aria-label={dropdownAriaLabel}
        >
          <ChevronDown className={iconSizes} aria-hidden="true" />
        </button>
      ) : (
        <span
          className={cn(
            "h-full inline-flex items-center justify-center rounded-r cursor-default opacity-80",
            rightPadding,
          )}
          aria-hidden="true"
        >
          <ChevronDown className={iconSizes} />
        </span>
      )}
    </div>
  );
}
