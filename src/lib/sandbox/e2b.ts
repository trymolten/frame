import { Sandbox as E2BSandbox } from "@e2b/code-interpreter";

import { E2B_TEMPLATE_ID, SANDBOX_TEMPLATE } from "@/constants/sandbox";

import type {
  Sandbox,
  SandboxProvider,
  RunCommandOptions,
} from "@/lib/sandbox/types";

// Thin adapter over E2B cloud sandboxes. Errors pass through unchanged, so a
// failing command still rejects with E2B's CommandExitError.
class E2BSandboxAdapter implements Sandbox {
  constructor(private readonly sandbox: E2BSandbox) {}

  get sandboxId() {
    return this.sandbox.sandboxId;
  }

  async setTimeout(timeoutMs: number) {
    await this.sandbox.setTimeout(timeoutMs);
  }

  async runCommand(command: string, options: RunCommandOptions = {}) {
    const { stdout, stderr, exitCode } = await this.sandbox.commands.run(
      command,
      options
    );
    return { stdout, stderr, exitCode };
  }

  async writeFile(path: string, content: string) {
    await this.sandbox.files.write(path, content);
  }

  async readFile(path: string) {
    return await this.sandbox.files.read(path);
  }

  async getUrl(port: number) {
    return `https://${this.sandbox.getHost(port)}`;
  }

  async kill() {
    await this.sandbox.kill();
  }
}

export const e2bSandboxProvider: SandboxProvider = {
  name: "e2b",
  // Our template is addressed by its E2B id; any other name passes through.
  create: async (template) =>
    new E2BSandboxAdapter(
      await E2BSandbox.create(
        template === SANDBOX_TEMPLATE
          ? process.env.E2B_TEMPLATE || E2B_TEMPLATE_ID
          : template
      )
    ),
  connect: async (sandboxId) =>
    new E2BSandboxAdapter(await E2BSandbox.connect(sandboxId)),
};
