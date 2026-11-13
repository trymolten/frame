// Run with: npx tsx --test __tests__/*.test.ts
import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { before, describe, it } from "node:test";

type Testing = typeof import("next/experimental/testing/server");
let doesMatch: Testing["unstable_doesMiddlewareMatch"];
let config: typeof import("@/proxy").config;

before(async () => {
  // Next's runtime provides this global, and Next and Clerk read it when
  // their modules load, so set it before importing either.
  Object.assign(globalThis, { AsyncLocalStorage });
  ({ unstable_doesMiddlewareMatch: doesMatch } =
    await import("next/experimental/testing/server"));
  ({ config } = await import("@/proxy"));
});

const runsProxy = (url: string) => doesMatch({ config, url });

describe("proxy matcher", () => {
  it("runs on app, auth and marketing pages", () => {
    for (const url of [
      "/",
      "/dashboard",
      "/projects",
      "/projects/starred",
      "/projects/3f2b8c1e-9d4a-4b7e-8f21-6c5d0a9e7b13",
      "/settings/account/security",
      "/sign-in",
      "/pricing",
      "/blog/launch",
      // Prefix look-alikes are still pages.
      "/icons",
      "/manifesto",
      // Only root-level images skip it, so one under a protected route
      // would still need a session.
      "/projects/3f2b8c1e-9d4a-4b7e-8f21-6c5d0a9e7b13/opengraph-image",
    ]) {
      assert.equal(runsProxy(url), true, url);
    }
  });

  it("runs on API routes", () => {
    for (const url of ["/api/trpc/projects.list", "/api/inngest", "/trpc/x"]) {
      assert.equal(runsProxy(url), true, url);
    }
  });

  // Crawlers and link previews fetch these without cookies; through Clerk
  // they'd get a dev handshake redirect instead of the file.
  it("skips metadata files and generated images", () => {
    for (const url of [
      "/icon",
      "/icon1",
      "/icon-a1b2c3",
      "/icon/small",
      "/apple-icon",
      "/apple-icon-a1b2c3",
      "/opengraph-image",
      "/opengraph-image-a1b2c3",
      "/twitter-image-a1b2c3",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/manifest.json",
      "/manifest.webmanifest",
    ]) {
      assert.equal(runsProxy(url), false, url);
    }
  });
});
