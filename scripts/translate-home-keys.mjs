#!/usr/bin/env node
/**
 * AI-powered translation of home.* keys to all locales.
 * Run: node scripts/translate-home-keys.mjs (needs OPENAI_API_KEY in .env)
 */
import "dotenv/config";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, "../client/public/locales");

const KEYS_TO_TRANSLATE = [
  "home.pricing.subtitle", "home.pricing.tierFree", "home.pricing.tierFreeDesc",
  "home.pricing.tierPro", "home.pricing.tierProDesc", "home.pricing.tierProBadge",
  "home.pricing.tierEnterprise", "home.pricing.tierEnterpriseDesc", "home.pricing.getStarted",
  "home.trust.registryVerified", "home.trust.noFabricated", "home.trust.realRecords", "home.trust.directSource",
  "home.integrations.title", "home.integrations.sectionTitle", "home.integrations.sectionDesc", "home.integrations.viewAll",
  "home.demo.badge", "home.demo.desc", "home.demo.placeholder", "home.demo.searchBtn",
  "home.demo.liveResults", "home.demo.suppliersFound", "home.demo.enterProduct", "home.demo.clickQuick",
  "home.demo.quick1", "home.demo.quick2", "home.demo.quick3", "home.demo.quick4",
  "home.demo.verified", "home.demo.noCreditCard", "home.demo.startFree", "home.demo.logIn",
  "home.demo.resultsFor", "home.demo.moreSuppliers", "home.demo.freeUnlocks",
  "home.capabilities.badge", "home.capabilities.title", "home.capabilities.subtitle",
  "home.capabilities.findSuppliers", "home.capabilities.findSuppliersDesc", "home.capabilities.searchSuppliers",
  "home.capabilities.findSuppliersChip1", "home.capabilities.findSuppliersChip2", "home.capabilities.findSuppliersChip3",
  "home.capabilities.findLeads", "home.capabilities.findLeadsDesc", "home.capabilities.exploreLeads",
  "home.capabilities.findLeadsChip1", "home.capabilities.findLeadsChip2", "home.capabilities.findLeadsChip3",
  "home.capabilities.aiIntel", "home.capabilities.aiIntelDesc", "home.capabilities.tryAI",
  "home.capabilities.aiIntelChip1", "home.capabilities.aiIntelChip2", "home.capabilities.aiIntelChip3",
  "home.searchPlaceholder", "home.placeholder1", "home.placeholder2", "home.placeholder3",
  "home.placeholder4", "home.placeholder5", "home.placeholder6",
  "home.testimonialCard1.quote", "home.testimonialCard1.name", "home.testimonialCard1.role",
  "home.testimonialCard2.quote", "home.testimonialCard2.name", "home.testimonialCard2.role",
  "home.testimonialCard3.quote", "home.testimonialCard3.name", "home.testimonialCard3.role",
  "home.testimonialCard4.quote", "home.testimonialCard4.name", "home.testimonialCard4.role",
];

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

async function translateBatch(openai, texts, targetLang) {
  const langName = LANG_NAMES[targetLang] || targetLang;
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: `Translate the following JSON values from English to ${langName}. Keep the same JSON structure. Preserve placeholders like {{count}}, {{query}}, {{suppliers}} exactly. Return ONLY valid JSON.`,
    }, {
      role: "user",
      content: JSON.stringify(texts, null, 0),
    }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  return JSON.parse(res.choices[0]?.message?.content || "{}");
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    console.error("Set OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY in .env");
    process.exit(1);
  }
  const openai = new OpenAI({ apiKey });

  const enPath = join(LOCALES_DIR, "en/translation.json");
  const en = JSON.parse(readFileSync(enPath, "utf8"));

  const source = {};
  for (const k of KEYS_TO_TRANSLATE) {
    if (en[k]) source[k] = en[k];
  }

  const locales = readdirSync(LOCALES_DIR).filter((d) => {
    const p = join(LOCALES_DIR, d);
    return statSync(p).isDirectory() && d !== "en";
  });

  console.log(`Translating ${Object.keys(source).length} keys to ${locales.length} locales...`);

  for (const locale of locales) {
    try {
      const targetPath = join(LOCALES_DIR, locale, "translation.json");
      const target = JSON.parse(readFileSync(targetPath, "utf8"));
      const toTranslate = {};
      for (const k of KEYS_TO_TRANSLATE) {
        if (source[k] && !target[k]) toTranslate[k] = source[k];
      }
      if (Object.keys(toTranslate).length === 0) {
        console.log(`  ${locale}: already complete`);
        continue;
      }
      const translated = await translateBatch(openai, toTranslate, locale);
      for (const [k, v] of Object.entries(translated)) {
        if (typeof v === "string") target[k] = v;
      }
      writeFileSync(targetPath, JSON.stringify(target, null, 2) + "\n", "utf8");
      console.log(`  ${locale}: +${Object.keys(translated).length} keys`);
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`  ${locale}: ERROR`, err.message);
    }
  }
  console.log("Done.");
}

main().catch(console.error);
