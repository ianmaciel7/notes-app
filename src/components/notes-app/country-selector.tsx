"use client";

import type { CountryCode, CountryData } from "@firebase-oss/ui-core";
import {
  type CountrySelectorProps,
  type CountrySelectorRef,
  useCountries,
  useDefaultCountry,
} from "@firebase-oss/ui-react";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type { CountrySelectorRef };

export const CountrySelector = forwardRef<
  CountrySelectorRef,
  CountrySelectorProps
>((_props, ref) => {
  const countries = useCountries();
  const defaultCountry = useDefaultCountry();
  const [selected, setSelected] = useState<CountryData>(defaultCountry);

  const setCountry = useCallback(
    (code: CountryCode) => {
      const foundCountry =
        countries.find((country) => country.code === code) ?? defaultCountry;
      setSelected(foundCountry);
    },
    [countries, defaultCountry],
  );

  useImperativeHandle(
    ref,
    () => ({
      getCountry: () => selected,
      setCountry,
    }),
    [selected, setCountry],
  );

  return (
    <Select
      value={selected.code}
      onValueChange={(code) => setCountry(code as CountryCode)}
    >
      <SelectTrigger className="w-[120px]">
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
