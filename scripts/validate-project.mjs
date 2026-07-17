import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const workbookSource = await readFile(new URL("workbook-bank.js", root), "utf8");
const workbookQuestions = vm.runInNewContext(`${workbookSource}\nWORKBOOK_QUESTIONS`);
const appSource = await readFile(new URL("app.js", root), "utf8");
const coreBlock = appSource.slice(appSource.indexOf("const QUESTIONS"), appSource.indexOf("const WRITING_PROMPTS"));
const coreQuestions = vm.runInNewContext(`${coreBlock}\nQUESTIONS`);
const allQuestions = [...coreQuestions, ...workbookQuestions];
const exampleBank = JSON.parse(await readFile(new URL("data/question-banks/example-bank.json", root), "utf8"));
const generatedBank = JSON.parse(await readFile(new URL("data/question-banks/open-practice-bank.json", root), "utf8"));
allQuestions.push(...generatedBank.questions);

const errors = [];
const ids = new Set();
for (const question of allQuestions) {
  if (!question.id || ids.has(question.id)) errors.push(`Duplicate or missing question id: ${question.id}`);
  ids.add(question.id);
  if (!question.subject || !question.topic || !question.question) errors.push(`Incomplete question: ${question.id}`);
  if (question.type === "open") {
    if (!Array.isArray(question.checkpoints) || question.checkpoints.length < 3) errors.push(`Open question needs checkpoints: ${question.id}`);
  } else if (question.type === "fill") {
    if (!Array.isArray(question.answers) || !question.answers.length || !question.explanation) errors.push(`Fill question is malformed: ${question.id}`);
    if (question.numericTolerance !== undefined && (!Number.isFinite(question.numericTolerance) || question.numericTolerance < 0)) errors.push(`Fill tolerance is invalid: ${question.id}`);
  } else if (!Array.isArray(question.options) || !Number.isInteger(question.answer)) {
    errors.push(`Choice question is malformed: ${question.id}`);
  }
}

if (coreQuestions.length !== 13) errors.push(`Expected 13 core questions, found ${coreQuestions.length}`);
if (workbookQuestions.length !== 42) errors.push(`Expected 42 workbook questions, found ${workbookQuestions.length}`);
if (generatedBank.schemaVersion !== 1 || generatedBank.bank?.id !== "open-practice-2026" || generatedBank.questions.length !== 965) {
  errors.push(`Expected the generated open-practice bank with 965 questions`);
}
const generatedTypeCounts = Object.fromEntries(["choice", "fill", "open"].map(type => [type, generatedBank.questions.filter(question => question.type === type).length]));
for (const [type, expected] of Object.entries({ choice: 215, fill: 705, open: 45 })) {
  if (generatedTypeCounts[type] !== expected) errors.push(`Expected ${expected} generated ${type} questions, found ${generatedTypeCounts[type]}`);
}
const advancedMathCounts = Object.fromEntries(["优化", "矩阵论", "随机过程", "高等概率论"].map(prefix => [prefix, generatedBank.questions.filter(question => question.subject === "math" && question.topic.startsWith(prefix)).length]));
for (const [topic, count] of Object.entries(advancedMathCounts)) {
  if (count !== 160) errors.push(`Expected 160 ${topic} questions, found ${count}`);
}
const requiredAdvancedTopics = [
  "优化 · KKT 条件", "优化 · Lagrange 乘子", "优化 · 光滑性与步长",
  "矩阵论 · Jordan 标准形", "矩阵论 · Rayleigh 商", "矩阵论 · SVD 与谱范数",
  "随机过程 · 鞅", "随机过程 · 平稳 AR(1)",
  "高等概率论 · 收敛方式", "高等概率论 · 中心极限定理", "高等概率论 · 特征函数", "高等概率论 · Borel-Cantelli"
];
for (const topic of requiredAdvancedTopics) {
  if (!generatedBank.questions.some(question => question.topic === topic)) errors.push(`Generated bank is missing advanced topic: ${topic}`);
}
const advancedMathPrefixes = ["优化", "矩阵论", "随机过程", "高等概率论"];
for (const question of coreQuestions.filter(question => question.subject === "math")) {
  if (!advancedMathPrefixes.some(prefix => question.topic.startsWith(prefix))) errors.push(`Core math question is outside the advanced curriculum: ${question.id}`);
}
for (const question of generatedBank.questions) {
  if (!question.source || !question.license) errors.push(`Generated question needs source and license metadata: ${question.id}`);
}
if (exampleBank.schemaVersion !== 1 || !exampleBank.bank?.id || !Array.isArray(exampleBank.questions)) {
  errors.push("Example question bank does not match schema version 1");
}
const exampleIds = new Set();
for (const question of exampleBank.questions || []) {
  if (!question.id || exampleIds.has(question.id)) errors.push(`Example bank has a duplicate or missing id: ${question.id}`);
  exampleIds.add(question.id);
  if (question.type === "choice" && (!Array.isArray(question.options) || !Number.isInteger(question.answer) || !question.explanation)) {
    errors.push(`Example choice question is malformed: ${question.id}`);
  }
  if (question.type === "open" && (!Array.isArray(question.checkpoints) || question.checkpoints.length < 3)) {
    errors.push(`Example open question is malformed: ${question.id}`);
  }
  if (question.type === "fill" && (!Array.isArray(question.answers) || !question.answers.length || !question.explanation)) {
    errors.push(`Example fill question is malformed: ${question.id}`);
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${allQuestions.length} questions with ${ids.size} unique ids.`);
