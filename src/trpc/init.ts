import { cache } from "react";
import superjson from "superjson";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";

export const createTRPCContext = cache(async () => {
  return { auth: await auth() };
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const { auth } = ctx;
  if (!auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  // Narrow the type only; Clerk's auth object carries methods like has().
  return next({ ctx: { ...ctx, auth: auth as AuthedContext["auth"] } });
});

export type AuthedContext = TRPCContext & {
  auth: TRPCContext["auth"] & { userId: string };
};

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
