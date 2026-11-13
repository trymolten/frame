import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

type Tx = Prisma.TransactionClient;

/**
 * Every agent run answers exactly one user message (with a result or an
 * error), so a project is still building while it has more user messages
 * than assistant replies. Call before inserting the reply being finished.
 */
async function statusAfterReply(
  tx: Tx,
  projectId: string,
  outcome: "READY" | "FAILED"
) {
  const [userMessages, replies] = await Promise.all([
    tx.message.count({ where: { projectId, role: "USER" } }),
    tx.message.count({ where: { projectId, role: "ASSISTANT" } }),
  ]);
  // This reply answers one; any others are queued runs.
  return userMessages - replies > 1 ? "GENERATING" : outcome;
}

/** Saves a finished run's reply and fragment. */
export async function completeGeneration(
  projectId: string,
  message: Omit<Prisma.MessageUncheckedCreateInput, "projectId" | "role">
) {
  return prisma.$transaction(async (tx) => {
    const status = await statusAfterReply(tx, projectId, "READY");
    const created = await tx.message.create({
      data: { ...message, projectId, role: "ASSISTANT" },
    });
    await tx.project.update({ where: { id: projectId }, data: { status } });
    return created;
  });
}

/**
 * Leaves a project in a state the user can recover from: an error reply in
 * the chat and a FAILED status on the card, instead of a spinner forever.
 * A no-op if the project was deleted while it was building.
 */
export async function markGenerationFailed(projectId: string) {
  await prisma.$transaction(async (tx) => {
    const exists = await tx.project.count({ where: { id: projectId } });
    if (!exists) return;

    const status = await statusAfterReply(tx, projectId, "FAILED");
    await tx.message.create({
      data: {
        projectId,
        content: "Something went wrong while building this. Try again.",
        role: "ASSISTANT",
        type: "ERROR",
      },
    });
    await tx.project.update({ where: { id: projectId }, data: { status } });
  });
}
