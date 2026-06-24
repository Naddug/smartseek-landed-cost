import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(
  path.join(root, "lib/dossier/dossier-visuals.ts"),
  "utf8"
);

const extracted = [
  ...source.matchAll(/IMG\("(photo-[a-f0-9-]+)"\)/g),
].map((match) => match[1]);
const defaultId = source.match(/DEFAULT_DOSSIER_IMAGE_ID = "(photo-[a-f0-9-]+)"/)?.[1];
const ids = [...new Set([...extracted, defaultId].filter(Boolean))];

let failed = 0;

async function check(id) {
  const url = `https://images.unsplash.com/${id}?w=1400&q=88&auto=format&fit=crop`;
  const response = await fetch(url, { method: "HEAD" });
  if (response.ok) {
    console.log("OK", id);
  } else {
    console.error("FAIL", response.status, id);
    failed += 1;
  }
}

console.log(`Verifying ${ids.length} dossier image IDs from dossier-visuals.ts…\n`);

for (const id of ids) {
  await check(id);
}

if (failed > 0) {
  process.exitCode = 1;
  console.error(`\n${failed} image URL(s) failed — do not ship broken mappings.`);
} else {
  console.log(`\nAll ${ids.length} dossier image URLs verified.`);
}
