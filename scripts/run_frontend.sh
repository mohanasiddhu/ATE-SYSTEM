#!/usr/bin/env bash
# AI Traffic Enforcement System - Run Frontend
set -e

echo "Starting Frontend Development Server on port 3000..."
npx vite --port=3000 --host=0.0.0.0
