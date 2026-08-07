#!/usr/bin/env bash

# Ensure Bun is on PATH
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Idempotency check: if Vite or dev server is already running on port 3000, do not start again
if pgrep -f "vite" > /dev/null || pgrep -f "bun run dev" > /dev/null; then
  echo "Vite dev server is already running."
  exit 0
fi

echo "Starting Vite dev server in background (port 3000)..."
nohup bun run dev > /tmp/vite-dev.log 2>&1 &

echo "Vite dev server launched. Logs: /tmp/vite-dev.log"
exit 0
