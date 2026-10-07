import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  typescript: {
    tsconfigPath: "tsconfig.check.json",
  },
};

export default nextConfig;
