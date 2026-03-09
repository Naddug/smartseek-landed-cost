#!/usr/bin/env node
/**
 * Full website translation script using OpenAI GPT API.
 * Usage: OPENAI_API_KEY=your_key node scripts/translate-all.cjs
 *
 * Translates all i18n keys for every language that doesn't have full coverage.
 * Writes the updated i18n.ts directly.
 */

"use strict";
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Set OPENAI_API_KEY environment variable before running.");
  process.exit(1);
}

const client = new OpenAI.default({ apiKey: API_KEY });

const I18N_PATH = path.join(__dirname, "../client/src/lib/i18n.ts");

// ─── Language metadata ────────────────────────────────────────────────────────
const LANG_NAMES = {
  th: "Thai",         ar: "Arabic",      de: "German",      ja: "Japanese",
  ko: "Korean",       pt: "Portuguese",  it: "Italian",     nl: "Dutch",
  pl: "Polish",       vi: "Vietnamese",  id: "Indonesian",  hi: "Hindi",
  bn: "Bengali",      uk: "Ukrainian",   cs: "Czech",       el: "Greek",
  hu: "Hungarian",    ro: "Romanian",    sv: "Swedish",     da: "Danish",
  fi: "Finnish",      no: "Norwegian",   he: "Hebrew",      fa: "Persian/Farsi",
  ms: "Malay",        ta: "Tamil",       te: "Telugu",      mr: "Marathi",
  gu: "Gujarati",     kn: "Kannada",     ml: "Malayalam",   pa: "Punjabi",
  si: "Sinhala",      my: "Burmese",     km: "Khmer",       lo: "Lao",
  ne: "Nepali",       ur: "Urdu",        sw: "Swahili",     am: "Amharic",
  ha: "Hausa",        yo: "Yoruba",      ig: "Igbo",        zu: "Zulu",
  af: "Afrikaans",    sq: "Albanian",    hy: "Armenian",    az: "Azerbaijani",
  be: "Belarusian",   bs: "Bosnian",     bg: "Bulgarian",   hr: "Croatian",
  ka: "Georgian",     mk: "Macedonian",  sr: "Serbian",     sk: "Slovak",
  sl: "Slovenian",    et: "Estonian",    lv: "Latvian",     lt: "Lithuanian",
  mt: "Maltese",      cy: "Welsh",       ga: "Irish",       is: "Icelandic",
  lb: "Luxembourgish",
};

// RTL languages
const RTL_LANGS = new Set(["ar", "he", "fa", "ur"]);

// Languages already complete (skip)
const ALREADY_COMPLETE = new Set(["en"]);

// All target languages to translate
const TARGET_LANGS = Object.keys(LANG_NAMES).filter(l => !ALREADY_COMPLETE.has(l));

// ─── Parse English keys from i18n.ts ─────────────────────────────────────────
function extractEnglishKeys(src) {
  const match = src.match(/^const en: Record<string, string> = \{([\s\S]*?)^};/m);
  if (!match) throw new Error("Could not find English const en block");
  const block = match[1];
  const keys = {};
  const re = /^\s+"([^"]+)":\s+"((?:[^"\\]|\\.)*)"/gm;
  let m;
  while ((m = re.exec(block)) !== null) {
    keys[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  return keys;
}

// ─── Parse existing partial translation ───────────────────────────────────────
function extractLangKeys(src, lang) {
  // Match: const XX: Record<string, string> = { ... };
  const re = new RegExp(
    `^const ${lang}: Record<string, string> = \\{([\\s\\S]*?)^};`,
    "m"
  );
  const match = src.match(re);
  if (!match) return {};
  const block = match[1];
  const keys = {};
  const keyRe = /^\s+"([^"]+)":\s+"((?:[^"\\]|\\.)*)"/gm;
  let m;
  while ((m = keyRe.exec(block)) !== null) {
    keys[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  return keys;
}

// ─── Call GPT to translate a batch of keys ────────────────────────────────────
async function translateBatch(langCode, langName, keys) {
  const pairs = Object.entries(keys);
  const inputJson = JSON.stringify(Object.fromEntries(pairs), null, 2);

  const prompt = `You are a professional translator. Translate the following JSON key-value pairs from English to ${langName} (language code: ${langCode}).

RULES:
1. Return ONLY valid JSON — no markdown, no explanations, no code blocks.
2. Keep all keys exactly as-is (they are i18n keys, not content).
3. Preserve ALL interpolation placeholders exactly: {{suppliers}}, {{leads}}, {{countries}}, {{n}}, etc.
4. Keep brand names unchanged: SmartSeek, SOC 2, GDPR, OAuth 2.0, SAP Ariba, Oracle, Salesforce, AI.
5. Keep proper nouns unchanged: Sarah Chen, Marcus Weber, Priya Sharma, EuroTech Industries, Atlas Retail Group, Global Manufacturing Corp.
6. Translate ALL values to natural, professional ${langName}.
7. For short UI labels (buttons, nav items) be concise.
8. Output JSON with the same keys, translated values.

English source:
${inputJson}`;

  const msg = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const text = msg.choices[0].message.content.trim();
  // Strip markdown code fences if present
  const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error(`  JSON parse error for ${langCode}:`, e.message);
    console.error("  Raw output:", clean.slice(0, 200));
    return {};
  }
}

// ─── Translate all missing keys for a language ────────────────────────────────
async function translateLanguage(langCode, langName, enKeys, existingKeys) {
  const missing = {};
  for (const [k, v] of Object.entries(enKeys)) {
    if (!existingKeys[k]) {
      missing[k] = v;
    }
  }

  const missingCount = Object.keys(missing).length;
  if (missingCount === 0) {
    console.log(`  ✓ ${langCode} already complete`);
    return existingKeys;
  }

  console.log(`  Translating ${missingCount} missing keys for ${langCode} (${langName})...`);

  // Split into batches of 60 to stay within token limits
  const BATCH = 60;
  const entries = Object.entries(missing);
  const translated = { ...existingKeys };

  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = Object.fromEntries(entries.slice(i, i + BATCH));
    const batchNum = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(entries.length / BATCH);
    process.stdout.write(`    batch ${batchNum}/${totalBatches}...`);

    let result = {};
    let retries = 2;
    while (retries >= 0) {
      try {
        result = await translateBatch(langCode, langName, batch);
        break;
      } catch (e) {
        if (retries > 0) {
          console.log(` retry (${e.message})`);
          await new Promise(r => setTimeout(r, 2000));
          retries--;
        } else {
          console.log(` FAILED — keeping English fallback`);
          result = batch; // fallback to English
        }
      }
    }

    // Merge results
    for (const [k, v] of Object.entries(result)) {
      if (k in batch) { // only accept keys we asked for
        translated[k] = v;
      }
    }
    console.log(" done");

    // Small delay to avoid rate limits
    if (i + BATCH < entries.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return translated;
}

// ─── Render a language block as TypeScript ───────────────────────────────────
function renderLangBlock(langCode, langName, keys, enKeys) {
  const lines = [`// ${langName}`, `const ${langCode}: Record<string, string> = {`];

  // Output keys in the same order as English
  for (const k of Object.keys(enKeys)) {
    const v = keys[k] || enKeys[k]; // fallback to English if still missing
    const escaped = v.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    lines.push(`  "${k}": "${escaped}",`);
  }

  lines.push("};");
  return lines.join("\n");
}

// ─── Build the translations const ────────────────────────────────────────────
function buildTranslationsConst(allLangs) {
  const complete = ["en", "tr", "es", "ru", "zh", "fr"];
  const partial = TARGET_LANGS;

  const lines = [
    "// Merge all - fallback to English for missing keys",
    `const translations: Record<string, Record<string, string>> = {`,
    `  ${[...complete, ...partial].join(", ")},`,
    `};`,
  ];
  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Reading i18n.ts...");
  const src = fs.readFileSync(I18N_PATH, "utf8");

  const enKeys = extractEnglishKeys(src);
  const totalKeys = Object.keys(enKeys).length;
  console.log(`Found ${totalKeys} English keys.\n`);

  // Build results map: lang -> translated keys
  const results = {};

  for (const lang of TARGET_LANGS) {
    const langName = LANG_NAMES[lang];
    console.log(`[${lang}] ${langName}`);
    const existing = extractLangKeys(src, lang);
    const translated = await translateLanguage(lang, langName, enKeys, existing);
    results[lang] = translated;
    console.log(`  ✓ ${lang} complete (${Object.keys(translated).length}/${totalKeys} keys)\n`);
  }

  console.log("\nBuilding updated i18n.ts...");

  // Reconstruct the file
  // 1. Keep everything up to and including the Turkish (tr) block end
  // 2. Append Spanish, Russian, Chinese, French (already complete - extract them)
  // 3. Append new translations
  // 4. Append the footer (translations const + i18n init)

  // Find where the English block ends and extract complete sections
  const alreadyComplete = [];
  const completeBlocks = {};
  for (const lang of alreadyComplete) {
    const re = new RegExp(
      `(// [^\\n]+\\n)?const ${lang}: Record<string, string> = \\{[\\s\\S]*?^};`,
      "m"
    );
    const m = src.match(re);
    if (m) completeBlocks[lang] = m[0];
  }

  // Find header (everything up to and including const en block)
  const enBlockEnd = src.indexOf("\n};\n", src.indexOf("const en: Record")) + 4;
  const header = src.slice(0, enBlockEnd);

  // Build middle section: complete languages + new translations
  const middleParts = [];
  for (const lang of alreadyComplete) {
    if (completeBlocks[lang]) {
      middleParts.push("\n" + completeBlocks[lang]);
    }
  }
  for (const lang of TARGET_LANGS) {
    const langName = LANG_NAMES[lang];
    const block = renderLangBlock(lang, langName, results[lang], enKeys);
    middleParts.push("\n" + block);
  }

  // Build the footer (translations const + init)
  const allLangCodes = ["en", ...TARGET_LANGS];

  const translationsConst = `\n// Merge all — full translations for every supported language
const translations: Record<string, Record<string, string>> = {
  ${allLangCodes.join(", ")},
};\n`;

  const forLoop = `\nfor (const lang of LANGUAGES) {
  resources[lang] = { translation: translations[lang] || en };
}\n`;

  // Extract i18n init section (from i18n\n.use... to end)
  const initStart = src.indexOf("\ni18n\n  .use(LanguageDetector)");
  const initSection = src.slice(initStart);

  const newSrc = header + middleParts.join("") + translationsConst + forLoop + initSection;

  fs.writeFileSync(I18N_PATH, newSrc, "utf8");
  console.log(`\n✓ Written to ${I18N_PATH}`);
  console.log(`  ${allLangCodes.length} languages with full coverage`);

  // Verify key counts
  const verifyRe = /const (\w{2,3}): Record<string, string> = \{/g;
  let vm;
  const counts = {};
  while ((vm = verifyRe.exec(newSrc)) !== null) {
    const lc = vm[1];
    if (lc === "en") continue;
    const blockEnd = newSrc.indexOf("\n};\n", vm.index);
    const block = newSrc.slice(vm.index, blockEnd);
    const kCount = (block.match(/^\s+"[^"]+": "/gm) || []).length;
    counts[lc] = kCount;
  }

  console.log("\nKey counts:");
  for (const [lc, cnt] of Object.entries(counts)) {
    const ok = cnt >= totalKeys ? "✓" : "✗";
    console.log(`  ${ok} ${lc}: ${cnt}/${totalKeys}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
