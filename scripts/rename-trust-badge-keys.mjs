/**
 * B1: Rename legacy compliance-themed trustBadge keys to sourcing-native names.
 * Preserves existing string values; removes old keys.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../client/public/locales");

const RENAMES = [
  ["trustBadge.soc2", "trustBadge.registry"],
  ["trustBadge.soc2.sub", "trustBadge.registry.sub"],
  ["trustBadge.encryption", "trustBadge.operator"],
  ["trustBadge.encryption.sub", "trustBadge.operator.sub"],
  ["trustBadge.gdpr", "trustBadge.structured"],
  ["trustBadge.gdpr.sub", "trustBadge.structured.sub"],
  ["trustBadge.uptime", "trustBadge.noBlast"],
  ["trustBadge.uptime.sub", "trustBadge.noBlast.sub"],
];

const dirs = fs.readdirSync(localesDir).filter((d) =>
  fs.existsSync(path.join(localesDir, d, "translation.json"))
);

let filesUpdated = 0;
for (const locale of dirs) {
  const filePath = path.join(localesDir, locale, "translation.json");
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;
  for (const [oldKey, newKey] of RENAMES) {
    if (oldKey in json) {
      if (!(newKey in json)) json[newKey] = json[oldKey];
      delete json[oldKey];
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n");
    filesUpdated++;
  }
}

console.log(`Renamed trustBadge keys in ${filesUpdated} locale files.`);
