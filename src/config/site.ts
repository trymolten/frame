// Single source of truth for Frame's name, copy and brand colors. Used by
// metadata, generated icons and the marketing site.
export const siteConfig = {
  name: "Frame",
  legalName: "Frame AI",
  url: "https://useframe.vercel.app",
  tagline: "From a sentence to a running app.",
  description:
    "Frame turns a plain-language prompt into a working Next.js app, runs it in a live sandbox and keeps every version. Built for developers and for teams.",
} as const;

export const brandColors = {
  paper: "#FBFBFD",
  ink: "#1D1D1F",
  graphite: "#6E6E73",
  hairline: "#E5E5EA",
  cobalt: "#3A5BFF",
  black: "#000000",
} as const;
