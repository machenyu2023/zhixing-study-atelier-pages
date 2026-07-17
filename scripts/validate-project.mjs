import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const workbookSource = await readFile(new URL("workbook-bank.js", root), "utf8");
const workbookQuestions = vm.runInNewContext(`${workbookSource}\nWORKBOOK_QUESTIONS`);
const appSource = await readFile(new URL("app.js", root), "utf8");
const coreBlock = appSource.slice(appSource.indexOf("const QUESTIONS"), appSource.indexOf("const WRITING_PROMPTS"));
const coreQuestions = vm.runInNewContext(`${coreBlock}\nQUESTIONS`);
const knowledgeSource = await readFile(new URL("knowledge-base.js", root), "utf8");
const knowledgeLessons = vm.runInNewContext(`${knowledgeSource}\nKNOWLEDGE_LESSONS`);
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
if (generatedBank.schemaVersion !== 1 || generatedBank.bank?.id !== "open-practice-2026" || generatedBank.questions.length !== 1225) {
  errors.push(`Expected the generated open-practice bank with 1225 questions`);
}
const generatedTypeCounts = Object.fromEntries(["choice", "fill", "open"].map(type => [type, generatedBank.questions.filter(question => question.type === type).length]));
for (const [type, expected] of Object.entries({ choice: 475, fill: 675, open: 75 })) {
  if (generatedTypeCounts[type] !== expected) errors.push(`Expected ${expected} generated ${type} questions, found ${generatedTypeCounts[type]}`);
}
if (allQuestions.length !== 1280) errors.push(`Expected 1280 total questions, found ${allQuestions.length}`);
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
if (!Array.isArray(knowledgeLessons) || knowledgeLessons.length !== 17) {
  errors.push(`Expected 17 knowledge lessons, found ${knowledgeLessons?.length ?? 0}`);
} else {
  const lessonIds = new Set();
  const lessonOrders = new Set();
  for (const lesson of knowledgeLessons) {
    if (!lesson.id || lessonIds.has(lesson.id)) errors.push(`Duplicate or missing lesson id: ${lesson.id}`);
    lessonIds.add(lesson.id);
    if (!Number.isInteger(lesson.order) || lessonOrders.has(lesson.order)) errors.push(`Duplicate or invalid lesson order: ${lesson.order}`);
    lessonOrders.add(lesson.order);
    for (const field of ["chapter", "title", "subtitle", "source", "summary", "reflection"]) {
      if (typeof lesson[field] !== "string" || !lesson[field].trim()) errors.push(`Lesson ${lesson.id} needs ${field}`);
    }
    if (!Number.isFinite(lesson.duration) || lesson.duration <= 0) errors.push(`Lesson ${lesson.id} needs a positive duration`);
    if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 3 || lesson.objectives.some(item => typeof item !== "string" || !item.trim())) {
      errors.push(`Lesson ${lesson.id} needs at least three objectives`);
    }
    if (!Array.isArray(lesson.concepts) || lesson.concepts.length < 3 || lesson.concepts.some(item => !item.term || !item.english || !item.definition)) {
      errors.push(`Lesson ${lesson.id} needs at least three complete concepts`);
    }
    if (!lesson.method?.title || !Array.isArray(lesson.method.steps) || lesson.method.steps.length < 3 || lesson.method.steps.some(step => !step.title || !step.body)) {
      errors.push(`Lesson ${lesson.id} needs a complete method`);
    }
    if (!lesson.example?.title || !lesson.example?.prompt || !lesson.example?.analysis) errors.push(`Lesson ${lesson.id} needs a worked example`);
    if (!Array.isArray(lesson.practiceTopics) || !lesson.practiceTopics.length || lesson.practiceTopics.some(topic => typeof topic !== "string" || !topic.trim())) {
      errors.push(`Lesson ${lesson.id} needs practice topics`);
    } else {
      const matchingPractice = allQuestions.filter(question => question.subject === "logic" && lesson.practiceTopics.some(topic => question.topic.includes(topic)));
      if (matchingPractice.length < 4) errors.push(`Lesson ${lesson.id} needs at least four matching logic questions`);
    }
  }
  for (let order = 1; order <= knowledgeLessons.length; order += 1) {
    if (!lessonOrders.has(order)) errors.push(`Knowledge lesson order is missing: ${order}`);
  }
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
