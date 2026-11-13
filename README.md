This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run the whole stack with Docker

```bash
cp .env.example .env   # add your Clerk keys
make up                # or: docker compose up
```

This starts Postgres 17, applies migrations, the Inngest dev server
([localhost:8288](http://localhost:8288)), and the app in dev mode with hot
reload ([localhost:3000](http://localhost:3000)). The first run also builds
the code sandbox image, which takes a few minutes. Run `make` to list the
other shortcuts (`start`, `down`, `logs`, `restart`, `rebuild`, …). If a port
is taken, set `APP_PORT`, `INNGEST_PORT` or `POSTGRES_PORT` in `.env`. After
changing dependencies, run `make rebuild`. Edits hot-reload; if a new route
folder isn't picked up, run `make restart`.

### Code agent model: Ollama or OpenAI

`AI_PROVIDER` picks the model the code agent runs on:

- `ollama`: every agent uses a local [Ollama](https://ollama.com) model,
  `OLLAMA_MODEL` (default `qwen3:8b`), with no API key. Run the Ollama app on
  your machine; `make up` pulls the model if it's missing. Ollama runs outside
  Docker because Docker on macOS can't use the GPU, so compose points
  `OLLAMA_BASE_URL` at `host.docker.internal`. Without compose it defaults to
  `http://localhost:11434/v1`.
- `openai`: `gpt-4.1` for the code agent and `gpt-4o` for titles and replies.
  Needs `OPENAI_API_KEY`.

When `AI_PROVIDER` is unset, Molten uses OpenAI if `OPENAI_API_KEY` is set and
Ollama otherwise. Local models make mistakes OpenAI's don't. In testing,
`qwen3:8b` built a working counter page except that it left `use client`
unquoted, while `qwen2.5:3b` and `qwen2.5-coder:7b` wrote their tool calls as
plain text and created no files. Thinking is turned off for Ollama models,
because qwen3 returns no tool calls while thinking. Ollama's default
4096-token context is tight for the agent's prompt (raise it with
`OLLAMA_CONTEXT_LENGTH`).

### Code sandbox: Docker or E2B

The agent builds each app in a sandbox, picked by `SANDBOX_PROVIDER`:

- `docker`: a local container per run, from `sandbox/nextjs/e2b.Dockerfile`.
  No account needed. Previews open at `http://localhost:<port>`, and
  containers stop when `SANDBOX_TIMEOUT` passes. Outside compose, build the
  image once with `make sandbox-image`. To check the provider, run
  `make sandbox-test`. To remove leftover containers, run `make sandbox-clean`.
- `e2b`: E2B cloud sandboxes from the `frame-nextjs-template` template. Needs
  `E2B_API_KEY`.

When `SANDBOX_PROVIDER` is unset, Molten uses E2B if `E2B_API_KEY` is set and
Docker otherwise. In compose, the app reaches Docker through the mounted
`/var/run/docker.sock`, which gives it full control of your Docker engine.
Use this setup only for local development.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
