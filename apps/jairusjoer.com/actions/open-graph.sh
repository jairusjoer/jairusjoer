#!/usr/bin/env bash

# Generates Open Graph images into public/og by starting a local Astro dev
# server, waiting until it responds, and running actions/open-graph.ts.
# This is the exact flow used by .github/workflows/jairusjoer-com-open-graph.yml.

set -u

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" || true
    wait "$SERVER_PID" || true
  fi
}
trap cleanup EXIT

pnpm exec astro dev &
SERVER_PID=$!

for _ in {1..60}; do
  if curl --silent --fail http://localhost:4321/rss.xml > /dev/null; then
    break
  fi
  sleep 1
done

if ! curl --silent --fail http://localhost:4321/rss.xml > /dev/null; then
  echo "Dev server did not start in time" >&2
  exit 1
fi

node actions/open-graph.ts
