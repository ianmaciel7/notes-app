import type { CountryCode, CountryData } from "@firebase-oss/ui-core";
import {
  type CountrySelectorRef,
  useCountries,
  useDefaultCountry,
} from "@firebase-oss/ui-react";
import { useLocale } from "next-intl";
import {
  type Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

export function useCountrySelector(ref: Ref<CountrySelectorRef>) {
  const countries = useCountries();
  const locale = useLocale();
  const localizedCountries = useMemo(() => {
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });
    return countries.map((country) => ({
      ...country,
      name: displayNames.of(country.code.toUpperCase()) ?? country.name,
    }));
  }, [countries, locale]);
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

  return { countries: localizedCountries, selected, setCountry };
}
