This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run the whole stack with Docker

```bash
cp .env.example .env   # add your Clerk keys and OPENAI_API_KEY
docker compose up
```

This starts Postgres 17, applies migrations, the Inngest dev server
([localhost:8288](http://localhost:8288)), and the app in dev mode with hot
reload ([localhost:3000](http://localhost:3000)). The first run also builds
the code sandbox image, which takes a few minutes. If a port is taken, set
`APP_PORT`, `INNGEST_PORT` or `POSTGRES_PORT` in `.env`. After changing
dependencies, run `docker compose up --build -V`. Edits hot-reload; if a
new route folder isn't picked up, run `docker compose restart app`.

The code agent needs a model whichever sandbox runs the generated app: set
`OPENAI_API_KEY`, or point it at a local model.

### Local model with Ollama

Any OpenAI-compatible API works. With [Ollama](https://ollama.com) and
`ollama pull qwen3:8b`, set:

```bash
OPENAI_BASE_URL=http://host.docker.internal:11434/v1   # http://localhost:11434/v1 without compose
OPENAI_MODEL=qwen3:8b                                  # used by every agent
OPENAI_REASONING_EFFORT=none                           # qwen3 drops tool calls while thinking
```

The Inngest server makes the model requests, so the URL must be reachable
from where Inngest runs. The model must return structured tool calls. In
testing, `qwen3:8b` built a working counter page except for one bug (it left
`use client` unquoted). `qwen2.5:3b` and `qwen2.5-coder:7b` wrote their tool
calls as plain text, so no files were created. Expect local models to make
mistakes that OpenAI's don't. Ollama's default 4096-token context is also
tight for the agent's prompt (raise it with `OLLAMA_CONTEXT_LENGTH`).

### Code sandbox: Docker or E2B

The agent builds each app in a sandbox, picked by `SANDBOX_PROVIDER`:

- `docker`: a local container per run, from `sandbox/nextjs/e2b.Dockerfile`.
  No account needed. Previews open at `http://localhost:<port>`, and
  containers stop when `SANDBOX_TIMEOUT` passes. Outside compose, build the
  image once with `scripts/sandbox/build-image.sh`. To check the provider, run
  `npx tsx scripts/sandbox/smoke-test.ts`. To remove leftover containers, run
  `scripts/sandbox/cleanup.sh`.
- `e2b`: E2B cloud sandboxes from the `frame-nextjs-template` template. Needs
  `E2B_API_KEY`.

When `SANDBOX_PROVIDER` is unset, Frame uses E2B if `E2B_API_KEY` is set and
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
