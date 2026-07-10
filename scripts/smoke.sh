#!/usr/bin/env bash
# end-to-end test: build the cli, run it against a fresh next.js app, build that app.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "--> building cli"
bun --filter '@justin06lee/chrome' build

echo "--> creating temp next app"
TMP="$(mktemp -d)"
trap "rm -rf $TMP" EXIT
cd "$TMP"
bun create next-app@latest smoke --yes --use-bun --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd smoke

echo "--> building registry into a local /r"
mkdir -p public/r
cp "$REPO_ROOT"/apps/site/public/r/*.json public/r/

echo "--> running chrome init via local cli"
node "$REPO_ROOT/packages/cli/dist/cli.js" init --yes --registry "file://$(pwd)/public/r"

echo "--> running chrome add button"
node "$REPO_ROOT/packages/cli/dist/cli.js" add button --yes --registry "file://$(pwd)/public/r"

echo "--> next build"
bun run build

echo "✓ smoke passed"
