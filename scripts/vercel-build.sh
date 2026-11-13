#!/usr/bin/env sh
# Vercel runs this instead of `npm run build` (the "vercel-build" script).
set -eu

npx prisma generate

# Apply pending migrations before the new code goes live, so it never queries
# columns that don't exist yet. Preview deployments skip this, so an unmerged
# branch can never change the production schema. Uses DIRECT_URL when set
# (see prisma.config.ts): migrations need a direct, non-pooled connection.
if [ "${VERCEL_ENV:-}" = "production" ]; then
  npx prisma migrate deploy
fi

npx next build
