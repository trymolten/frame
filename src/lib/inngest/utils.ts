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

// AI_PROVIDER picks the agents' model. When it's unset, OpenAI is used only
// if OPENAI_API_KEY is set; otherwise every agent runs on a local Ollama
// model, so local setups need no API key.
const getAiProvider = () => {
  const name =
    process.env.AI_PROVIDER?.trim().toLowerCase() ||
    (process.env.OPENAI_API_KEY ? "openai" : "ollama");

  if (name !== "openai" && name !== "ollama") {
    throw new Error(
      `Unknown AI_PROVIDER "${name}"; expected "openai" or "ollama"`
    );
  }
  return name;
};

// Thinking models such as qwen3 return no tool calls while thinking. Not part
// of agent-kit's request type, hence the spread.
const NO_THINKING = { reasoning_effort: "none" };

export const agentModel = (options: Parameters<typeof openai>[0]) => {
  if (getAiProvider() === "openai") {
    return openai(options);
  }
  // The Inngest server makes the request, so the URL must be reachable from
  // it (docker compose points it at host.docker.internal).
  return openai({
    ...options,
    model: process.env.OLLAMA_MODEL || "qwen3:8b",
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
    defaultParameters: { ...options.defaultParameters, ...NO_THINKING },
  });
};

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

// Small local models often write the "use client" directive without its
// quotes, which doesn't compile. An unquoted directive is never intended, so
// restore the quotes; correct files are left as they are.
export const fixUseClientDirective = (content: string) =>
  content.replace(/^\s*use client[ \t]*;?[ \t]*(?=\r?\n|$)/, '"use client";');

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
