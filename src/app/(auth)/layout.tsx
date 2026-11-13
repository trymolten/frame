import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { clerkProviderProps } from "@/config/clerk";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthShell } from "@/modules/auth/components/auth-shell";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff" },
    { media: "(prefers-color-scheme: dark)", color: "#000" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://useframe.vercel.app"),
  title: {
    template: "%s | Frame AI - Build Interactive Web Experiences",
    default: "Frame AI - Build Interactive Web Experiences",
  },
  description:
    "Frame AI is a powerful platform for creating, building, and sharing interactive web experiences and code-based frames with AI-powered assistance. Build, iterate, and deploy interactive projects with ease.",
  applicationName: "Frame AI - Interactive Web Platform",
  authors: [
    { name: "Frame AI Team", url: "https://useframe.vercel.app/about" },
  ],
  generator: "Frame AI Platform using Next.js 16, tRPC, and Supabase and Clerk",
  keywords: [
    "Frame AI",
    "Interactive Web",
    "Code Frames",
    "Web Development",
    "AI Coding Assistant",
    "Code Interpreter",
    "Sandbox Environment",
    "Web Projects",
    "Interactive Experiences",
    "Code Sharing",
    "Web Builder",
    "AI Development",
    "Code Playground",
    "Web Frameworks",
    "Interactive Design",
    "Frame Platform",
  ],
  referrer: "no-referrer-when-downgrade",
  creator: "Frame AI",
  publisher: "Frame AI Labs",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      nocache: false,
      notranslate: false,
      indexifembedded: true,
      nositelinkssearchbox: false,
      unavailable_after: undefined,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://useframe.vercel.app",
    languages: {
      "en-US": "https://useframe.vercel.app/en-US",
      "es-ES": "https://useframe.vercel.app/es-ES",
      "fr-FR": "https://useframe.vercel.app/fr-FR",
    },
    media: {
      "(max-width: 600px)": "https://useframe.vercel.app",
    },
    types: {
      "application/rss+xml": "https://useframe.vercel.app/rss.xml",
    },
  },
  icons: {
    icon: [
      { url: "/brand/icon0.svg", type: "image/svg+xml", rel: "icon" },
      { url: "/brand/icon1.png", type: "image/png", rel: "icon" },
      {
        url: "/brand/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
        rel: "icon",
      },
      {
        url: "/brand/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
        rel: "icon",
      },
      {
        url: "/brand/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
        rel: "icon",
      },
    ],
    shortcut: [
      {
        url: "/brand/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
        rel: "shortcut icon",
      },
    ],
    apple: [
      {
        url: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        rel: "apple-touch-icon",
      },
    ],
    other: [
      {
        url: "/brand/favicon.ico",
        type: "image/x-icon",
        rel: "icon",
      },
    ],
  },
  // manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    determiner: "auto",
    locale: "en_US",
    alternateLocale: ["en_GB", "es_ES", "fr_FR"],
    url: "https://useframe.vercel.app",
    siteName: "Frame AI - Build Interactive Web Experiences",
    title: "Frame AI - Build Interactive Web Experiences",
    description:
      "Frame AI is a powerful platform for creating, building, and sharing interactive web experiences and code-based frames with AI-powered assistance. Build, iterate, and deploy interactive projects with ease.",
    // emails: ["support@useframe.vercel.app"],
    // phoneNumbers: ["+1-800-123-4567"],
    videos: [
      {
        url: "https://useframe.vercel.app/assets/frame-ai-demo.mp4",
        secureUrl: "https://useframe.vercel.app/demo.mp4",
        type: "video/mp4",
        width: 1280,
        height: 720,
      },
    ],
    audio: [
      {
        url: "https://useframe.vercel.app/assets/frame-ai-intro.mp3",
        type: "audio/mpeg",
      },
    ],
    images: [
      {
        url: "/brand/logo.png",
        width: 1200,
        height: 630,
        alt: "Frame AI Logo",
      },
      {
        url: "/brand/social-card.png",
        width: 1200,
        height: 600,
        alt: "Frame AI - Interactive Web Platform",
      },
    ],
    countryName: "India",
    ttl: 86400,
  },
  twitter: {
    card: "summary_large_image",
    site: "@frame_ai",
    siteId: "1234567890",
    creator: "@frame_ai",
    creatorId: "1234567890",
    title: "Frame AI - Build Interactive Web Experiences",
    description:
      "Create, build, and share interactive web experiences and code-based frames with AI-powered assistance. Build, iterate, and deploy interactive projects with ease.",
    images: [
      {
        url: "https://useframe.vercel.app/brand/social-card.png",
        alt: "Frame AI - Interactive Web Platform",
        secureUrl: "https://useframe.vercel.app/social-card.png",
        type: "image/png",
        width: 1200,
        height: 600,
      },
      {
        url: "https://useframe.vercel.app/brand/logo-twitter.png",
        alt: "Frame AI Logo",
        type: "image/png",
        width: 600,
        height: 600,
      },
    ],
    // (Optional) Player card for embedding a short demo video
    // card: "player",
    // players: [
    //   {
    //     playerUrl: "https://www.useframe.vercel.app/embed/demo-player.html",
    //     streamUrl: "https://cdn.useframe.vercel.app/demo.mp4",
    //     width: 1280,
    //     height: 720,
    //   },
    // ],
  },
  // facebook: {},
  // verification: {},
  appleWebApp: {
    capable: true,
    title: "Frame AI",
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/brand/apple-splash-2048x2732.png",
        media: "(device-width: 1024px)",
      },
      {
        url: "/brand/apple-splash-1668x2224.png",
        media: "(device-width: 834px)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  // itunes: {
  //   appId: "123456789",
  //   appArgument: "https://www.useframe.vercel.app",
  // },
  appLinks: {
    // ios: {
    //   url: "useframe://home",
    //   app_store_id: "123456789",
    //   app_name: "Frame AI",
    // },
    // android: {
    //   package: "com.useframe.app",
    //   url: "intent://home#Intent;scheme=useframe;package=com.useframe.app;end",
    //   class: "com.useframe.MainActivity",
    //   app_name: "Frame AI",
    // },
    // web: {
    //   url: "https://www.useframe.vercel.app",
    //   should_fallback: true,
    // },
  },
};

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider {...clerkProviderProps}>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={cn(
            instrumentSans.variable,
            "theme-frame min-h-screen bg-background font-sans antialiased"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthShell>{children}</AuthShell>
            <Toaster />
          </ThemeProvider>
          {process.env.NODE_ENV === "production" && (
            <>
              <SpeedInsights />
              <Analytics />
            </>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
