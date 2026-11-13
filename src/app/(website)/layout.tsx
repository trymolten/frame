import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";

import { cn } from "@/lib/utils";
import { displayFont } from "@/config/fonts";
import { clerkProviderProps } from "@/config/clerk";
import { siteMetadata, siteViewport } from "@/config/metadata";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/header";

export const viewport = siteViewport;
export const metadata = siteMetadata;

export default function WebsiteRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider {...clerkProviderProps}>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={cn(displayFont.variable, "min-h-screen antialiased")}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
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
    </ClerkProvider>
  );
}
