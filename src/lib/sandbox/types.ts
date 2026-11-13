export type SandboxProviderName = "docker" | "e2b";

export interface RunCommandOptions {
  onStdout?: (data: string) => void;
  onStderr?: (data: string) => void;
  /** Kill the command after this long. Defaults to 60s, like E2B. */
  timeoutMs?: number;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// The slice of a sandbox the code agent uses. Relative paths and commands
// resolve against the generated app's directory (/home/user).
export interface Sandbox {
  readonly sandboxId: string;
  /** Keep the sandbox alive for `timeoutMs` from now, then shut it down. */
  setTimeout(timeoutMs: number): Promise<void>;
  /** Run a shell command. Rejects if it exits non-zero or times out. */
  runCommand(
    command: string,
    options?: RunCommandOptions
  ): Promise<CommandResult>;
  writeFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  /** A URL the user's browser can open for a port inside the sandbox. */
  getUrl(port: number): Promise<string>;
  kill(): Promise<void>;
}

export interface SandboxProvider {
  readonly name: SandboxProviderName;
  create(template: string): Promise<Sandbox>;
  connect(sandboxId: string): Promise<Sandbox>;
}

export class SandboxCommandError extends Error {
  constructor(
    message: string,
    readonly result: CommandResult
  ) {
    super(message);
    this.name = "SandboxCommandError";
  }
}
