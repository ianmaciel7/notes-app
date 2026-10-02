"use client";

import type { CountryCode, CountryData } from "@firebase-oss/ui-core";
import {
  type CountrySelectorProps,
  type CountrySelectorRef,
  useCountries,
  useDefaultCountry,
} from "@firebase-oss/ui-react";
import { useImperativeHandle, useState, type Ref } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CountrySelectorComponentProps = Omit<CountrySelectorProps, "ref"> & {
  ref?: Ref<CountrySelectorRef>;
};

function findCountry(countries: CountryData[], code: CountryCode) {
  return countries.find((country) => country.code === code);
}

function CountrySelector({ ref }: CountrySelectorComponentProps) {
  const countries = useCountries();
  const defaultCountry = useDefaultCountry();
  const [selected, setSelected] = useState<CountryData>(defaultCountry);

  useImperativeHandle(
    ref,
    () => ({
      getCountry: () => selected,
      setCountry: (code) => {
        const country = findCountry(countries, code);
        if (country) setSelected(country);
      },
    }),
    [countries, selected],
  );

  return (
    <Select
      value={selected.code}
      onValueChange={(code) => {
        if (!code) return;
        const country = findCountry(countries, code);
        if (country) setSelected(country);
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          {selected.emoji} {selected.dialCode}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.dialCode} ({country.name})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { CountrySelector, type CountrySelectorRef };
