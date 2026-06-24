// Minimal ESM resolver so smoke scripts can use the project's "@/..." aliases
// and load bare package subpaths (e.g. next/server, next/headers) whose
// `exports` maps Node's ESM resolver mishandles under --experimental-strip-types.
// Used only by local verification scripts (scripts/smoke-auth*.ts).
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

const root = pathToFileURL(process.cwd() + "/");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const candidates = rel.endsWith(".ts")
      ? [rel]
      : [`${rel}.ts`, `${rel}.tsx`, `${rel}/index.ts`, rel];
    for (const candidate of candidates) {
      const url = new URL(candidate, root);
      if (existsSync(url)) return nextResolve(url.href, context);
    }
  }

  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    // Fallback: bare "pkg/subpath" whose exports field wasn't honored.
    if (/^[^./][^:]*\//.test(specifier)) {
      for (const candidate of [
        `node_modules/${specifier}.js`,
        `node_modules/${specifier}/index.js`,
      ]) {
        const url = new URL(candidate, root);
        if (existsSync(url)) return nextResolve(url.href, context);
      }
    }
    throw error;
  }
}
