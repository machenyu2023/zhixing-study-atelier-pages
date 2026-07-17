import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const files = ["index.html", "styles.css", "app.js", "workbook-bank.js", "knowledge-base.js", "storage.js", "config.js"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of files) {
  await cp(new URL(file, root), new URL(file, dist));
}
await cp(new URL("data/", root), new URL("data/", dist), { recursive: true });
await writeFile(join(fileURLToPath(dist), ".nojekyll"), "");
console.log(`Built ${files.length} application files and question-bank resources.`);
