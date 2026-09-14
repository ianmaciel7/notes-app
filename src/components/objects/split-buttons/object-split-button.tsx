import { ChevronDown, Plus } from "lucide-react";
import { ObjectIcon } from "@/components/objects/icons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ObjectIconName } from "@/lib/space-object-types";
import { cn } from "@/lib/utils";

export interface ObjectSplitButtonOption {
  id: string;
  label: string;
  icon?: ObjectIconName | (string & {});
  onClick?: () => void;
}

export interface ObjectSplitButtonProps {
  /** Label for the primary button (default: "Novo") */
  label?: string;
  /** Primary button icon name or Lucide icon component */
  icon?: ObjectIconName | (string & {});
  /** Callback when the primary action button is clicked */
  onPrimaryClick?: () => void;
  /** Options list for the dropdown menu */
  options?: ObjectSplitButtonOption[];
  /** Button visual variant */
  variant?: "default" | "secondary" | "outline" | "ghost";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Accessible label for the secondary dropdown trigger */
  dropdownAriaLabel?: string;
}

const defaultOptions: ObjectSplitButtonOption[] = [
  { id: "import", label: "Importar arquivos", icon: "file" },
  { id: "search", label: "Buscar em todas as notas", icon: "query" },
  { id: "template", label: "Criar com modelo", icon: "idea" },
];

export function ObjectSplitButton({
  label = "Novo",
  icon,
  onPrimaryClick,
  options = defaultOptions,
  variant = "default",
  size = "md",
  disabled = false,
  className,
  dropdownAriaLabel = "Opções secundárias de criação",
}: ObjectSplitButtonProps) {
  const sizeClasses = {
    sm: "h-7 text-xs px-2.5",
    md: "h-8 text-xs px-3",
    lg: "h-9 text-sm px-3.5",
  }[size];

  const triggerPadding = {
    sm: "px-1.5",
    md: "px-2",
    lg: "px-2.5",
  }[size];

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-4.5 w-4.5",
  }[size];

  return (
    <ButtonGroup className={cn("inline-flex items-center", className)}>
      <Button
        variant={variant}
        disabled={disabled}
        onClick={onPrimaryClick}
        className={cn(
          "font-medium border-r border-r-primary-foreground/20 dark:border-r-background/20",
          sizeClasses,
        )}
      >
        {icon ? (
          <ObjectIcon type={icon} className={cn("mr-1.5", iconSizes)} />
        ) : (
          <Plus className={cn("mr-1.5", iconSizes)} />
        )}
        <span>{label}</span>
      </Button>

      {options && options.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={disabled}
            className={cn(
              "inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-colors",
              sizeClasses,
              triggerPadding,
              variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
              variant === "secondary" &&
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              variant === "outline" &&
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
            )}
            aria-label={dropdownAriaLabel}
          >
            <ChevronDown className={iconSizes} aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {options.map((opt, index) => (
              <div key={opt.id}>
                {index > 0 && index === options.length - 1 && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={opt.onClick}>
                  {opt.icon && (
                    <ObjectIcon type={opt.icon} className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{opt.label}</span>
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </ButtonGroup>
  );
}
