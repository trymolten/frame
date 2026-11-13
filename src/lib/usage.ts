import "server-only";
import { TRPCError } from "@trpc/server";
import { RateLimiterPrisma, RateLimiterRes } from "rate-limiter-flexible";

import prisma from "@/lib/prisma";
import type { AuthedContext } from "@/trpc/init";
import {
  GENERATION_COST,
  PRO_USAGE_POINTS,
  FREE_USAGE_POINTS,
  FREE_USAGE_DURATION,
} from "@/constants/usage";

type Plan = "free" | "pro";

// One limiter per plan for the lifetime of the process. Each RateLimiterPrisma
// starts a self-rescheduling cleanup timer, so creating one per request leaks
// timers and multiplies cleanup queries as traffic grows.
const globalForUsage = globalThis as unknown as {
  usageLimiters?: Record<Plan, RateLimiterPrisma>;
};

const limiters =
  globalForUsage.usageLimiters ??
  (globalForUsage.usageLimiters = {
    free: new RateLimiterPrisma({
      storeClient: prisma,
      tableName: "Usage",
      duration: FREE_USAGE_DURATION,
      points: FREE_USAGE_POINTS,
    }),
    pro: new RateLimiterPrisma({
      storeClient: prisma,
      tableName: "Usage",
      duration: FREE_USAGE_DURATION,
      points: PRO_USAGE_POINTS,
    }),
  });

// Takes the auth that protectedProcedure already resolved for the request.
function getPlanContext({ userId, has }: AuthedContext["auth"]) {
  const plan: Plan = has({ plan: "pro" }) ? "pro" : "free";
  return { userId, plan, limiter: limiters[plan] };
}

/**
 * Spends one generation credit or throws a TRPCError the client can act on.
 * Returns a refund function so callers can give the credit back if the work
 * it paid for never got queued.
 */
export async function consumeCredits(auth: AuthedContext["auth"]) {
  const { userId, limiter } = getPlanContext(auth);

  try {
    await limiter.consume(userId, GENERATION_COST);
  } catch (error) {
    // rate-limiter-flexible rejects with a RateLimiterRes when out of points.
    if (error instanceof RateLimiterRes) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message:
          "You've used all your credits. Upgrade to Pro or wait for them to reset.",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Couldn't check your credits. Try again.",
      cause: error,
    });
  }

  return {
    refund: () => limiter.reward(userId, GENERATION_COST).catch(() => null),
  };
}

export async function getUsageStatus(auth: AuthedContext["auth"]) {
  const { userId, plan, limiter } = getPlanContext(auth);
  const total = plan === "pro" ? PRO_USAGE_POINTS : FREE_USAGE_POINTS;
  const result = await limiter.get(userId);

  return {
    plan,
    total,
    remaining: result ? result.remainingPoints : total,
    // -1 means nothing has been spent yet, so there is nothing to reset.
    msBeforeReset: result ? result.msBeforeNext : -1,
  };
}
