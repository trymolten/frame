import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // The app has one root layout per route group and none at app/, so
    // unmatched URLs need app/global-not-found.tsx to render a real 404.
    globalNotFound: true,
  },
};

export default nextConfig;
