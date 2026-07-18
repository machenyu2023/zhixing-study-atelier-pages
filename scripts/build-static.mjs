import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const assetFiles = ["styles.css", "app.js", "workbook-bank.js", "curriculum-renderer.js", "storage.js", "config.js"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of assetFiles) {
  await cp(new URL(file, root), new URL(file, dist));
}
let indexHtml = await readFile(new URL("index.html", root), "utf8");
for (const file of assetFiles) {
  const content = await readFile(new URL(file, root));
  const version = createHash("sha256").update(content).digest("hex").slice(0, 12);
  const reference = `"${file}"`;
  if (!indexHtml.includes(reference)) throw new Error(`index.html does not reference ${file}`);
  indexHtml = indexHtml.replaceAll(reference, `"${file}?v=${version}"`);
}
await writeFile(new URL("index.html", dist), indexHtml, "utf8");
await cp(new URL("data/", root), new URL("data/", dist), { recursive: true });
await writeFile(join(fileURLToPath(dist), ".nojekyll"), "");
console.log(`Built ${assetFiles.length + 1} application files with content-hashed asset URLs and question-bank resources.`);
