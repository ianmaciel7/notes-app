"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalePicker } from "@/hooks/use-locale-picker";

export function LocalePicker() {
  const { selectedLocale, pending, error, selectLocale, label, options } =
    useLocalePicker();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="locale-preference" className="text-sm font-medium">
        {label}
      </label>
      <Select
        value={selectedLocale}
        onValueChange={(value) => {
          if (typeof value === "string") {
            void selectLocale(value);
          }
        }}
        disabled={pending}
      >
        <SelectTrigger id="locale-preference" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
