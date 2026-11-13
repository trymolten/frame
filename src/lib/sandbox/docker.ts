import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";

import { SANDBOX_TEMPLATE } from "@/constants/sandbox";
import {
  SandboxCommandError,
  type Sandbox,
  type CommandResult,
  type SandboxProvider,
  type RunCommandOptions,
} from "@/lib/sandbox/types";

// Every container we start carries this label, so connect() never touches
// anything else and leftovers are easy to find:
//   docker ps --filter label=molten.sandbox
const SANDBOX_LABEL = "molten.sandbox";
const SANDBOX_ID_PATTERN = /^molten-sandbox-[a-f0-9]+$/;
const APP_DIR = "/home/user";
const EXPIRES_AT_FILE = "/tmp/.molten-sandbox-expires-at";

// Match E2B: a new sandbox lives 5 minutes unless setTimeout() extends it,
// and a command gets 60 seconds.
const DEFAULT_SANDBOX_TIMEOUT_MS = 5 * 60_000;
const DEFAULT_COMMAND_TIMEOUT_MS = 60_000;
const READY_TIMEOUT_SECONDS = 120;

// The image is built from sandbox/<template>/e2b.Dockerfile and tagged with
// the template name (scripts/sandbox/build-image.sh). E2B reads the start
// command from the template's e2b.toml instead.
const TEMPLATES: Record<string, { startCommand: string; port: number }> = {
  [SANDBOX_TEMPLATE]: { startCommand: "/compile_page.sh", port: 3000 },
};

// `timeoutMs` here kills the docker CLI itself.
interface DockerOptions extends RunCommandOptions {
  input?: string;
}

const dockerBin = () => process.env.SANDBOX_DOCKER_BIN || "docker";

const docker = (args: string[], options: DockerOptions = {}) =>
  new Promise<CommandResult>((resolve, reject) => {
    // The binary comes from PATH or SANDBOX_DOCKER_BIN, never from the
    // project, so keep this call out of Next's output file tracing (otherwise
    // Turbopack traces the whole project into the server bundle).
    const child = spawn(/* turbopackIgnore: true */ dockerBin(), args);
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = options.timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill("SIGKILL");
        }, options.timeoutMs)
      : undefined;

    child.stdout.setEncoding("utf8").on("data", (data: string) => {
      stdout += data;
      options.onStdout?.(data);
    });
    child.stderr.setEncoding("utf8").on("data", (data: string) => {
      stderr += data;
      options.onStderr?.(data);
    });
    child.on("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      reject(
        error.code === "ENOENT"
          ? new Error(
              `Docker CLI "${dockerBin()}" not found. Install Docker or OrbStack, or set SANDBOX_DOCKER_BIN.`
            )
          : error
      );
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (timedOut) {
        reject(new Error(`docker ${args[0]} timed out`));
      } else {
        resolve({ stdout, stderr, exitCode: code ?? 1 });
      }
    });

    // The process may exit before reading its input; that surfaces as a
    // non-zero exit code, not as an unhandled EPIPE.
    child.stdin.on("error", () => {});
    child.stdin.end(options.input);
  });

const failure = (action: string, result: CommandResult) =>
  new Error(
    `${action}: ${result.stderr.trim() || `exit status ${result.exitCode}`}`
  );

const expiresAt = (timeoutMs: number) =>
  Math.ceil((Date.now() + timeoutMs) / 1000);

// The container's main process: starts the template's dev server, then exits
// once the time in EXPIRES_AT_FILE has passed, which stops the container and
// (with --rm) removes it. setTimeout() only rewrites that file.
const supervisorScript = (startCommand: string) =>
  [
    `echo "$MOLTEN_SANDBOX_EXPIRES_AT" > ${EXPIRES_AT_FILE}`,
    `${startCommand} &`,
    `while [ "$(date +%s)" -lt "$(cat ${EXPIRES_AT_FILE})" ]; do sleep 5; done`,
  ].join("\n");

class DockerSandbox implements Sandbox {
  constructor(readonly sandboxId: string) {}

  private exec(args: string[], options: DockerOptions = {}) {
    const interactive = options.input === undefined ? [] : ["--interactive"];
    return docker(
      ["exec", ...interactive, "--workdir", APP_DIR, this.sandboxId, ...args],
      options
    );
  }

  async setTimeout(timeoutMs: number) {
    const result = await this.exec([
      "sh",
      "-c",
      `echo "$1" > ${EXPIRES_AT_FILE}`,
      "sh",
      String(expiresAt(timeoutMs)),
    ]);
    if (result.exitCode !== 0) {
      throw failure("Failed to set sandbox timeout", result);
    }
  }

  async runCommand(
    command: string,
    {
      timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS,
      ...callbacks
    }: RunCommandOptions = {}
  ) {
    const seconds = Math.max(1, Math.ceil(timeoutMs / 1000));
    // `timeout` kills the command's whole process group inside the
    // container; killing the docker CLI alone would leave it running.
    const result = await this.exec(
      ["timeout", "--kill-after=5", String(seconds), "bash", "-c", command],
      { ...callbacks, timeoutMs: (seconds + 30) * 1000 }
    );
    if (result.exitCode === 124) {
      throw new SandboxCommandError(
        `command timed out after ${seconds}s`,
        result
      );
    }
    if (result.exitCode !== 0) {
      throw new SandboxCommandError(`exit status ${result.exitCode}`, result);
    }
    return result;
  }

  async writeFile(path: string, content: string) {
    const result = await this.exec(
      [
        "sh",
        "-c",
        'mkdir -p -- "$(dirname -- "$1")" && cat > "$1"',
        "sh",
        path,
      ],
      { input: content }
    );
    if (result.exitCode !== 0) {
      throw failure(`Failed to write ${path}`, result);
    }
  }

  async readFile(path: string) {
    const result = await this.exec(["cat", "--", path]);
    if (result.exitCode !== 0) {
      throw failure(`Failed to read ${path}`, result);
    }
    return result.stdout;
  }

  async getUrl(port: number) {
    const result = await docker(["port", this.sandboxId, `${port}/tcp`]);
    const hostPort = result.stdout.match(/:(\d+)\s*$/m)?.[1];
    if (result.exitCode !== 0 || !hostPort) {
      throw failure(
        `Port ${port} of sandbox ${this.sandboxId} isn't published`,
        result
      );
    }
    const host = process.env.SANDBOX_PREVIEW_HOST || "localhost";
    return `http://${host}:${hostPort}`;
  }

  async kill() {
    await docker(["rm", "--force", this.sandboxId]);
  }

  // E2B snapshots templates with the dev server already serving; a container
  // starts cold, so wait for the first page to compile like E2B's build does.
  async waitUntilReady(port: number) {
    const probe = `curl -s -o /dev/null -w '%{http_code}' http://localhost:${port}`;
    const result = await this.exec(
      [
        "sh",
        "-c",
        `for i in $(seq ${READY_TIMEOUT_SECONDS}); do [ "$(${probe})" = 200 ] && exit 0; sleep 1; done; exit 1`,
      ],
      { timeoutMs: (READY_TIMEOUT_SECONDS + 30) * 1000 }
    );
    if (result.exitCode !== 0) {
      const logs = await docker(["logs", "--tail", "30", this.sandboxId]);
      throw new Error(
        `Sandbox dev server didn't answer on port ${port} within ${READY_TIMEOUT_SECONDS}s.\n${logs.stdout}${logs.stderr}`
      );
    }
  }
}

export const dockerSandboxProvider: SandboxProvider = {
  name: "docker",

  async create(template) {
    const spec = TEMPLATES[template];
    if (!spec) {
      throw new Error(`Unknown sandbox template "${template}"`);
    }

    const name = `molten-sandbox-${randomBytes(6).toString("hex")}`;
    const result = await docker([
      "run",
      "--detach",
      "--rm",
      "--init",
      "--pull=never",
      "--name",
      name,
      "--label",
      `${SANDBOX_LABEL}=true`,
      "--label",
      `${SANDBOX_LABEL}.template=${template}`,
      // Loopback only: previews are reachable from this machine, not the LAN.
      "--publish",
      `127.0.0.1::${spec.port}`,
      "--env",
      `MOLTEN_SANDBOX_EXPIRES_AT=${expiresAt(DEFAULT_SANDBOX_TIMEOUT_MS)}`,
      template,
      "sh",
      "-c",
      supervisorScript(spec.startCommand),
    ]);
    if (result.exitCode !== 0) {
      if (/no such image/i.test(result.stderr)) {
        throw new Error(
          `Sandbox image "${template}" not found. Build it with scripts/sandbox/build-image.sh (docker compose up builds it too).`
        );
      }
      throw failure("Failed to start sandbox", result);
    }

    const sandbox = new DockerSandbox(name);
    try {
      await sandbox.waitUntilReady(spec.port);
    } catch (error) {
      await sandbox.kill();
      throw error;
    }
    return sandbox;
  },

  async connect(sandboxId) {
    if (!SANDBOX_ID_PATTERN.test(sandboxId)) {
      throw new Error(`Invalid Docker sandbox id "${sandboxId}"`);
    }

    const result = await docker([
      "container",
      "inspect",
      "--format",
      `{{index .Config.Labels "${SANDBOX_LABEL}"}} {{.State.Running}}`,
      sandboxId,
    ]);
    if (result.exitCode !== 0 || !result.stdout.startsWith("true ")) {
      throw new Error(`Sandbox ${sandboxId} not found; it may have timed out`);
    }
    if (result.stdout.trim() !== "true true") {
      throw new Error(`Sandbox ${sandboxId} is not running`);
    }
    return new DockerSandbox(sandboxId);
  },
};
