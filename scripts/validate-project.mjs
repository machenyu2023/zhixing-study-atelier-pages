import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const workbookSource = await readFile(new URL("workbook-bank.js", root), "utf8");
const workbookQuestions = vm.runInNewContext(`${workbookSource}\nWORKBOOK_QUESTIONS`);
const appSource = await readFile(new URL("app.js", root), "utf8");
const coreBlock = appSource.slice(appSource.indexOf("const QUESTIONS"), appSource.indexOf("const WRITING_PROMPTS"));
const coreQuestions = vm.runInNewContext(`${coreBlock}\nQUESTIONS`);
const curriculum = JSON.parse(await readFile(new URL("data/curriculum/curriculum-source.json", root), "utf8"));
const ieltsOfficialSpec = JSON.parse(await readFile(new URL("data/sources/ielts-official-spec.json", root), "utf8"));
const allQuestions = [...coreQuestions, ...workbookQuestions];
const exampleBank = JSON.parse(await readFile(new URL("data/question-banks/example-bank.json", root), "utf8"));
const generatedBank = JSON.parse(await readFile(new URL("data/question-banks/open-practice-bank.json", root), "utf8"));
const ieltsOriginalBank = JSON.parse(await readFile(new URL("data/question-banks/ielts-original-bank.json", root), "utf8"));
const advancedMathBank = JSON.parse(await readFile(new URL("data/question-banks/advanced-math-solution-bank.json", root), "utf8"));
allQuestions.push(...generatedBank.questions, ...ieltsOriginalBank.questions, ...advancedMathBank.questions);

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
if (generatedBank.schemaVersion !== 1 || generatedBank.bank?.id !== "open-practice-2026" || generatedBank.questions.length !== 1225) {
  errors.push(`Expected the generated open-practice bank with 1225 questions`);
}
const generatedTypeCounts = Object.fromEntries(["choice", "fill", "open"].map(type => [type, generatedBank.questions.filter(question => question.type === type).length]));
for (const [type, expected] of Object.entries({ choice: 475, fill: 675, open: 75 })) {
  if (generatedTypeCounts[type] !== expected) errors.push(`Expected ${expected} generated ${type} questions, found ${generatedTypeCounts[type]}`);
}
if (allQuestions.length !== 1980) errors.push(`Expected 1980 total questions, found ${allQuestions.length}`);
const generatedLogic = generatedBank.questions.filter(question => question.subject === "logic");
if (generatedLogic.length !== 420) errors.push(`Expected 420 generated logic questions, found ${generatedLogic.length}`);
const totalLogic = allQuestions.filter(question => question.subject === "logic").length;
if (totalLogic !== 452) errors.push(`Expected 452 total logic questions, found ${totalLogic}`);
const requiredLogicTopicFamilies = [
  "习题册", "论证结构", "Toulmin 模型", "谬误识别", "因果与统计", "概率与不确定", "认知偏误",
  "类比与归纳", "语言与定义", "价值权衡", "修辞与说服", "提问与对话", "心智模型"
];
for (const family of requiredLogicTopicFamilies) {
  if (!generatedLogic.some(question => question.topic.startsWith(family))) errors.push(`Generated logic bank is missing topic family: ${family}`);
}
if (generatedLogic.some(question => question.topic === "数列规律")) errors.push("Generated logic bank must not include unrelated number-sequence drills");
const workbookCoreQuestions = generatedLogic.filter(question => question.topic.startsWith("习题册 · 卷"));
if (workbookCoreQuestions.length !== 60) errors.push(`Expected 60 workbook-core questions, found ${workbookCoreQuestions.length}`);
for (const [type, expected] of Object.entries({ fill: 30, open: 30 })) {
  const count = workbookCoreQuestions.filter(question => question.type === type).length;
  if (count !== expected) errors.push(`Expected ${expected} workbook-core ${type} questions, found ${count}`);
}
for (const volume of ["卷一", "卷二", "卷三", "卷四", "卷五", "卷六"]) {
  const count = workbookCoreQuestions.filter(question => question.topic.includes(volume)).length;
  if (count !== 10) errors.push(`Expected 10 workbook-core questions for ${volume}, found ${count}`);
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
if (ieltsOriginalBank.schemaVersion !== 1 || ieltsOriginalBank.bank?.id !== "ielts-original-2026" || ieltsOriginalBank.questions.length !== 300) {
  errors.push("Expected the original IELTS-style bank with 300 questions");
}
const ieltsSectionCounts = {
  reading: ieltsOriginalBank.questions.filter(question => question.id.startsWith("ielts-reading-")).length,
  listening: ieltsOriginalBank.questions.filter(question => question.id.startsWith("ielts-listening-")).length,
  writing: ieltsOriginalBank.questions.filter(question => question.id.startsWith("ielts-writing-")).length,
  language: ieltsOriginalBank.questions.filter(question => question.id.startsWith("ielts-language-")).length
};
for (const [section, expected] of Object.entries({ reading: 160, listening: 60, writing: 40, language: 40 })) {
  if (ieltsSectionCounts[section] !== expected) errors.push(`Expected ${expected} IELTS ${section} questions, found ${ieltsSectionCounts[section]}`);
}
const ieltsTypeCounts = Object.fromEntries(["choice", "fill", "open"].map(type => [type, ieltsOriginalBank.questions.filter(question => question.type === type).length]));
for (const [type, expected] of Object.entries({ choice: 170, fill: 90, open: 40 })) {
  if (ieltsTypeCounts[type] !== expected) errors.push(`Expected ${expected} IELTS ${type} questions, found ${ieltsTypeCounts[type]}`);
}
const ieltsPrompts = new Set();
const englishOnlyFields = ["question", "passage", "options", "answers", "explanation", "topic", "taskType", "checkpoints"];
const collectStrings = (value, key = "") => {
  if (typeof value === "string") return [[key, value]];
  if (Array.isArray(value)) return value.flatMap(item => collectStrings(item, key));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([childKey, child]) => collectStrings(child, childKey));
  return [];
};
for (const question of ieltsOriginalBank.questions) {
  if (question.subject !== "ielts") errors.push(`IELTS bank contains another subject: ${question.id}`);
  if (ieltsPrompts.has(question.question)) errors.push(`IELTS bank has a duplicate prompt: ${question.id}`);
  ieltsPrompts.add(question.question);
  if (!question.source || question.license !== "Project Original - personal study use" || question.referenceOnly !== true || question.officialQuestionTextCopied !== false || !question.sourceUrl?.startsWith("https://ielts.org/")) {
    errors.push(`IELTS question has invalid source metadata: ${question.id}`);
  }
  if (!question.explanation || !question.taskType) errors.push(`IELTS question lacks explanation or task type: ${question.id}`);
  if (question.type === "choice" && (new Set(question.options).size !== question.options.length || question.answer < 0 || question.answer >= question.options.length)) {
    errors.push(`IELTS choice options or answer are invalid: ${question.id}`);
  }
  for (const [key, value] of collectStrings(question)) {
    if (englishOnlyFields.includes(key) && /[\u3400-\u9fff]/u.test(value)) errors.push(`IELTS question contains Chinese text: ${question.id}.${key}`);
  }
}
const totalIelts = allQuestions.filter(question => question.subject === "ielts").length;
if (totalIelts !== 425) errors.push(`Expected 425 total IELTS questions, found ${totalIelts}`);
if (advancedMathBank.schemaVersion !== 1 || advancedMathBank.bank?.id !== "advanced-math-solutions-2026" || advancedMathBank.questions.length !== 400) {
  errors.push("Expected the solution-rich advanced mathematics bank with 400 questions");
}
const advancedMathTypeCounts = Object.fromEntries(["choice", "fill", "open"].map(type => [type, advancedMathBank.questions.filter(question => question.type === type).length]));
for (const [type, expected] of Object.entries({ choice: 160, fill: 160, open: 80 })) {
  if (advancedMathTypeCounts[type] !== expected) errors.push(`Expected ${expected} solution-rich math ${type} questions, found ${advancedMathTypeCounts[type]}`);
}
const advancedMathPrompts = new Set();
for (const domain of ["优化", "矩阵论", "随机过程", "高等概率论"]) {
  const count = advancedMathBank.questions.filter(question => question.topic.startsWith(domain)).length;
  if (count !== 100) errors.push(`Expected 100 solution-rich ${domain} questions, found ${count}`);
}
for (const question of advancedMathBank.questions) {
  if (advancedMathPrompts.has(question.question)) errors.push(`Solution-rich math bank has a duplicate prompt: ${question.id}`);
  advancedMathPrompts.add(question.question);
  if (question.subject !== "math" || question.qualityTier !== "solution-rich" || !question.referenceAnswer || !Array.isArray(question.solutionSteps) || question.solutionSteps.length < 2 || !question.source || !question.license) {
    errors.push(`Solution-rich math question lacks answer metadata: ${question.id}`);
  }
  const mathematicalText = [question.question, question.referenceAnswer, question.explanation, ...(question.solutionSteps || []), ...(question.options || [])].join(" ");
  if (/--|\+-|-\+|×-/.test(mathematicalText)) errors.push(`Solution-rich math question has malformed signed expression: ${question.id}`);
  if (question.type === "choice" && (question.options.length !== 4 || new Set(question.options).size !== 4 || question.answer < 0 || question.answer >= question.options.length)) {
    errors.push(`Solution-rich math choice is invalid: ${question.id}`);
  }
  if (question.type === "fill" && (!question.answers.length || question.answers.some(answer => !String(answer).trim()))) errors.push(`Solution-rich math fill is invalid: ${question.id}`);
  if (question.type === "open" && (question.checkpoints.length < 4 || question.minimumResponseUnits > 5)) errors.push(`Solution-rich math proof problem is invalid: ${question.id}`);
}
const totalMath = allQuestions.filter(question => question.subject === "math").length;
if (totalMath !== 1044) errors.push(`Expected 1044 total mathematics questions, found ${totalMath}`);
if (ieltsOfficialSpec.schemaVersion !== 1 || ieltsOfficialSpec.authority !== "IELTS official website" || ieltsOfficialSpec.pages?.length !== 5) {
  errors.push("IELTS official format snapshot is incomplete");
}
if (ieltsOfficialSpec.policy?.officialQuestionTextStored !== false || ieltsOfficialSpec.policy?.officialQuestionTextCopied !== false || ieltsOfficialSpec.policy?.generatedQuestionsOwnership !== "Project original") {
  errors.push("IELTS official format snapshot violates the no-copy policy");
}
const officialPageIds = new Set();
for (const page of ieltsOfficialSpec.pages || []) {
  if (!page.id || officialPageIds.has(page.id) || !page.url?.startsWith("https://ielts.org/") || !/^[a-f0-9]{64}$/.test(page.contentSha256 || "") || !page.title || !page.description || !page.facts) {
    errors.push(`IELTS official format page metadata is invalid: ${page.id}`);
  }
  officialPageIds.add(page.id);
}
const expectedHandbookTitles = [
  "导论：清晰思考的地图", "逻辑基础：论证的解剖学", "谬误大全：论证出错的全部方式", "论证分析与建构",
  "因果与统计思维", "概率与不确定性思维", "认知偏误大全", "写作即思考", "思考的深度与心智模型",
  "提问、对话与有效表达", "思维工具箱：速查清单", "术语表（中英对照）", "进阶书单与学习路径"
];
const expectedWorkbookTitles = ["卷一 · 语言与定义", "卷二 · 因果与相关", "卷三 · 论证结构", "卷四 · 类比与归纳", "卷五 · 价值权衡与两难", "卷六 · 修辞与说服"];
const digest = content => createHash("sha256").update(content).digest("hex");
if (curriculum.schemaVersion !== 1 || curriculum.handbook?.chapters?.length !== 13 || curriculum.workbook?.volumes?.length !== 6) {
  errors.push("Curriculum must contain 13 handbook chapters and 6 workbook volumes");
} else {
  const handbookTitles = curriculum.handbook.chapters.map(chapter => chapter.title);
  const workbookTitles = curriculum.workbook.volumes.map(volume => volume.title);
  if (JSON.stringify(handbookTitles) !== JSON.stringify(expectedHandbookTitles)) errors.push("Handbook chapter titles or order do not match the source HTML");
  if (JSON.stringify(workbookTitles) !== JSON.stringify(expectedWorkbookTitles)) errors.push("Workbook volume titles or order do not match the source HTML");
  if (!curriculum.workbook.intro?.content.includes("通用自评量规")) errors.push("Workbook usage guide is missing its self-review rubric");
  for (const chapter of curriculum.handbook.chapters) {
    if (!chapter.id || !chapter.subtitle || chapter.content.length < 1500) errors.push(`Handbook chapter is incomplete: ${chapter.id}`);
  }
  for (const volume of curriculum.workbook.volumes) {
    for (const heading of ["第一部分　填空 · 精炼", "第二部分　阅读理解", "第三部分　简答 · 深度思考与写作", "参考与自评要点"]) {
      if (!volume.content.includes(heading)) errors.push(`Workbook ${volume.id} is missing section: ${heading}`);
    }
  }
  const handbookDigest = digest(curriculum.handbook.chapters.map(chapter => chapter.content).join("\n\0\n"));
  const workbookDigest = digest([curriculum.workbook.intro, ...curriculum.workbook.volumes].map(document => document.content).join("\n\0\n"));
  if (handbookDigest !== "ec698573d774779de54cd401f2ec4f3ea0491b6bbb181750c9f24929d0eeef6a") errors.push("Handbook content differs from the supplied HTML snapshot");
  if (workbookDigest !== "ce177b6167619d4319daa0120ad3b3e92467e0515f8484b2446b79b8d1c013c8") errors.push("Workbook content differs from the supplied HTML snapshot");
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
