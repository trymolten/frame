# Development image for docker-compose.yml. The source is bind-mounted at
# runtime, so the image only carries system packages and node_modules.
FROM node:24-slim

# OpenSSL for Prisma's schema engine, and the docker CLI so the Docker sandbox
# provider can start preview containers through the mounted socket.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*
COPY --from=docker:29-cli /usr/local/bin/docker /usr/local/bin/docker

WORKDIR /app

# npm's postinstall runs `prisma generate`, which loads prisma.config.ts and
# so needs database URLs set. Nothing connects to them during the build.
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \
  DATABASE_URL=postgresql://build@localhost/build \
  DIRECT_URL=postgresql://build@localhost/build \
  npm ci

ENV NEXT_TELEMETRY_DISABLED=1 \
  NPM_CONFIG_UPDATE_NOTIFIER=false
EXPOSE 3000
CMD ["npx", "next", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
