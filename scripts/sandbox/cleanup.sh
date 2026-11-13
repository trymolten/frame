#!/usr/bin/env sh
# Removes every container the Docker sandbox provider started. They also stop
# on their own once SANDBOX_TIMEOUT passes.
set -eu

docker="${SANDBOX_DOCKER_BIN:-docker}"
ids=$("$docker" ps --all --quiet --filter label=frame.sandbox)

if [ -z "$ids" ]; then
  echo "No sandbox containers."
  exit 0
fi

# shellcheck disable=SC2086 # one id per word
"$docker" rm --force $ids
