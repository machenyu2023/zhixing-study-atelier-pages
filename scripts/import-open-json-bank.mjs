import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const [source, outputName] = process.argv.slice(2);
if (!source || !outputName) {
  console.error("Usage: node scripts/import-open-json-bank.mjs <https-url> <output-name>");
  process.exit(1);
}

const url = new URL(source);
if (url.protocol !== "https:") throw new Error("Only HTTPS sources are accepted");
if (!/^[a-z0-9][a-z0-9-]*$/i.test(outputName)) throw new Error("output-name may contain only letters, numbers, and hyphens");

const response = await fetch(url, { headers: { accept: "application/json" }, redirect: "follow" });
if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
const payload = await response.json();
if (payload.schemaVersion !== 1 || !payload.bank?.id || !Array.isArray(payload.questions)) throw new Error("Remote file is not a schemaVersion 1 question bank");
if (!payload.bank.source || !payload.bank.sourceUrl || !payload.bank.license) throw new Error("Remote bank must declare source, sourceUrl, and license");
if (payload.questions.some(question => !question.id || !question.source || !question.license)) throw new Error("Every remote question must declare id, source, and license");

const target = new URL(`../data/question-banks/${outputName}.json`, import.meta.url);
await mkdir(new URL("../data/question-banks/", import.meta.url), { recursive: true });
await writeFile(fileURLToPath(target), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Imported ${payload.questions.length} licensed questions into ${fileURLToPath(target)}.`);
