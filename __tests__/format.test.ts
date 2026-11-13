// Run with: npx tsx --test __tests__/*.test.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { describeCredits } from "@/modules/dashboard/lib/format";

const DAY = 24 * 60 * 60 * 1000;

describe("describeCredits", () => {
  it("reports the share of credits left", () => {
    const { percentLeft } = describeCredits({
      total: 4,
      remaining: 1,
      msBeforeReset: DAY,
    });
    assert.equal(percentLeft, 25);
  });

  it("treats a zero allowance as empty", () => {
    const { percentLeft } = describeCredits({
      total: 0,
      remaining: 0,
      msBeforeReset: -1,
    });
    assert.equal(percentLeft, 0);
  });

  it("says when credits come back", () => {
    const { resetLabel } = describeCredits({
      total: 2,
      remaining: 0,
      msBeforeReset: 12 * DAY,
    });
    assert.equal(resetLabel, "Resets in 12 days");
  });

  it("explains the window before any credit is spent", () => {
    const { resetLabel } = describeCredits({
      total: 2,
      remaining: 2,
      msBeforeReset: -1,
    });
    assert.equal(resetLabel, "Credits reset 30 days after first use");
  });
});
