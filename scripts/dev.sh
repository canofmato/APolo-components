#!/usr/bin/env bash

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="${APOLO_API_DIR:-$(cd "$PROJECT_DIR/../mcp-server" && pwd)}"
API_PID=""

cleanup() {
  if [ -n "$API_PID" ]; then
    kill "$API_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if ! curl --silent --fail http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
  if [ ! -x "$API_DIR/.venv/bin/uvicorn" ]; then
    echo "FastAPI environment is missing: $API_DIR/.venv"
    echo "Run: python3 -m venv $API_DIR/.venv"
    exit 1
  fi

  (
    cd "$API_DIR"
    exec ./.venv/bin/uvicorn api:app --host 127.0.0.1 --port 8000 --reload
  ) &
  API_PID=$!
fi

cd "$PROJECT_DIR"
exec ./node_modules/.bin/vite
