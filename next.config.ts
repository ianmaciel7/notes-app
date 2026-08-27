import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the development status indicator from covering the mobile navigation trigger.
  // Compile and runtime errors are still surfaced by Next.js.
  devIndicators: false,
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
