#!/usr/bin/env bash
# Vercel Ignored Build Step (monorepo root).
# Exit 0 = skip deploy · Exit 1 = build
set -euo pipefail

if git diff HEAD^ HEAD --quiet -- ortaq-web/ .github/workflows/ortaq-ci.yml; then
  echo "No ortaq-web changes — skipping Vercel build."
  exit 0
fi

echo "ortaq-web changes detected — building."
exit 1
