import type { CountryCode, CountryData } from "@firebase-oss/ui-core";
import {
  type CountrySelectorRef,
  useCountries,
  useDefaultCountry,
} from "@firebase-oss/ui-react";
import { type Ref, useCallback, useImperativeHandle, useState } from "react";

export function useCountrySelector(ref: Ref<CountrySelectorRef>) {
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

  return { countries, selected, setCountry };
}
