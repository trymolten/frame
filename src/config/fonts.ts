import { Instrument_Sans } from "next/font/google";

// Fallback for non-Apple devices; Apple devices render SF Pro via the
// system stack in --font-sans (see src/styles/globals.css).
export const displayFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});
