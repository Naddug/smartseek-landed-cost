#!/usr/bin/env bash
# Run supplier import in background – survives terminal close, prevents Mac sleep.
# Usage: ./scripts/data-import/run-import-background.sh
# Logs: scripts/data-import/import-suppliers.log

set -e
cd "$(dirname "$0")/../.."
LOG="scripts/data-import/import-suppliers.log"

echo "Starting background import (42M target)..."
echo "Log: $LOG"
echo "To watch: tail -f $LOG"
echo ""

# caffeinate = prevent Mac sleep during import
# nohup = keep running after terminal closes
# RESUME_IMPORT = skip rows already in DB
# PDL_IMPORT_ALL = import all industries (not just mapped)
# PDL_TARGET_COUNT = 42 million
# Files: companies.csv + scripts:data-import:pdl-companies.csv in Downloads
nohup env \
  NODE_TLS_REJECT_UNAUTHORIZED=0 \
  PDL_IMPORT_ALL=true \
  PDL_TARGET_COUNT=42000000 \
  RESUME_IMPORT=true \
  COMPANIES_CSV_PATH="/Users/harunkaya/Downloads/companies.csv" \
  PDL_CSV_PATH="/Users/harunkaya/Downloads/scripts:data-import:pdl-companies.csv" \
  caffeinate -i \
  npx tsx scripts/data-import/import-all-suppliers.ts \
  >> "$LOG" 2>&1 &

PID=$!
echo "Import started (PID $PID). Running in background."
echo "Check progress: tail -f $LOG"
echo "Check if running: ps -p $PID"
