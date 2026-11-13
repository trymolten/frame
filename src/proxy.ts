import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import {
  DASHBOARD_INTERNAL_PATH,
  getLegacyRedirect,
  routes,
} from "@/lib/routes";

// App routes that require a signed-in user. Everything else (marketing,
// policies, blog, pricing) stays public so visitors are never bounced to
// sign-in while browsing the website.
const isProtectedRoute = createRouteMatcher([
  `${DASHBOARD_INTERNAL_PATH}(.*)`,
  `${routes.projects}(.*)`,
  `${routes.settings}(.*)`,
]);

// Only the entry pages: Clerk's own sub-steps (sso-callback, verify, factor-*)
// must finish even if a session already exists mid-flow.
const isAuthEntryRoute = createRouteMatcher([routes.signIn, routes.signUp]);

export default clerkMiddleware(
  async (auth, req) => {
    // Old URLs move first, so a signed-out visitor is sent to sign-in with the
    // canonical URL as the return address.
    const legacy = getLegacyRedirect(req.nextUrl);
    if (legacy) {
      return NextResponse.redirect(legacy, 308);
    }

    const { userId } = await auth();

    if (userId && isAuthEntryRoute(req)) {
      return NextResponse.redirect(new URL(routes.home, req.url));
    }

    // Signed-in users get their home at the root URL, signed-out visitors get
    // the marketing homepage. A rewrite doesn't re-enter the proxy, so the
    // /dashboard redirect above never sees it.
    if (userId && req.nextUrl.pathname === routes.home) {
      return NextResponse.rewrite(new URL(DASHBOARD_INTERNAL_PATH, req.url));
    }

    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    signInUrl: routes.signIn,
    signUpUrl: routes.signUp,
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals, static files (unless found in search params) and
    // metadata files: root icons and social images, robots, sitemap and
    // manifest have no extension or one not listed below. Crawlers fetch them
    // without cookies, and through Clerk they'd get a handshake redirect
    // instead of the file. Only root-level images are skipped, so one under a
    // protected route still needs a session.
    "/((?!_next|(?:apple-)?icon(?:\\d+|-\\w+)?(?:/|$)|(?:opengraph|twitter)-image|robots\\.txt|sitemap\\.xml|manifest\\.json|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
