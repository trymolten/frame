import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// App routes that require a signed-in user. Everything else (marketing,
// policies, blog, pricing) stays public so visitors are never bounced to
// sign-in while browsing the website.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/projects(.*)",
  "/settings(.*)",
]);

// Only the entry pages: Clerk's own sub-steps (sso-callback, verify, factor-*)
// must finish even if a session already exists mid-flow.
const isAuthEntryRoute = createRouteMatcher(["/sign-in", "/sign-up"]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId } = await auth();
    const { pathname } = req.nextUrl;

    if (userId && isAuthEntryRoute(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Like Lovable: signed-in users get their dashboard at the root URL,
    // signed-out visitors get the marketing homepage.
    if (userId && pathname === "/") {
      return NextResponse.rewrite(new URL("/dashboard", req.url));
    }

    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
