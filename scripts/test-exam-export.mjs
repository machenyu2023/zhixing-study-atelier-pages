import assert from "node:assert/strict";

await import("../exam-export.js");

const questions = [
  {
    id: "choice-1", subject: "logic", topic: "条件推理", difficulty: "基础", type: "choice",
    question: "若 P，则 Q。现在非 Q，可以推出什么？", options: ["P", "非 P", "Q | P", "无法判断"], answer: 1,
    explanation: "使用否定后件式。"
  },
  {
    id: "fill-1", subject: "math", topic: "矩阵论", difficulty: "进阶", type: "fill",
    question: "矩阵的迹是？", answers: ["3", "3.0"], numericTolerance: 0.01, explanation: "对角元之和。"
  },
  {
    id: "open-1", subject: "writing", topic: "论证", difficulty: "进阶", type: "open", taskType: "短文",
    question: "评价材料中的因果论证。", passage: "数据包含 | 管道符和 **Markdown**。", checkpoints: ["识别结论", "检查替代原因", "提出证据"],
    referenceAnswer: "应区分相关与因果。", solutionSteps: ["定位结论", "检查混杂变量"]
  }
];

const attempts = [
  { id: "a1", sessionId: "s1", questionId: "choice-1", mode: "choice", selectedAnswer: 1, selectedOption: "非 P", correct: true, points: 1, maxPoints: 1 },
  { id: "a2", sessionId: "s1", questionId: "fill-1", mode: "fill", answer: "3", correct: true, points: 1, maxPoints: 1 },
  { id: "a3", sessionId: "s1", questionId: "open-1", mode: "open", answer: "我的回答含有 ``` 代码围栏、| 和 # 标题。", correct: null, points: null, maxPoints: null }
];

const session = globalThis.ExamExport.createSessionSnapshot({
  id: "s1",
  title: "混合练习 / 导出测试",
  startedAt: "2026-08-01T10:00:00.000Z",
  completedAt: "2026-08-01T10:12:34.000Z",
  status: "completed",
  questions,
  attempts,
  openResponses: {
    "open-1": { content: attempts[2].answer, grading: { source: "self", total: 12, maxPoints: 20, dimensions: { concept_clarity: 3 } } }
  }
});

const markdown = globalThis.ExamExport.buildMarkdown(session);
assert.match(markdown, /知行学习答卷/);
assert.match(markdown, /B\. 非 P/);
assert.match(markdown, /3\.0/);
assert.match(markdown, /我的回答含有 ``` 代码围栏/);
assert.match(markdown, /数据包含 \| 管道符/);
assert.match(markdown, /12 \/ 20/);
assert.match(markdown, /逐题独立复核/);
assert.equal(globalThis.ExamExport.sessionSummary(session).average, 100);
assert.equal(globalThis.ExamExport.filenameForSession(session), "知行AI阅卷答卷-混合练习---导出测试-2026-08-01.md");

console.log("Validated mixed-question AI grading export.");
