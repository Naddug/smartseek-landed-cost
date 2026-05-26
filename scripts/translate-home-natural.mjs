#!/usr/bin/env node
/**
 * Natural translation of home.* keys (missing or untranslated) to every non-EN locale.
 * Run: node scripts/translate-home-natural.mjs
 */
import "dotenv/config";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "../client/public/locales");
const BATCH_SIZE = 10;
const MAX_RETRIES = 2;

const LANG_NAMES = {
  tr: "Turkish", de: "German", fr: "French", es: "Spanish", it: "Italian", pt: "Portuguese",
  ru: "Russian", zh: "Chinese", ja: "Japanese", ko: "Korean", ar: "Arabic", hi: "Hindi",
  nl: "Dutch", pl: "Polish", vi: "Vietnamese", id: "Indonesian", th: "Thai", sv: "Swedish",
  da: "Danish", no: "Norwegian", fi: "Finnish", el: "Greek", he: "Hebrew", fa: "Persian",
  uk: "Ukrainian", cs: "Czech", hu: "Hungarian", ro: "Romanian", bg: "Bulgarian", hr: "Croatian",
  sk: "Slovak", sl: "Slovenian", sr: "Serbian", bn: "Bengali", ta: "Tamil", te: "Telugu",
  mr: "Marathi", gu: "Gujarati", kn: "Kannada", ml: "Malayalam", pa: "Punjabi", ur: "Urdu",
  ms: "Malay", sw: "Swahili", am: "Amharic", ha: "Hausa", yo: "Yoruba", ig: "Igbo",
  zu: "Zulu", af: "Afrikaans", sq: "Albanian", hy: "Armenian", az: "Azerbaijani", be: "Belarusian",
  bs: "Bosnian", ka: "Georgian", mk: "Macedonian", et: "Estonian", lv: "Latvian", lt: "Lithuanian",
  mt: "Maltese", cy: "Welsh", ga: "Irish", is: "Icelandic", lb: "Luxembourgish",
  km: "Khmer", lo: "Lao", my: "Burmese", ne: "Nepali", si: "Sinhala",
};

function systemPrompt(targetLang) {
  const langName = LANG_NAMES[targetLang] || targetLang;
  return `You are a professional translator and copywriter specializing in B2B sourcing, procurement and international trade.

Your job is NOT to translate word-for-word. Your job is to write natural, professional copy in ${langName} that communicates the same meaning a real procurement professional would use.

Rules:
- Write how a real person in that industry would speak, not how a dictionary would translate
- Keep brand names as-is: SmartSeek, RFQ, MOQ, Incoterms, SAIC, Companies House, SEC EDGAR, Handelsregister, MERSIS, ASIC, KRS, DART, SEDAR
- For Turkish: use natural business Turkish, not bureaucratic or machine-translated Turkish
- For German: use natural Geschäftsdeutsch
- For Russian: use natural деловой русский
- For Chinese: use natural 商业中文
- Never use overly literal translations that sound unnatural
- If a phrase does not translate well, find an equivalent that works in the target language
- Preserve placeholders like {{count}}, {{query}}, {{suppliers}} exactly
- Escape quotes properly in JSON strings
- Return ONLY valid JSON with the same keys as the input`;
}

function chunkEntries(entries, size) {
  const chunks = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }
  return chunks;
}

async function translateBatch(openai, batchObj, targetLang) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt(targetLang) },
      { role: "user", content: JSON.stringify(batchObj, null, 0) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });
  const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");
  const out = {};
  for (const key of Object.keys(batchObj)) {
    if (typeof parsed[key] === "string" && parsed[key].trim()) {
      out[key] = parsed[key];
    }
  }
  return out;
}

async function translateBatchWithRetry(openai, batchObj, targetLang) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await translateBatch(openai, batchObj, targetLang);
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function keysNeedingTranslation(en, target, homeKeys) {
  return homeKeys.filter((k) => !(k in target) || target[k] === en[k]);
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    console.error("Set OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY in .env");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });
  const en = JSON.parse(readFileSync(join(LOCALES_DIR, "en/translation.json"), "utf8"));
  const homeKeys = Object.keys(en).filter((k) => k.startsWith("home."));

  const locales = readdirSync(LOCALES_DIR).filter((d) => {
    const p = join(LOCALES_DIR, d);
    return statSync(p).isDirectory() && d !== "en";
  });

  console.log(`home.* keys in EN: ${homeKeys.length}`);
  console.log(`Locales: ${locales.length}`);

  const trSamples = [];
  let localesUpdated = 0;
  let totalTranslated = 0;

  for (const locale of locales) {
    const targetPath = join(LOCALES_DIR, locale, "translation.json");
    const target = JSON.parse(readFileSync(targetPath, "utf8"));
    const toTranslate = keysNeedingTranslation(en, target, homeKeys);

    if (toTranslate.length === 0) {
      console.log(`${locale}: skip (complete)`);
      continue;
    }

    const batches = chunkEntries(toTranslate, BATCH_SIZE);
    let count = 0;
    process.stdout.write(`${locale}: ${toTranslate.length} keys... `);

    for (const batchKeys of batches) {
      const batchObj = Object.fromEntries(batchKeys.map((k) => [k, en[k]]));
      try {
        const translated = await translateBatchWithRetry(openai, batchObj, locale);
        for (const [k, v] of Object.entries(translated)) {
          if (locale === "tr" && trSamples.length < 10 && target[k] !== v) {
            trSamples.push({ key: k, before: target[k] ?? en[k], after: v });
          }
          target[k] = v;
          count++;
        }
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`\n  batch failed (${batchKeys[0]}…): ${err.message}`);
      }
    }

    writeFileSync(targetPath, JSON.stringify(target, null, 2) + "\n", "utf8");
    localesUpdated++;
    totalTranslated += count;
    console.log(`${count} translated`);
  }

  console.log(`\nLocales updated: ${localesUpdated}`);
  console.log(`Total keys translated: ${totalTranslated}`);

  if (trSamples.length) {
    console.log("\nTR sample before/after:");
    for (const { key, before, after } of trSamples) {
      console.log(`\n[${key}]`);
      console.log(`  before: ${before}`);
      console.log(`  after:  ${after}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
