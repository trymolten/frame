import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { consumeCredits } from "@/lib/usage";
import { inngest } from "@/lib/inngest/client";
import { Prisma } from "@/generated/prisma/client";

const projectIdSchema = z
  .string()
  .min(1, { message: "Project ID is required" });

// Only the columns a project card needs; keeps list payloads small.
const projectCardSelect = {
  id: true,
  name: true,
  starred: true,
  visibility: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  lastOpenedAt: true,
} satisfies Prisma.ProjectSelect;

const listInputSchema = z.object({
  cursor: z.string().nullish(),
  limit: z.number().int().min(1).max(50).default(24),
  filter: z.enum(["all", "starred", "recent"]).default("all"),
  sort: z.enum(["updated", "created", "name"]).default("updated"),
  search: z.string().trim().max(100).optional(),
});

function orderByFor(
  input: z.infer<typeof listInputSchema>
): Prisma.ProjectOrderByWithRelationInput[] {
  if (input.filter === "recent") {
    return [{ lastOpenedAt: "desc" }, { id: "desc" }];
  }
  switch (input.sort) {
    case "created":
      return [{ createdAt: "desc" }, { id: "desc" }];
    case "name":
      return [{ name: "asc" }, { id: "asc" }];
    default:
      return [{ updatedAt: "desc" }, { id: "desc" }];
  }
}

export const projectsRouter = createTRPCRouter({
  getProjectById: protectedProcedure
    .input(z.object({ id: projectIdSchema }))
    .query(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  // Cursor-paginated so the dashboard stays fast no matter how many
  // projects a user has.
  list: protectedProcedure
    .input(listInputSchema)
    .query(async ({ input, ctx }) => {
      const where: Prisma.ProjectWhereInput = {
        userId: ctx.auth.userId,
        ...(input.filter === "starred" && { starred: true }),
        ...(input.search && {
          name: { contains: input.search, mode: "insensitive" },
        }),
      };

      const items = await prisma.project.findMany({
        where,
        select: projectCardSelect,
        orderBy: orderByFor(input),
        take: input.limit + 1,
        ...(input.cursor && { cursor: { id: input.cursor }, skip: 1 }),
      });

      // The extra row only signals another page. The cursor is the last row
      // returned; the next query skips past it (skip: 1).
      let nextCursor: string | null = null;
      if (items.length > input.limit) {
        items.pop();
        nextCursor = items[items.length - 1].id;
      }

      return { items, nextCursor };
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .trim()
          .min(1, { message: "Describe what you want to build" })
          .max(10000, { message: "Value is too long" }),
        visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { refund } = await consumeCredits(ctx.auth);

      let projectId: string | null = null;
      try {
        const createdProject = await prisma.project.create({
          data: {
            userId: ctx.auth.userId,
            name: generateSlug(2, { format: "kebab" }),
            visibility: input.visibility,
            status: "GENERATING",
            lastOpenedAt: new Date(),
            messages: {
              create: {
                content: input.value,
                role: "USER",
                type: "RESULT",
              },
            },
          },
          select: projectCardSelect,
        });
        projectId = createdProject.id;

        await inngest.send({
          name: "code-agent/run",
          data: {
            value: input.value,
            projectId: createdProject.id,
            userId: ctx.auth.userId,
          },
        });

        return createdProject;
      } catch (error) {
        // Nothing was queued, so undo everything: the credit and the empty
        // project. The prompt stays in the composer for a retry.
        await refund();
        if (projectId) {
          await prisma.project
            .delete({ where: { id: projectId } })
            .catch(() => null);
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't start building your project. Try again.",
          cause: error,
        });
      }
    }),

  rename: protectedProcedure
    .input(
      z.object({
        id: projectIdSchema,
        name: z
          .string()
          .trim()
          .min(1, { message: "Name is required" })
          .max(80, { message: "Name is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { count } = await prisma.project.updateMany({
        where: { id: input.id, userId: ctx.auth.userId },
        data: { name: input.name },
      });
      assertFound(count);
      return { id: input.id, name: input.name };
    }),

  // Starring and opening are not edits, so they skip Prisma's @updatedAt
  // bump; otherwise "Last edited" ordering would jump around.
  setStarred: protectedProcedure
    .input(z.object({ id: projectIdSchema, starred: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const count = await prisma.$executeRaw`
        UPDATE "Project" SET "starred" = ${input.starred}
        WHERE "id" = ${input.id} AND "userId" = ${ctx.auth.userId}`;
      assertFound(count);
      return { id: input.id, starred: input.starred };
    }),

  markOpened: protectedProcedure
    .input(z.object({ id: projectIdSchema }))
    .mutation(async ({ input, ctx }) => {
      await prisma.$executeRaw`
        UPDATE "Project" SET "lastOpenedAt" = NOW()
        WHERE "id" = ${input.id} AND "userId" = ${ctx.auth.userId}`;
      return { id: input.id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: projectIdSchema }))
    .mutation(async ({ input, ctx }) => {
      const { count } = await prisma.project.deleteMany({
        where: { id: input.id, userId: ctx.auth.userId },
      });
      assertFound(count);
      return { id: input.id };
    }),
});

function assertFound(count: number) {
  if (count === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
  }
}
