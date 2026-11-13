import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { getUsageStatus } from "@/lib/usage";

export const usageRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(({ ctx }) => getUsageStatus(ctx.auth)),
});
