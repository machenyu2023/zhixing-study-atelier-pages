import { mkdir, readFile, writeFile } from "node:fs/promises";

const [handbookPath, workbookPath] = process.argv.slice(2);
if (!handbookPath || !workbookPath) {
  console.error("Usage: node scripts/extract-curriculum.mjs <handbook.html> <workbook.html>");
  process.exit(1);
}

function attrValue(attributes, name) {
  return attributes.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
}

function markdownScripts(source) {
  const scripts = [];
  const pattern = /<script([^>]*)type="text\/markdown"([^>]*)>([\s\S]*?)<\/script>/g;
  for (const match of source.matchAll(pattern)) {
    const attributes = `${match[1]} ${match[2]}`;
    scripts.push({
      id: attrValue(attributes, "id"),
      className: attrValue(attributes, "class"),
      number: attrValue(attributes, "data-num"),
      title: attrValue(attributes, "data-title"),
      subtitle: attrValue(attributes, "data-sub"),
      content: match[3].trim()
    });
  }
  return scripts;
}

const handbookSource = await readFile(handbookPath, "utf8");
const workbookSource = await readFile(workbookPath, "utf8");
const handbookChapters = markdownScripts(handbookSource)
  .filter(script => script.className.split(/\s+/).includes("chapter"))
  .map(script => ({
    id: `handbook-${script.number}`,
    number: Number(script.number),
    title: script.title,
    subtitle: script.subtitle,
    content: script.content
  }));

const workbookScripts = markdownScripts(workbookSource);
const workbookIntro = workbookScripts.find(script => script.id === "doc-intro");
const workbookVolumes = workbookScripts
  .filter(script => /^doc-[1-6]$/.test(script.id))
  .sort((left, right) => Number(left.id.slice(4)) - Number(right.id.slice(4)))
  .map(script => {
    const number = Number(script.id.slice(4));
    const title = script.content.match(/^#\s+(.+)$/m)?.[1] || `卷${number}`;
    const meta = script.content.match(/^>\s*建议用时：([^\n]+)/m)?.[1] || "";
    return { id: `workbook-${number}`, number, title, meta, content: script.content };
  });

if (handbookChapters.length !== 13) throw new Error(`Expected 13 handbook chapters, found ${handbookChapters.length}`);
if (!workbookIntro) throw new Error("Workbook usage guide is missing");
if (workbookVolumes.length !== 6) throw new Error(`Expected 6 workbook volumes, found ${workbookVolumes.length}`);

const payload = {
  schemaVersion: 1,
  handbook: {
    id: "logic-argument-thinking-handbook",
    title: "逻辑 · 论证 · 思考 — 系统学习手册",
    sourceFile: "学习手册.html",
    chapters: handbookChapters
  },
  workbook: {
    id: "logic-writing-thinking-workbook",
    title: "逻辑 · 写作 · 思考 — 每日训练习题册",
    sourceFile: "习题册.html",
    intro: { id: "workbook-intro", title: "使用指南", content: workbookIntro.content },
    volumes: workbookVolumes
  }
};

const output = new URL("../data/curriculum/curriculum-source.json", import.meta.url);
await mkdir(new URL("./", output), { recursive: true });
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Extracted ${handbookChapters.length} handbook chapters and ${workbookVolumes.length} workbook volumes.`);
