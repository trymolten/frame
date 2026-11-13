import Link from "next/link";
import type { Metadata } from "next";
import "@/styles/globals.css";

import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/status-view";
import { ThemeProvider } from "@/components/theme/theme-provider";

// Rendered for any URL no route matches. There is no app/layout.tsx (each
// route group has its own root layout), so this page brings its own document.
// Next adds the noindex tag to 404 responses itself.
export const metadata: Metadata = {
  title: "Page not found | Frame AI",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="theme-frame min-h-svh bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-svh">
            <StatusView
              title="This page doesn't exist"
              description="Check the address for typos, or start again from the home page."
            >
              <Button asChild className="rounded-full px-5">
                <Link href={routes.home}>Go to home</Link>
              </Button>
            </StatusView>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
