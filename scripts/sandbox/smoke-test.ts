// End-to-end check of the configured sandbox provider: create a sandbox,
// write and read a file, run commands, load the preview, then clean up.
//
//   npx tsx scripts/sandbox/smoke-test.ts
//
// Picks the provider like the app does (SANDBOX_PROVIDER, else Docker unless
// E2B_API_KEY is set). Run it on the host so the preview URL is reachable.
import assert from "node:assert/strict";

import { getSandboxProvider } from "@/lib/sandbox";
import { SANDBOX_TEMPLATE } from "@/constants/sandbox";

const step = async <T>(label: string, run: () => Promise<T>) => {
  const startedAt = Date.now();
  const result = await run();
  console.log(`✓ ${label} (${Date.now() - startedAt}ms)`);
  return result;
};

const poll = async (check: () => Promise<boolean>, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs;
  while (!(await check())) {
    if (Date.now() > deadline) {
      throw new Error(`Timed out after ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
};

const main = async () => {
  const provider = getSandboxProvider();
  const marker = `frame-smoke-${Date.now()}`;
  console.log(`Provider: ${provider.name}`);

  const sandbox = await step("create sandbox", () =>
    provider.create(SANDBOX_TEMPLATE)
  );
  console.log(`  id: ${sandbox.sandboxId}`);

  try {
    await step("set timeout", () => sandbox.setTimeout(5 * 60_000));
    const connected = await step("connect by id", () =>
      provider.connect(sandbox.sandboxId)
    );

    const page = `export default function Page() {\n  return <main>${marker}</main>;\n}\n`;
    await step("write file (relative path)", () =>
      connected.writeFile("app/page.tsx", page)
    );
    const read = await step("read file (absolute path)", () =>
      connected.readFile("/home/user/app/page.tsx")
    );
    assert.equal(read, page);

    let streamed = "";
    const result = await step("run command", () =>
      connected.runCommand("node --version && pwd", {
        onStdout: (data) => {
          streamed += data;
        },
      })
    );
    assert.match(result.stdout, /^v\d+\.\d+\.\d+\n\/home\/user\n$/);
    assert.equal(streamed, result.stdout);

    await step("failing command rejects", () =>
      assert.rejects(connected.runCommand("echo oops >&2; exit 3"))
    );

    const url = await step("get preview url", () => connected.getUrl(3000));
    console.log(`  url: ${url}`);
    await step("preview serves the written page", () =>
      poll(async () => {
        const response = await fetch(url).catch(() => undefined);
        return Boolean(
          response?.ok && (await response.text()).includes(marker)
        );
      }, 60_000)
    );

    if (provider.name === "docker") {
      await step("container stops once its timeout passes", async () => {
        await connected.setTimeout(1_000);
        await poll(
          () =>
            provider.connect(sandbox.sandboxId).then(
              () => false,
              () => true
            ),
          30_000
        );
      });
    }
  } finally {
    await sandbox.kill().catch(() => {});
  }

  await step("sandbox is gone", () =>
    assert.rejects(provider.connect(sandbox.sandboxId))
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
