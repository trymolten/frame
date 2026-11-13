import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { consumeCredits } from "@/lib/usage";
import { inngest } from "@/lib/inngest/client";
import { markGenerationFailed } from "@/modules/projects/server/status";

export const messagesRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId,
          },
        },
        // createdAt is the conversation order and is indexed with projectId.
        orderBy: {
          createdAt: "asc",
        },
        include: {
          fragment: true,
        },
      });

      return messages;
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .trim()
          .min(1, { message: "Value is required" })
          .max(10000, { message: "Value is too long" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
        select: { id: true },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const { refund } = await consumeCredits(ctx.auth);

      let saved = false;
      try {
        const [createdMessage] = await prisma.$transaction([
          prisma.message.create({
            data: {
              projectId: existingProject.id,
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          }),
          prisma.project.update({
            where: { id: existingProject.id },
            data: { status: "GENERATING" },
          }),
        ]);
        saved = true;

        await inngest.send({
          name: "code-agent/run",
          data: {
            value: input.value,
            projectId: existingProject.id,
            userId: ctx.auth.userId,
          },
        });

        return createdMessage;
      } catch (error) {
        await refund();
        if (saved) {
          await markGenerationFailed(existingProject.id);
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't send your message. Try again.",
          cause: error,
        });
      }
    }),
});
