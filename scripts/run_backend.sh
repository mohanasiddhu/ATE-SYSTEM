#!/usr/bin/env bash
# AI Traffic Enforcement System - Run Backend
set -e

echo "Starting Backend API Server..."
if command -v tsx &> /dev/null; then
  npx tsx server.ts
elif command -v uvicorn &> /dev/null; then
  python3 -m uvicorn backend.python.main:app --host 0.0.0.0 --port 8000 --reload
else
  node server.js
fi
