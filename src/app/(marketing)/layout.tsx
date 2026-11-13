import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteMetadata, siteViewport } from "@/config/metadata";
import "@/styles/globals.css";
import { displayFont } from "@/config/fonts";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const viewport = siteViewport;
export const metadata = siteMetadata;

export default function MarketingRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          displayFont.variable,
          "theme-frame min-h-screen bg-background font-sans text-foreground antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
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
  );
}
