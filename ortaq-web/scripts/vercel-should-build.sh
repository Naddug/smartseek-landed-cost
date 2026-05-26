#!/usr/bin/env bash
# Vercel Ignored Build Step (runs from ortaq-web/ root directory).
# Exit 0 = skip deploy · Exit 1 = build
set -euo pipefail

if git diff HEAD^ HEAD --quiet -- . ../.github/workflows/ortaq-ci.yml 2>/dev/null; then
  echo "No ortaq-web changes — skipping Vercel build."
  exit 0
fi

echo "ortaq-web changes detected — building."
exit 1
