#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Replacement-image sourcing helper.
#
# This script does NOT download anything automatically. It opens search pages
# in your browser, one per bad/duplicate JPG, with the exact Unsplash query
# you need. You select a photo, copy its download URL, paste it into the
# `REPLACE_WITH` line, then run the script with `--apply` to fetch.
#
# Reason: agent environments cannot validate that a specific Unsplash photo ID
# depicts the right industry, so we let you pick. Once URLs are in place this
# script becomes a one-shot replacement.
#
# Run order:
#   1) ./scripts/source-replacement-images.sh        # opens search tabs
#   2) (paste chosen photo URLs into the REPLACE_WITH= lines below)
#   3) ./scripts/source-replacement-images.sh --apply
# -----------------------------------------------------------------------------

set -euo pipefail
cd "$(dirname "$0")/.."

MEDIA_DIR="public/media"
OPEN_CMD="${OPEN_CMD:-open}"   # macOS default; on Linux use xdg-open

# Each entry: filename | search query | REPLACE_WITH (paste image URL here)
# The search query maps the sector ORTAQ needs; the URL is what you paste.
declare -a FILES=(
  # FILE                       | UNSPLASH QUERY                                 | REPLACE_WITH
  "grain-mill.jpg              | flour mill industrial silo                    | "
  "chemical-plant.jpg          | chemical plant tanks process pipes            | "
  "cnc-workshop.jpg            | cnc machining metal lathe workshop            | "
  "industrial-line.jpg         | factory production line conveyor              | "
  "packaging-floor.jpg         | packaging machinery factory floor             | "
  "textile-floor.jpg           | textile weaving loom factory                  | "
  "shipyard-dock.jpg           | shipyard hull crane industrial                | "
  "glass-furnace.jpg           | glass furnace molten manufacturing            | "
  "plastic-extrusion.jpg       | plastic extrusion machinery factory           | "
  "exportWarehouse.jpg         | container port loading dock                   | "
)

# Optional alternative sources for premium institutional photography:
# - https://www.pexels.com/search/cnc%20machining/
# - https://www.gettyimages.com/photos/industrial-manufacturing  (paid)
# - https://stocksnap.io/search/industrial
# Direct Turkish industry: ask a stringer to shoot at OSBs (Konya, Bursa, Manisa OSB)
# for the highest credibility. Stock is acceptable for v1; on-site is the goal.

apply_mode=false
[[ "${1:-}" == "--apply" ]] && apply_mode=true

for line in "${FILES[@]}"; do
  IFS='|' read -r file query url <<< "$line"
  file=$(echo "$file" | xargs)
  query=$(echo "$query" | xargs)
  url=$(echo "$url" | xargs)

  if $apply_mode; then
    if [[ -z "$url" ]]; then
      echo "skip $file — no URL pasted"
      continue
    fi
    echo "fetching $file from $url"
    curl -sSL "$url" -o "$MEDIA_DIR/$file"
    echo "  → $(file "$MEDIA_DIR/$file" 2>/dev/null || stat -c %s "$MEDIA_DIR/$file") bytes"
  else
    # Open the search page in default browser
    search_url="https://unsplash.com/s/photos/$(echo "$query" | sed 's/ /%20/g')"
    echo "[$file]"
    echo "  query : $query"
    echo "  search: $search_url"
    if command -v "$OPEN_CMD" >/dev/null 2>&1; then
      "$OPEN_CMD" "$search_url" >/dev/null 2>&1 || true
    fi
    echo
  fi
done

if ! $apply_mode; then
  cat <<'EOF'

Next:
  1. In each tab that opened, find a sector-correct premium-looking shot.
     Right-click the photo → "Copy image address" (or use the download
     dropdown on Unsplash and copy the URL from the page).
  2. Paste each URL into the corresponding REPLACE_WITH= slot in this
     script's FILES array (between the second | and the line end).
  3. Run:  ./scripts/source-replacement-images.sh --apply
  4. Commit and deploy:
       cd /Users/harunkaya/Downloads/Smart-sourcing
       git add ortaq-web/public/media/
       git commit -m "media: replace wrong-content stock photos with sector-correct sources"
       git push
       cd ortaq-web && npx vercel deploy

Notes:
  - Unsplash photos are free for commercial use; attribution appreciated.
  - The lib/product/company-summary.ts mapping already routes campaigns
    away from these files until they're replaced, so the staging cards
    will not regress while you source them.
  - For production credibility, replace stock with photographer-captured
    images of the real Turkish OSB facilities once company onboarding
    permits it.
EOF
fi
