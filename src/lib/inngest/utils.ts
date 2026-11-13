import {
  openai,
  type AgentResult,
  type Message,
  type TextMessage,
} from "@inngest/agent-kit";

import { getSandboxProvider } from "@/lib/sandbox";
import { SANDBOX_TIMEOUT } from "@/constants/sandbox";

export const getSandbox = async (sandboxId: string) => {
  const sandbox = await getSandboxProvider().connect(sandboxId);
  await sandbox.setTimeout(SANDBOX_TIMEOUT);
  return sandbox;
};

// Agents talk to any OpenAI-compatible API. OPENAI_BASE_URL points them
// elsewhere (e.g. a local Ollama), and OPENAI_MODEL then replaces every
// agent's model. The Inngest server makes these requests, so the URL must be
// reachable from it.
export const agentModel = (options: Parameters<typeof openai>[0]) =>
  openai({
    ...options,
    model: process.env.OPENAI_MODEL || options.model,
    baseUrl: process.env.OPENAI_BASE_URL || options.baseUrl,
  });

export const lastAssistantMessageContent = async (result: AgentResult) => {
  const lastAssistantMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastAssistantMessageIndex] as
    TextMessage | undefined;

  if (!message?.content) {
    return undefined;
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  return message.content.map((item) => item.text).join("");
};

export const parseAgentOutput = (value: Message[]) => {
  const output = value[0];

  if (output.type !== "text") {
    return "Fragment";
  }

  if (Array.isArray(output.content)) {
    return output.content.map((item) => item.text).join("");
  } else {
    return output.content;
  }
};
