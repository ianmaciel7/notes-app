import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { getAuthProxyRewrites } from "./src/lib/firebase/auth-proxy";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () =>
    getAuthProxyRewrites(process.env.NEXT_PUBLIC_FIREBASE_CONFIG),
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  typescript: {
    tsconfigPath: "tsconfig.check.json",
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
