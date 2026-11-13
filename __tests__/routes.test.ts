// Run with: npx tsx --test __tests__/*.test.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getLegacyRedirect,
  isActivePath,
  isProjectId,
  routes,
} from "@/lib/routes";

const ID = "3f2b8c1e-9d4a-4b7e-8f21-6c5d0a9e7b13";
const at = (path: string) => new URL(path, "https://molten.test");

describe("routes", () => {
  it("keeps the signed-in home at the root URL", () => {
    assert.equal(routes.home, "/");
  });

  it("gives starred projects a path of their own", () => {
    assert.equal(routes.projects, "/projects");
    assert.equal(routes.starredProjects, "/projects/starred");
  });

  it("builds editor URLs from the project id", () => {
    assert.equal(routes.project(ID), `/projects/${ID}`);
  });

  it("escapes ids so they cannot add path segments", () => {
    assert.equal(routes.project("a/b?c"), "/projects/a%2Fb%3Fc");
  });

  it("puts every settings page under /settings", () => {
    assert.equal(routes.settings, "/settings");
    assert.equal(routes.accountSettings, "/settings/account");
    assert.equal(routes.usageSettings, "/settings/usage");
  });

  it("links to the marketing site at /home, which signed-in users can reach", () => {
    assert.equal(routes.website, "/home");
    assert.equal(getLegacyRedirect(at(routes.website)), null);
  });
});

describe("isProjectId", () => {
  it("accepts a UUID", () => {
    assert.equal(isProjectId(ID), true);
  });

  it("accepts an upper-case UUID", () => {
    assert.equal(isProjectId(ID.toUpperCase()), true);
  });

  it("rejects static sibling segments like starred", () => {
    assert.equal(isProjectId("starred"), false);
  });

  it("rejects ids with extra characters", () => {
    assert.equal(isProjectId(`${ID}x`), false);
    assert.equal(isProjectId(` ${ID}`), false);
  });

  it("rejects an empty string", () => {
    assert.equal(isProjectId(""), false);
  });
});

describe("isActivePath", () => {
  it("matches the exact page", () => {
    assert.equal(isActivePath("/projects", "/projects"), true);
  });

  it("does not light up a parent for a child page by default", () => {
    assert.equal(isActivePath("/projects/starred", "/projects"), false);
  });

  it("matches child pages when asked to", () => {
    assert.equal(
      isActivePath("/settings/account/security", "/settings", {
        includeChildren: true,
      }),
      true
    );
  });

  it("does not treat a shared prefix as a child", () => {
    assert.equal(
      isActivePath("/settings-old", "/settings", { includeChildren: true }),
      false
    );
  });

  it("ignores a trailing slash", () => {
    assert.equal(isActivePath("/projects/", "/projects"), true);
  });
});

describe("getLegacyRedirect", () => {
  it("sends /dashboard to the root URL", () => {
    assert.equal(getLegacyRedirect(at("/dashboard"))?.href, at("/").href);
  });

  it("keeps unrelated query params on /dashboard", () => {
    assert.equal(
      getLegacyRedirect(at("/dashboard?ref=email"))?.href,
      at("/?ref=email").href
    );
  });

  it("sends the old starred filter to /projects/starred", () => {
    assert.equal(
      getLegacyRedirect(at("/projects?filter=starred"))?.href,
      at("/projects/starred").href
    );
  });

  it("drops any other filter value", () => {
    assert.equal(
      getLegacyRedirect(at("/projects?filter=all"))?.href,
      at("/projects").href
    );
  });

  it("keeps other params when it drops the filter", () => {
    assert.equal(
      getLegacyRedirect(at("/projects?filter=starred&utm_source=mail"))?.href,
      at("/projects/starred?utm_source=mail").href
    );
  });

  it("leaves canonical URLs alone", () => {
    for (const path of [
      "/",
      "/projects",
      "/projects/starred",
      `/projects/${ID}`,
      `/projects/${ID}?filter=starred`,
      "/settings/account",
      "/dashboards",
    ]) {
      assert.equal(getLegacyRedirect(at(path)), null, path);
    }
  });
});
