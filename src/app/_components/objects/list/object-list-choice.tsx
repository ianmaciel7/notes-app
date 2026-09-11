import type { ElementType } from "react";
import { Button } from "@/components/ui/button";
import {
  CompactMenuIconFrame,
  CompactMenuItemText,
  sidebarContextMenuContentClass,
  sidebarContextMenuItemClass,
} from "@/components/ui/compact-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ObjectListChoiceOption<T extends string> = {
  value: T;
  label: string;
};

type ObjectListChoiceProps<T extends string> = {
  label: string;
  icon: ElementType;
  value: T;
  options: readonly ObjectListChoiceOption<T>[];
  onChange: (value: T) => void;
};

export function ObjectListChoice<T extends string>({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: ObjectListChoiceProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="ghost" size="icon-sm" aria-label={label} tooltip={label}>
            <Icon className="size-3.5" aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            const option = options.find((candidate) => candidate.value === next);
            if (option) onChange(option.value);
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className={sidebarContextMenuItemClass}
            >
              <CompactMenuIconFrame variant="ghost">
                <Icon aria-hidden="true" />
              </CompactMenuIconFrame>
              <CompactMenuItemText>{option.label}</CompactMenuItemText>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
