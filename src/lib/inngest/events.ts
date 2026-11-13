import { z } from "zod";

// Runtime contract for "code-agent/run". Events can also arrive from the
// Inngest dashboard or replays, so the payload is validated before use:
// Prisma silently drops `where: { id: undefined }`, which would turn
// per-project queries into whole-table ones.
export const codeAgentRunSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  value: z.string().min(1),
});

export type CodeAgentRunData = z.infer<typeof codeAgentRunSchema>;
