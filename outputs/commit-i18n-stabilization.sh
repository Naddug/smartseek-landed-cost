#!/usr/bin/env bash
#
# SmartSeek i18n stabilization — Option A commit script (3 commits).
#
# WHAT THIS DOES
#   Stages exactly the six files this session modified, in three logical commits:
#     1. i18n(data): Wave-1 — 50 public-site keys for es/ru/zh/ja
#     2. fix(i18n): Phase 2b — PublicLayout hardcoded strings + mobile hero spacing
#     3. i18n(data): Wave-2 — zh +84 / ja +169 closeout (about, becomeSupplier,
#        contact, methodologyPage, pricing, verificationPage [+ ja-only:
#        category, common, nav.app, supplier, trustPage])
#
#   Nothing else is staged. The 32 pre-existing dirty locale files in the
#   working tree (km, kn, ko, lb, lo, …, tr, uk, ur, vi) are NOT touched
#   and remain dirty after this script runs.
#
# PREREQUISITES
#   1. Remove the stale index lock (sandbox cannot do this for you):
#        rm -f .git/index.lock
#   2. Ensure git identity is configured (if not already):
#        git config user.name  "<your name>"
#        git config user.email "<your email>"
#   3. Run this from the repo root: /Users/harunkaya/Downloads/Smart-sourcing
#
# AFTER THIS SCRIPT FINISHES
#        git push origin staging/predeploy-final
#
# ROLLBACK
#   Each commit is independent. Revert any commit with `git revert <sha>` —
#   no commit depends on a later commit; reverting the JSON commits simply
#   restores the EN fallback behavior for those keys.
#

set -euo pipefail

cd "$(dirname "$0")/.."

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "staging/predeploy-final" ]]; then
  echo "ERROR: expected branch 'staging/predeploy-final', got '$BRANCH'"
  exit 2
fi

# Refuse to run if index lock present
if [[ -f .git/index.lock ]]; then
  echo "ERROR: .git/index.lock exists. Remove it first:"
  echo "         rm -f .git/index.lock"
  exit 3
fi

# Refuse to run if git identity missing
if ! git config user.name >/dev/null || ! git config user.email >/dev/null; then
  echo "ERROR: git user.name and user.email must be configured."
  echo "         git config user.name  '<your name>'"
  echo "         git config user.email '<your email>'"
  exit 4
fi

# Files this script is allowed to touch
ES_JSON="client/public/locales/es/translation.json"
RU_JSON="client/public/locales/ru/translation.json"
ZH_JSON="client/public/locales/zh/translation.json"
JA_JSON="client/public/locales/ja/translation.json"
PUBLIC_LAYOUT="client/src/components/layout/PublicLayout.tsx"
HOME_PAGE="client/src/pages/Home.tsx"

# Sanity: backups exist (these mark the wave boundaries)
for f in \
  "${ES_JSON}.bak" "${RU_JSON}.bak" "${ZH_JSON}.bak" "${JA_JSON}.bak" \
  "${ZH_JSON}.bak2" "${JA_JSON}.bak2"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: required snapshot missing: $f"
    exit 5
  fi
done

# Stash the current (post-Wave-2) zh/ja state so we can rewind/replay safely
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
cp "$ZH_JSON" "$TMP_DIR/zh.wave2.json"
cp "$JA_JSON" "$TMP_DIR/ja.wave2.json"

# ────────────────────────────────────────────────────────────────────────────
# COMMIT 1 — Wave 1 (50-key public-site patch for es/ru/zh/ja)
# ────────────────────────────────────────────────────────────────────────────
# es and ru are already at post-Wave-1 (no Wave-2 was applied to them).
# zh and ja need to be temporarily rewound to .bak2 (= post-Wave-1, pre-Wave-2).
cp "${ZH_JSON}.bak2" "$ZH_JSON"
cp "${JA_JSON}.bak2" "$JA_JSON"

git add -- "$ES_JSON" "$RU_JSON" "$ZH_JSON" "$JA_JSON"
git commit -m "i18n(data): Wave 1 — public-site key parity for es/ru/zh/ja

Adds the 50 keys the public site already references but that were
missing from es/ru/zh/ja, causing fallback-to-English on:

  - publicNav.*           (6 keys)  nav links + beta CTAs
  - publicFooter.*        (13 keys) methodology strip + column headers
  - publicBanner.*        (3 keys)  top beta status strip
  - rfq.*                 (11 keys) /rfq page header + error toasts
  - publicSearch.*        (8 keys)  /search results header + states
  - findLeads.header.*    (4 keys)
  - supplier.hero.*       (3 keys)  supplier landing subtitles
  - supplier.banner.*     (1 key)
  - landedCost.error.*    (1 key)

Additive only. EN/TR untouched. JSON validated. Interpolation tokens
({{count}}, {{suppliers}}, {{countries}}) preserved across all locales.

Refs: I18N_AUDIT_PHASE1.md
"

# ────────────────────────────────────────────────────────────────────────────
# COMMIT 2 — Phase 2b code fixes (layout hardcoded strings + mobile hero)
# ────────────────────────────────────────────────────────────────────────────
git add -- "$PUBLIC_LAYOUT" "$HOME_PAGE"
git commit -m "fix(i18n): translate hardcoded layout strings + mobile hero spacing

PublicLayout.tsx — Replace hardcoded FAQ/Privacy/Terms in the footer
Company column with t('nav.faq') / t('footer.privacy') / t('footer.terms').
Same keys are already used correctly on lines 216–217; removes the
duplicate-source inconsistency.

Home.tsx — Replace the conditionally-hidden <br> in the hero <h1>
with two <span className='inline sm:block'> segments and a mobile-only
space span. Eliminates the mobile-only 'intelligencefor' concatenation
bug (JSX collapses inter-node whitespace when the <br> is display:none).
Deterministic line-break on >=sm, single line with proper spacing on <sm.
Locale-safe — no translation string changes required.
"

# ────────────────────────────────────────────────────────────────────────────
# COMMIT 3 — Wave 2 (zh +84 / ja +169 closeout)
# ────────────────────────────────────────────────────────────────────────────
# Replay the post-Wave-2 state we saved at the start
cp "$TMP_DIR/zh.wave2.json" "$ZH_JSON"
cp "$TMP_DIR/ja.wave2.json" "$JA_JSON"

git add -- "$ZH_JSON" "$JA_JSON"
git commit -m "i18n(data): Wave 2 — close zh/ja parity with EN

Brings zh and ja from public-site parity (Wave 1) to full namespace
parity with EN. All six locales now at 1256 keys / 0 missing.

zh (+84): about, becomeSupplier, contact.types, methodologyPage,
          pricing, verificationPage
ja (+169): above + category (42), common (17), nav.app (6),
           supplier (6), trustPage (14)

Tone: operator-informed, registry-checked, sourcing-oriented B2B —
not generic SaaS phrasing. Preserves SmartSeek positioning terms:
  Registry-verified  -> 注册验证 / 登録検証済み
  Operator-led       -> 运营员主导 / オペレーター主導
  auto-blast         -> 自动群发 / 自動一斉送信
  sourcing           -> 采购 / 調達

Interpolation tokens preserved ({{name}}, {{count}}, {{min}}).
EN, TR, ES, RU untouched in this commit.

NOTE: A separate audit (see I18N_AUDIT_PHASE1.md §7) identified a
deeper pre-existing issue — ~314 zh / ~316 ja / ~373 es / ~525 ru
keys exist with their VALUE identical to the English source (i.e.,
partial pre-existing translation work). Closing those is Wave 3
and is out of scope for this commit.
"

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "  3 commits staged. Recent history:"
echo "─────────────────────────────────────────────────────────────"
git log --oneline -3
echo ""
echo "  Working tree status (pre-existing dirty files left alone):"
git status --short | head -40
echo ""
echo "  To push:  git push origin staging/predeploy-final"
echo "─────────────────────────────────────────────────────────────"
