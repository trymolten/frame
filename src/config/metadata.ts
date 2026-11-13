import type { Metadata, Viewport } from "next";

import { brandColors, siteConfig } from "@/config/site";

// Icons and social images come from the file conventions in src/app
// (icon.tsx, apple-icon.tsx, opengraph-image.tsx), so they are not listed here.

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: brandColors.paper },
    { media: "(prefers-color-scheme: dark)", color: brandColors.black },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name}: ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  keywords: [
    "AI app builder",
    "Next.js",
    "code generation",
    "live sandbox",
    "developer tools",
    "team workspaces",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
};

// Signed-in app and auth pages: same identity, but kept out of search results.
export const appMetadata: Metadata = {
  ...siteMetadata,
  robots: { index: false, follow: false },
};
