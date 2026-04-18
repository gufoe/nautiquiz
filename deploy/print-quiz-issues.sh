#!/usr/bin/env sh
# Print all reported quiz question IDs from production SQLite (synced client state).
#
# Usage on the server (from repo root, e.g. ~/pro/nautiquiz):
#   ./deploy/print-quiz-issues.sh
#   ./deploy/print-quiz-issues.sh --json
#
# Requires: docker compose stack running (service "api"). Uses the same compose file as deploy.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $ROOT/$COMPOSE_FILE" >&2
  exit 1
fi

ENV_FILE_ARGS=""
if [ -f "$ROOT/.env.production" ]; then
  ENV_FILE_ARGS="--env-file $ROOT/.env.production"
elif [ -f "$ROOT/.env" ]; then
  ENV_FILE_ARGS="--env-file $ROOT/.env"
fi

# shellcheck disable=SC2086
exec docker compose $ENV_FILE_ARGS -f "$COMPOSE_FILE" exec -T api \
  bun /app/scripts/list-quiz-issues.ts "$@"
