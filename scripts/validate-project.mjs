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

const errors = [];
const ids = new Set();
for (const question of allQuestions) {
  if (!question.id || ids.has(question.id)) errors.push(`Duplicate or missing question id: ${question.id}`);
  ids.add(question.id);
  if (!question.subject || !question.topic || !question.question) errors.push(`Incomplete question: ${question.id}`);
  if (question.type === "open") {
    if (!Array.isArray(question.checkpoints) || question.checkpoints.length < 3) errors.push(`Open question needs checkpoints: ${question.id}`);
  } else if (!Array.isArray(question.options) || !Number.isInteger(question.answer)) {
    errors.push(`Choice question is malformed: ${question.id}`);
  }
}

if (coreQuestions.length !== 13) errors.push(`Expected 13 core questions, found ${coreQuestions.length}`);
if (workbookQuestions.length !== 42) errors.push(`Expected 42 workbook questions, found ${workbookQuestions.length}`);
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
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${allQuestions.length} questions with ${ids.size} unique ids.`);
