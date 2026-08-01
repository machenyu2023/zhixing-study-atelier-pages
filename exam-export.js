(function attachExamExport(root) {
  const SUBJECT_NAMES = {
    ielts: "雅思",
    logic: "逻辑",
    writing: "写作",
    math: "数学"
  };

  const QUESTION_FIELDS = [
    "id", "subject", "topic", "difficulty", "type", "taskType", "question", "passage",
    "options", "answer", "answers", "numericTolerance", "explanation", "checkpoints",
    "referenceAnswer", "solutionSteps", "source", "sourceUrl", "license"
  ];

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function questionType(question) {
    if (question.type === "open") return "open";
    if (question.type === "fill") return "fill";
    return "choice";
  }

  function questionTypeLabel(question) {
    return { choice: "选择题", fill: "填空题", open: "开放题" }[questionType(question)];
  }

  function snapshotQuestion(question) {
    return Object.fromEntries(QUESTION_FIELDS
      .filter(field => question[field] !== undefined)
      .map(field => [field, clone(question[field])]));
  }

  function createSessionSnapshot({ id, title, startedAt, completedAt, status, questions, attempts, openResponses = {} }) {
    const attemptByQuestion = new Map(attempts.map(attempt => [attempt.questionId, attempt]));
    return {
      schemaVersion: 1,
      id,
      title,
      startedAt,
      completedAt,
      status,
      items: questions.map((question, index) => ({
        position: index + 1,
        question: snapshotQuestion(question),
        attempt: clone(attemptByQuestion.get(question.id) || null),
        openResponse: questionType(question) === "open" ? clone(openResponses[question.id] || null) : null
      }))
    };
  }

  function formatDate(value) {
    if (!value) return "未记录";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false
    }).format(date);
  }

  function formatDuration(startedAt, completedAt) {
    const milliseconds = new Date(completedAt).getTime() - new Date(startedAt).getTime();
    if (!Number.isFinite(milliseconds) || milliseconds < 0) return "未记录";
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor(milliseconds % 60000 / 1000);
    return `${minutes} 分 ${seconds} 秒`;
  }

  function fence(value, language = "text") {
    const text = String(value ?? "");
    const runs = text.match(/`+/g) || [];
    const fenceLength = Math.max(3, ...runs.map(run => run.length + 1));
    const marker = "`".repeat(fenceLength);
    return `${marker}${language}\n${text || "（无）"}\n${marker}`;
  }

  function letter(index) {
    return Number.isInteger(index) && index >= 0 ? String.fromCharCode(65 + index) : "-";
  }

  function websiteResult(attempt) {
    if (!attempt) return "未作答";
    if (typeof attempt.correct === "boolean") return attempt.correct ? "正确" : "错误";
    if (Number.isFinite(attempt.points) && Number.isFinite(attempt.maxPoints) && attempt.maxPoints > 0) {
      return `${attempt.points} / ${attempt.maxPoints}（${attempt.scoreSource || "已有评分"}）`;
    }
    return "待 AI 阅卷";
  }

  function userAnswer(item) {
    const { question, attempt, openResponse } = item;
    if (!attempt) return "（未作答）";
    if (questionType(question) === "choice") {
      const selected = Number.isInteger(attempt.selectedAnswer) ? attempt.selectedAnswer : null;
      const selectedText = selected === null ? attempt.answer || "（未记录旧版选择）" : question.options?.[selected];
      return selected === null ? String(selectedText) : `${letter(selected)}. ${selectedText}`;
    }
    if (questionType(question) === "fill") return attempt.answer || "（空白）";
    return attempt.answer || openResponse?.content || "（空白）";
  }

  function standardAnswer(question) {
    if (questionType(question) === "choice") {
      return `${letter(question.answer)}. ${question.options?.[question.answer] ?? "未提供"}`;
    }
    if (questionType(question) === "fill") {
      const tolerance = Number.isFinite(question.numericTolerance) ? `；数值容差 ±${question.numericTolerance}` : "";
      return `${(question.answers || []).join(" / ") || "未提供"}${tolerance}`;
    }
    return question.referenceAnswer || "本题没有唯一标准答案，请依据评分检查点独立评阅。";
  }

  function existingGrade(item) {
    const grading = item.openResponse?.grading || item.attempt?.grading;
    if (!grading) return "无；请 AI 独立评分。";
    const dimensions = grading.dimensions
      ? Object.entries(grading.dimensions).map(([key, score]) => `${key}: ${score}`).join("；")
      : "未记录分项";
    return `${grading.total} / ${grading.maxPoints}；来源：${grading.source}；分项：${dimensions}。此评分仅供复核。`;
  }

  function buildQuestionSection(item) {
    const { question, attempt, position } = item;
    const type = questionType(question);
    const metadata = [
      `- 题目 ID：${question.id}`,
      `- 学科：${SUBJECT_NAMES[question.subject] || question.subject}`,
      `- 题型：${question.taskType || questionTypeLabel(question)}`,
      `- 知识点：${question.topic || "未标注"}`,
      `- 难度：${question.difficulty || "未标注"}`,
      `- 网站初判：${websiteResult(attempt)}`
    ].join("\n");
    const passage = question.passage ? `\n\n### 材料\n\n${fence(question.passage)}` : "";
    const options = type === "choice"
      ? `\n\n### 选项\n\n${fence((question.options || []).map((option, index) => `${letter(index)}. ${option}`).join("\n"))}`
      : "";
    const checkpoints = (question.checkpoints || []).length
      ? `\n\n### 评分检查点\n\n${question.checkpoints.map(item => `- ${item}`).join("\n")}`
      : "";
    const solutionSteps = (question.solutionSteps || []).length
      ? `\n\n### 标准解题步骤\n\n${question.solutionSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`
      : "";
    const explanation = question.explanation
      ? `\n\n### 参考解析\n\n${fence(question.explanation)}`
      : "";
    const source = question.source || question.sourceUrl || question.license
      ? `\n\n### 来源信息\n\n- 来源：${question.source || "未标注"}\n- 链接：${question.sourceUrl || "无"}\n- 许可：${question.license || "未标注"}`
      : "";
    const grade = type === "open" ? `\n\n### 已有评分\n\n${existingGrade(item)}` : "";

    return `## 第 ${position} 题 · ${questionTypeLabel(question)}\n\n${metadata}\n\n### 题目\n\n${fence(question.question)}${passage}${options}\n\n### 我的答案\n\n${fence(userAnswer(item))}\n\n### 标准或参考答案\n\n${fence(standardAnswer(question))}${checkpoints}${solutionSteps}${explanation}${grade}${source}`;
  }

  function sessionSummary(session) {
    const attempts = session.items.map(item => item.attempt).filter(Boolean);
    const objective = attempts.filter(attempt => typeof attempt.correct === "boolean");
    const correct = objective.filter(attempt => attempt.correct).length;
    const scored = attempts.map(attempt => {
      if (Number.isFinite(attempt.points) && Number.isFinite(attempt.maxPoints) && attempt.maxPoints > 0) {
        return attempt.points / attempt.maxPoints * 100;
      }
      if (typeof attempt.correct === "boolean") return attempt.correct ? 100 : 0;
      return null;
    }).filter(score => score !== null);
    const average = scored.length ? Math.round(scored.reduce((sum, score) => sum + score, 0) / scored.length) : null;
    return { answered: attempts.length, objective: objective.length, correct, scored: scored.length, average };
  }

  function buildMarkdown(session) {
    if (!session?.items?.length) throw new Error("答卷没有题目，无法导出");
    const summary = sessionSummary(session);
    const status = session.status === "completed" ? "完整作答" : "提前结束";
    const header = `# 知行学习答卷 · ${session.title}\n\n> 这是从个人刷题网站导出的自包含答卷。文件包含题目、作答、网站初判和参考依据，可直接交给 AI 阅卷。\n\n## 给 AI 的阅卷任务\n\n1. 请逐题独立复核，不要把“网站初判”或“已有评分”直接当成最终结论。\n2. 选择题与填空题按标准答案核对，每题满分 1 分；若答案或题目存在歧义，请明确指出。\n3. 开放题结合评分检查点、参考答案与推导评分，默认满分 20 分；反馈必须引用我的具体作答作为证据。\n4. 全卷综合分采用网站口径：每题先换算为百分制，再对所有已评分题目取等权平均。未作答题标为“未作答”，不要擅自补写。\n5. 请先输出逐题表格，列出题号、AI 判定、得分/满分、关键依据和一条改进建议；再输出客观题正确率、开放题表现、综合分、三个主要薄弱点和下一轮训练建议。\n6. 使用与作答相同的语言反馈；如果一题包含中英文，以题目要求的语言为准。\n\n## 答卷信息\n\n| 项目 | 内容 |\n| --- | --- |\n| 答卷 ID | ${session.id} |\n| 状态 | ${status} |\n| 开始时间 | ${formatDate(session.startedAt)} |\n| 结束时间 | ${formatDate(session.completedAt)} |\n| 用时 | ${formatDuration(session.startedAt, session.completedAt)} |\n| 题目数 | ${session.items.length} |\n| 已作答 | ${summary.answered} |\n| 网站客观题初判 | ${summary.correct} / ${summary.objective} |\n| 网站已有评分题综合分 | ${summary.average === null ? "暂无" : `${summary.average} / 100`} |\n\n---\n\n`;
    return header + session.items.map(buildQuestionSection).join("\n\n---\n\n") + "\n";
  }

  function filenameForSession(session) {
    const safeTitle = String(session.title || "练习答卷")
      .replace(/[\\/:*?\"<>|]/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 48);
    const date = String(session.completedAt || new Date().toISOString()).slice(0, 10);
    return `知行AI阅卷答卷-${safeTitle}-${date}.md`;
  }

  root.ExamExport = {
    buildMarkdown,
    createSessionSnapshot,
    filenameForSession,
    sessionSummary
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
