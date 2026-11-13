import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import {
  openai,
  createTool,
  createAgent,
  createState,
  createNetwork,
  type Tool,
  type Message,
} from "@inngest/agent-kit";

import {
  SYSTEM_PROMPT,
  RESPONSE_PROMPT,
  FRAGMENT_TITLE_PROMPT,
} from "@/config/prompt";

import prisma from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import {
  getSandbox,
  parseAgentOutput,
  lastAssistantMessageContent,
} from "@/lib/inngest/utils";
import { SANDBOX_TIMEOUT } from "@/constants/sandbox";
import {
  completeGeneration,
  markGenerationFailed,
} from "@/modules/projects/server/status";

export interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  {
    id: "code-agent",
    retries: 2,
    // One run per project at a time (runs share a chat and a sandbox), and a
    // fair share per user so one account can't starve the queue.
    concurrency: [
      { key: "event.data.projectId", limit: 1 },
      { key: "event.data.userId", limit: 3 },
    ],
    onFailure: async ({ event }) => {
      await markGenerationFailed(event.data.event.data.projectId);
    },
  },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // The project may have been deleted (or rolled back after an ambiguous
    // send failure) before this run started; don't spend a sandbox on it.
    const projectExists = await step.run("check-project", async () =>
      Boolean(
        await prisma.project.count({ where: { id: event.data.projectId } })
      )
    );
    if (!projectExists) {
      return { skipped: "project-not-found" };
    }

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("frame-nextjs-template");
      await sandbox.setTimeout(SANDBOX_TIMEOUT);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            content: message.content,
            role: message.role === "USER" ? "user" : "assistant",
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description:
        "An expert coding agent that writes clean, efficient, and maintainable code.",
      system: SYSTEM_PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal" as const,
          description:
            "Use the terminal to run the commands  using the following syntax: ```terminal\n$command\n```",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }: Tool.Options<AgentState>) => {
            return await step?.run("terminal-command", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.error(
                  `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
                );
                return `Command failed: ${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFile" as const,
          description: "Create or update a file in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              "create-or-update-file",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);

                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error: " + error;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles" as const,
          description: "Read the files in the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }: Tool.Options<AgentState>) => {
            return await step?.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                console.error(`Error reading files: ${error}`);
                return `Error reading files: ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantTextMessage =
            await lastAssistantMessageContent(result);

          if (lastAssistantTextMessage && network) {
            if (lastAssistantTextMessage.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantTextMessage;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "An agent that generates a title for the fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "gpt-4o",
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "An agent that generates a response for the fragment",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "gpt-4o",
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary
    );

    const isError = Boolean(
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      try {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `https://${host}`;
      } catch (error) {
        console.error("Failed to get sandbox URL:", error);
        throw new Error("Failed to retrieve sandbox URL");
      }
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await markGenerationFailed(event.data.projectId);
      }

      return await completeGeneration(event.data.projectId, {
        content: parseAgentOutput(responseOutput),
        type: "RESULT",
        fragment: {
          create: {
            title: parseAgentOutput(fragmentTitleOutput),
            sandboxUrl: sandboxUrl,
            files: result.state.data.files,
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
