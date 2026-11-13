import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { appMetadata, siteViewport } from "@/config/metadata";
import "@/styles/globals.css";
import { displayFont } from "@/config/fonts";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { clerkProviderProps } from "@/config/clerk";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthShell } from "@/modules/auth/components/auth-shell";

export const viewport = siteViewport;
export const metadata = appMetadata;

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
            displayFont.variable,
            "theme-brand min-h-screen bg-background font-sans antialiased"
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
