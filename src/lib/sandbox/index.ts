import { dockerSandboxProvider } from "@/lib/sandbox/docker";
import { e2bSandboxProvider } from "@/lib/sandbox/e2b";
import type { SandboxProvider, SandboxProviderName } from "@/lib/sandbox/types";

export * from "@/lib/sandbox/types";

const providers: Record<SandboxProviderName, SandboxProvider> = {
  docker: dockerSandboxProvider,
  e2b: e2bSandboxProvider,
};

// SANDBOX_PROVIDER picks where generated apps run. When it's unset, E2B is
// used only if it's configured, so local setups need no E2B account.
export const getSandboxProvider = (): SandboxProvider => {
  const name =
    process.env.SANDBOX_PROVIDER?.trim().toLowerCase() ||
    (process.env.E2B_API_KEY ? "e2b" : "docker");

  if (name !== "docker" && name !== "e2b") {
    throw new Error(
      `Unknown SANDBOX_PROVIDER "${name}"; expected "docker" or "e2b"`
    );
  }
  return providers[name];
};
