// Single source of truth for Molten's name, copy and brand colors. Used by
// metadata, generated icons and the marketing site.

// Used until NEXT_PUBLIC_APP_URL is set for the deployment.
const FALLBACK_URL = "https://trymolten.ai";

/** Accepts "example.com" or "https://example.com". */
export function normalizeUrl(value: string) {
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export const siteConfig = {
  name: "Molten",
  legalName: "Molten",
  url: normalizeUrl(process.env.NEXT_PUBLIC_APP_URL || FALLBACK_URL),
  tagline: "From a sentence to a running app.",
  description:
    "Molten turns a plain-language prompt into a working Next.js app, runs it in a live sandbox and keeps every version. Built for developers and for teams.",
} as const;

export const brandColors = {
  paper: "#FBFBFD",
  ink: "#1D1D1F",
  graphite: "#6E6E73",
  hairline: "#E5E5EA",
  cobalt: "#3A5BFF",
  black: "#000000",
} as const;
