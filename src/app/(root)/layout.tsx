import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { appMetadata, siteViewport } from "@/config/metadata";
import "@/styles/globals.css";
import { displayFont } from "@/config/fonts";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { auth } from "@clerk/nextjs/server";
import { TRPCReactProvider } from "@/trpc/client";
import { RouteFocus } from "@/components/route-focus";
import { clerkProviderProps } from "@/config/clerk";

export const viewport = siteViewport;
export const metadata = appMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, redirectToSignIn } = await auth();

  // Defence in depth: the proxy already protects these routes. This keeps the
  // return URL so users land back where they started after signing in.
  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <ClerkProvider {...clerkProviderProps}>
      <TRPCReactProvider>
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
              {children}
              <RouteFocus />
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
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
