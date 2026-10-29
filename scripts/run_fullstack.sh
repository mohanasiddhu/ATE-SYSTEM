#!/usr/bin/env bash
# AI Traffic Enforcement System - Run Full-Stack (Backend + Frontend + Detection)
set -e

export NODE_ENV=development
export PORT=3000
echo "=============================================================="
echo " Starting Full-Stack AI Traffic Enforcement System (Port 3000)"
echo " Express REST Backend + Vite React UI + YOLOv8 Detection"
echo "=============================================================="
npx tsx server.ts
