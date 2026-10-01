"use client";

import type { CountryCode, CountryData } from "@firebase-oss/ui-core";
import {
  type CountrySelectorProps,
  type CountrySelectorRef,
  useCountries,
  useDefaultCountry,
} from "@firebase-oss/ui-react";
import { type Ref, useImperativeHandle, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type { CountrySelectorRef };

export interface CountrySelectProps extends Omit<CountrySelectorProps, "ref"> {
  ref?: Ref<CountrySelectorRef>;
}

export function CountrySelect({ ref }: CountrySelectProps) {
  const countries = useCountries();
  const defaultCountry = useDefaultCountry();
  const [selected, setSelected] = useState<CountryData>(defaultCountry);

  useImperativeHandle(
    ref,
    () => ({
      getCountry: () => selected,
      setCountry: (code: CountryCode) => {
        const foundCountry = countries.find((country) => country.code === code);
        if (foundCountry) setSelected(foundCountry);
      },
    }),
    [countries, selected],
  );

  return (
    <Select
      value={selected.code}
      onValueChange={(code) => {
        if (code) {
          const foundCountry = countries.find(
            (country) => country.code === code,
          );
          if (foundCountry) setSelected(foundCountry);
        }
      }}
    >
      <SelectTrigger className="w-30">
        <SelectValue>
          {selected.code} {selected.dialCode}
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
}
