"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes renders an inline <script> that applies the saved theme before
// first paint. That only matters in the server HTML. When React creates the
// script in the browser instead (e.g. a client-rendered not-found or error
// page), React 19 warns "Encountered a script tag while rendering React
// component", and it would never run anyway. Marking the browser-created copy
// as a data block (text/plain) silences that without changing behaviour;
// next-themes sets suppressHydrationWarning on the script, so the differing
// type doesn't cause a hydration mismatch.
const browserScriptProps =
  typeof window === "undefined" ? undefined : { type: "text/plain" };

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider scriptProps={browserScriptProps} {...props}>
      {children}
    </NextThemesProvider>
  );
}
