// Every signed-in URL in one place. Kept free of Next.js imports so the proxy,
// server components, client components and tests can all use it.
//
// Workspaces: personal URLs below never change. When Clerk Organizations ship,
// org pages mirror this tree under /orgs/[orgSlug] (/orgs/acme/projects, ...)
// and clerkMiddleware's organizationSyncOptions activates the org from the
// URL. Editor URLs stay /projects/[projectId] because ids are globally unique;
// the editor switches to the project's org. Keep /orgs free for that.

export const routes = {
  /** Signed-in home. The proxy serves it from the internal /dashboard page. */
  home: "/",
  projects: "/projects",
  starredProjects: "/projects/starred",
  project: (projectId: string) =>
    `/projects/${encodeURIComponent(projectId)}` as const,
  settings: "/settings",
  accountSettings: "/settings/account",
  usageSettings: "/settings/usage",
  pricing: "/pricing",
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

/** The page the proxy rewrites "/" to for signed-in users. Never link to it. */
export const DASHBOARD_INTERNAL_PATH = "/dashboard";

/** Id of the element the skip link and post-navigation focus target. */
export const MAIN_CONTENT_ID = "main-content";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Project ids are UUIDs, so no static segment under /projects can clash. */
export function isProjectId(value: string): boolean {
  return UUID.test(value);
}

function trimTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function isActivePath(
  pathname: string,
  href: string,
  { includeChildren = false }: { includeChildren?: boolean } = {}
): boolean {
  const path = trimTrailingSlash(pathname);
  if (path === href) return true;
  return includeChildren && path.startsWith(`${href}/`);
}

/**
 * Where an old URL lives now, or null if the URL is already canonical.
 * Unrelated query params (utm_*, ref) are carried over.
 */
export function getLegacyRedirect(url: URL): URL | null {
  const { pathname, searchParams } = url;

  if (pathname === DASHBOARD_INTERNAL_PATH) {
    const next = new URL(url);
    next.pathname = routes.home;
    return next;
  }

  if (pathname === routes.projects && searchParams.has("filter")) {
    const next = new URL(url);
    next.pathname =
      searchParams.get("filter") === "starred"
        ? routes.starredProjects
        : routes.projects;
    next.searchParams.delete("filter");
    return next;
  }

  return null;
}
