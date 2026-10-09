"use client";

import type { CountryCode } from "@firebase-oss/ui-core";
import type {
  CountrySelectorProps,
  CountrySelectorRef,
} from "@firebase-oss/ui-react";
import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountrySelector } from "@/hooks/use-country-selector";

export type { CountrySelectorRef };

export const CountrySelector = forwardRef<
  CountrySelectorRef,
  CountrySelectorProps
>((_props, ref) => {
  const { countries, selected, setCountry } = useCountrySelector(ref);

  return (
    <Select
      value={selected.code}
      onValueChange={(code) => setCountry(code as CountryCode)}
    >
      <SelectTrigger className="w-30">
        <SelectValue>
          {selected.emoji} {selected.dialCode}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.dialCode} ({country.name})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});

CountrySelector.displayName = "CountrySelector";
