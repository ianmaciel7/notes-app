export function localePath(locale: string, path: `/${string}`): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
