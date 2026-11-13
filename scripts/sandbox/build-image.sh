#!/usr/bin/env sh
# Builds the image the Docker sandbox provider starts for each run, from the
# same Dockerfile as the E2B template. Extra arguments go to `docker build`
# (e.g. --no-cache).
set -eu

cd "$(dirname "$0")/../.."
exec "${SANDBOX_DOCKER_BIN:-docker}" build \
  --tag frame-nextjs-template \
  --file sandbox/nextjs/e2b.Dockerfile \
  "$@" \
  sandbox/nextjs
