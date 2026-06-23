#!/usr/bin/env bash
# Vercel Ignored Build Step (runs from repo root).
# Exit 0 = skip deploy · Exit 1 = build
set -euo pipefail

if git diff HEAD^ HEAD --quiet -- ortaq-v2/ .github/workflows/ortaq-ci.yml 2>/dev/null; then
  echo "No ortaq-v2 changes — skipping Vercel build."
  exit 0
fi

echo "ortaq-v2 changes detected — building."
exit 1
