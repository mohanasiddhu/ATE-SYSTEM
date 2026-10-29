#!/usr/bin/env bash
# AI Traffic Enforcement System - Database Migration & Seed Script
set -e

echo "=== Initializing Relational Database Schema & Migrations ==="
mkdir -p database/migrations database/seeds outputs/evidence outputs/crops outputs/reports outputs/videos

if command -v sqlite3 &> /dev/null; then
  echo "Applying database/schema.sql..."
  sqlite3 database/db.sqlite < database/schema.sql
  echo "Applying database/seeds/seed_data.sql..."
  sqlite3 database/db.sqlite < database/seeds/seed_data.sql
  echo "✅ Database initialized at database/db.sqlite."
else
  echo "[INFO] SQLite CLI not installed; in-memory relational provider active."
fi
