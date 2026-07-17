const SUBJECTS = {
  ielts: { name: "雅思", color: "var(--red)", label: "IELTS" },
  logic: { name: "逻辑", color: "var(--blue)", label: "LOGIC" },
  writing: { name: "写作", color: "var(--violet)", label: "WRITING" },
  math: { name: "数学", color: "var(--amber)", label: "MATH" }
};

const SCORE_DIMENSIONS = [
  { key: "concept_clarity", label: "概念清晰" },
  { key: "argument_structure", label: "论证结构" },
  { key: "evidence_awareness", label: "证据意识" },
  { key: "counterargument", label: "反方理解" },
  { key: "expression_quality", label: "表达质量" }
];

const QUESTIONS = [
  { id: "i1", subject: "ielts", topic: "语境词义", difficulty: "基础", question: "In the sentence “The proposal was met with considerable scepticism”, the word “scepticism” is closest in meaning to:", options: ["enthusiasm", "doubt", "confusion", "approval"], answer: 1, explanation: `“Be met with scepticism” 表示“受到质疑”。scepticism 的核心含义是 doubt，即对真实性或可行性持怀疑态度。` },
  { id: "i2", subject: "ielts", topic: "阅读推断", difficulty: "进阶", question: "A study found that employees working four days completed the same amount of work as those working five days, while reporting lower stress. Which conclusion is best supported?", options: ["All companies should close on Fridays.", "Shorter weeks may maintain output while improving wellbeing.", "Stress has no relationship with productivity.", "Employees worked longer hours each day."], answer: 1, explanation: `原文只支持“可能维持产出并改善幸福感”。A 过度推广，C 与材料不符，D 没有证据。` },
  { id: "i3", subject: "ielts", topic: "同义替换", difficulty: "基础", question: "Which word best replaces “a dramatic decline” without changing the meaning?", options: ["a slight variation", "a sharp fall", "a steady level", "a temporary rise"], answer: 1, explanation: `dramatic 在数据描述中常表示“显著的、剧烈的”，decline 表示下降，因此 sharp fall 是最准确的同义替换。` },
  { id: "i4", subject: "ielts", topic: "段落主旨", difficulty: "进阶", question: "A paragraph describes how urban trees lower street temperatures, absorb pollutants and reduce storm-water runoff. Its main purpose is to:", options: ["compare tree species", "explain costs of urban planning", "outline environmental benefits of urban trees", "criticise city governments"], answer: 2, explanation: `三个细节都在列举城市树木带来的环境收益，因此主旨是 outline environmental benefits。` },
  { id: "i5", subject: "ielts", topic: "逻辑连接", difficulty: "基础", question: "Which connector best completes the sentence? “The initial results were promising; _____, the sample size was too small to support a firm conclusion.”", options: ["therefore", "similarly", "however", "for example"], answer: 2, explanation: `前半句强调结果乐观，后半句指出样本量不足，两者构成转折关系，因此使用 however。` },
  { id: "l1", subject: "logic", topic: "条件推理", difficulty: "基础", question: "已知“如果项目延期，那么预算会增加”。现在预算没有增加，可以必然推出什么？", options: ["项目没有延期", "项目提前完成", "项目预算减少", "无法得出任何结论"], answer: 0, explanation: `这是充分条件命题 P→Q。由非 Q 可以推出非 P，即“预算未增加”推出“项目未延期”，属于否后式。` },
  { id: "l2", subject: "logic", topic: "三段论", difficulty: "基础", question: "所有哲学家都善于思考；有些教师是哲学家。以下哪项必然为真？", options: ["所有教师都善于思考", "有些教师善于思考", "有些善于思考的人不是教师", "没有教师不善于思考"], answer: 1, explanation: `有些教师属于哲学家，而所有哲学家都善于思考，所以这部分教师必然善于思考。不能把“有些”扩大为“所有”。` },
  { id: "l3", subject: "logic", topic: "论证削弱", difficulty: "进阶", question: "某咖啡店更换招牌后，月销售额增长了 20%，店主认为新招牌带来了增长。哪项最能削弱该结论？", options: ["新招牌使用了暖色", "同期附近写字楼新增了大量入驻员工", "部分老顾客不喜欢新招牌", "招牌制作成本高于预期"], answer: 1, explanation: `新增办公人群提供了销售额增长的另一原因，直接削弱“增长由招牌导致”的因果解释。` },
  { id: "l4", subject: "logic", topic: "集合关系", difficulty: "进阶", question: "没有诗人是冷漠的；有些科学家是诗人。以下哪项一定成立？", options: ["所有科学家都不冷漠", "有些科学家不冷漠", "冷漠的人都不是科学家", "有些诗人不是科学家"], answer: 1, explanation: `有些科学家同时是诗人，而诗人都不冷漠，因此至少有些科学家不冷漠。` },
  { id: "m1", subject: "math", topic: "一元方程", difficulty: "基础", question: "若 3(x − 2) + 5 = 2x + 9，则 x 的值为：", options: ["8", "9", "10", "11"], answer: 2, explanation: `展开得 3x−6+5=2x+9，即 3x−1=2x+9，所以 x=10。` },
  { id: "m2", subject: "math", topic: "概率", difficulty: "基础", question: "袋中有 3 个红球和 2 个蓝球，随机取出 1 个球，取到蓝球的概率是：", options: ["1/5", "2/5", "1/2", "3/5"], answer: 1, explanation: `总球数为 5，蓝球有 2 个，等可能随机抽取时概率为 2/5。` },
  { id: "m3", subject: "math", topic: "数列", difficulty: "基础", question: "等差数列 4, 7, 10, 13, … 的第 10 项是：", options: ["28", "30", "31", "34"], answer: 2, explanation: `首项为 4，公差为 3。第 10 项 a₁₀=4+(10−1)×3=31。` },
  { id: "m4", subject: "math", topic: "几何", difficulty: "进阶", question: "一个圆的半径增加 20%，它的面积增加百分之多少？", options: ["20%", "40%", "44%", "48%"], answer: 2, explanation: `面积与半径平方成正比。新面积为 1.2²=1.44 倍，因此增加 44%。` }
];

const WRITING_PROMPTS = [
  { id: "w1", type: "IELTS Task 2", title: "教育与实践能力", prompt: "Some people think schools should focus on academic subjects, while others believe practical skills are more important. Discuss both views and give your own opinion." },
  { id: "w2", type: "议论文", title: "效率与留白", prompt: "技术不断替我们节省时间，但现代人似乎仍然感到时间不够。请分析这一矛盾，并提出你的观点。" },
  { id: "w3", type: "说明文", title: "解释一个复杂概念", prompt: "选择一个你近期学到的复杂概念，用不超过 500 字向完全不了解它的人解释清楚。" },
  { id: "w4", type: "自由写作", title: "今日观察", prompt: "记录今天一个让你停下来思考的细节。不要急于总结，让具体感受先于结论。" }
];

const DAILY_TASKS = [
  { id: "t1", subject: "ielts", title: "完成 5 道阅读推断题", meta: "25 分钟 · 立即练习" },
  { id: "t2", subject: "logic", title: "复盘条件推理错题", meta: "10 分钟 · 错题本" },
  { id: "t3", subject: "writing", title: "写一个清晰的开头段", meta: "20 分钟 · 写作室" },
  { id: "t4", subject: "math", title: "完成 3 道概率题", meta: "15 分钟 · 立即练习" }
];

const DEFAULT_STATE = {
  attempts: [], wrongIds: [], masteredIds: [], flaggedIds: [], customQuestions: [],
  completedTasks: [], writingDrafts: {}, openResponses: {}, importedBanks: [], rubric: {}, selectedPrompt: "w1"
};

let state = { ...DEFAULT_STATE };
let currentView = "today";
let libraryFilter = "all";
let practiceQueue = [];
let practiceIndex = 0;
let selectedAnswer = null;
let answerSubmitted = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const getQuestions = () => [
  ...QUESTIONS,
  ...(typeof WORKBOOK_QUESTIONS !== "undefined" ? WORKBOOK_QUESTIONS : []),
  ...state.customQuestions
];
const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const todayKey = () => localDateKey();

async function loadState() {
  const loaded = await StudyStorage.load(DEFAULT_STATE);
  return {
    ...DEFAULT_STATE,
    ...loaded,
    openResponses: loaded.openResponses || {},
    importedBanks: loaded.importedBanks || []
  };
}

function saveState() {
  StudyStorage.save(state).catch(() => showToast("学习数据保存失败，请及时导出备份"));
  updateNavCounts();
}

async function init() {
  state = await loadState();
  setDate();
  bindNavigation();
  bindActions();
  renderAll();
  routeFromHash();
  window.addEventListener("hashchange", routeFromHash);
  refreshIcons();
}

function setDate() {
  const now = new Date();
  const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][now.getDay()];
  $("#current-date").textContent = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · ${week}`;
}

function bindNavigation() {
  $$("[data-view]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.view)));
  $$("[data-go-view]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.goView)));
}

function bindActions() {
  $$("[data-start-subject]").forEach(button => button.addEventListener("click", () => startPractice(button.dataset.startSubject)));
  $("#header-start").addEventListener("click", () => navigate("practice"));
  $("#quick-add").addEventListener("click", openQuestionModal);
  $("#library-add").addEventListener("click", openQuestionModal);
  $("#bank-import").addEventListener("click", () => $("#bank-import-input").click());
  $("#bank-import-input").addEventListener("change", event => handleBankImport(event.target.files?.[0]));
  $("#question-search").addEventListener("input", renderLibrary);
  $$("#library-filters .filter-chip").forEach(button => button.addEventListener("click", () => {
    libraryFilter = button.dataset.filter;
    $$("#library-filters .filter-chip").forEach(item => item.classList.toggle("active", item === button));
    renderLibrary();
  }));
  $("#question-form").addEventListener("submit", handleQuestionForm);
  $("#save-draft").addEventListener("click", saveDraft);
  $("#writing-editor").addEventListener("input", () => {
    updateWordCount();
    $("#draft-status").innerHTML = '<i data-lucide="cloud-off"></i>有未保存的修改';
    refreshIcons();
  });
  $("#open-data-menu").addEventListener("click", () => $("#data-modal").showModal());
  $("#close-data-modal").addEventListener("click", () => $("#data-modal").close());
  $("#export-data").addEventListener("click", exportData);
  $("#reset-data").addEventListener("click", resetData);
}

function navigate(view) {
  if (location.hash !== `#${view}`) location.hash = view;
  else showView(view);
}

function routeFromHash() {
  const view = location.hash.replace("#", "") || "today";
  showView($("#view-" + view) ? view : "today");
}

function showView(view) {
  currentView = view;
  $$(".view").forEach(section => section.classList.toggle("active", section.id === `view-${view}`));
  $$(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  const titles = { today: "今日学习", library: "我的题库", practice: "专注练习", review: "错题复盘", writing: "写作室", analytics: "学习数据" };
  $("#view-title").textContent = titles[view];
  if (view === "library") renderLibrary();
  if (view === "review") renderReview();
  if (view === "analytics") renderAnalytics();
  if (view === "writing") renderWriting();
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function renderAll() {
  renderDashboard();
  renderLibrary();
  renderReview();
  renderWriting();
  renderAnalytics();
  updateNavCounts();
}

function renderDashboard() {
  const attemptsToday = state.attempts.filter(item => localDateKey(new Date(item.date)) === todayKey());
  const score = calculateAverageScore(attemptsToday);
  const dailyPercent = Math.min(100, state.completedTasks.length * 25);
  $("#daily-percent").textContent = dailyPercent + "%";
  $("#daily-ring").style.strokeDashoffset = 389.56 * (1 - dailyPercent / 100);
  $("#metrics-strip").innerHTML = [
    [attemptsToday.length, "今日完成", "题"],
    [score === null ? "—" : score, "今日得分", score === null ? "" : "%"],
    [state.wrongIds.length, "待复盘错题", "道"],
    [calculateStreak(), "连续学习", "天"]
  ].map(([value, label, unit]) => `<div class="metric"><span>${label}</span><strong>${value}<small>${unit}</small></strong></div>`).join("");

  $("#daily-task-list").innerHTML = DAILY_TASKS.map(task => {
    const completed = state.completedTasks.includes(task.id);
    return `<div class="task-row ${completed ? "completed" : ""}">
      <button class="task-check" type="button" data-task-id="${task.id}" aria-label="${completed ? "标记为未完成" : "标记为完成"}"><i data-lucide="check"></i></button>
      <span class="task-copy"><b>${task.title}</b><small>${task.meta}</small></span>
      <span class="task-tag ${task.subject}">${SUBJECTS[task.subject].name}</span>
    </div>`;
  }).join("");
  $$("[data-task-id]").forEach(button => button.addEventListener("click", () => toggleTask(button.dataset.taskId)));
  $("#plan-progress").textContent = `${state.completedTasks.length} / ${DAILY_TASKS.length} 完成`;

  renderWeekChart();
  renderSubjectProgress();
  refreshIcons();
}

function toggleTask(id) {
  state.completedTasks = state.completedTasks.includes(id) ? state.completedTasks.filter(item => item !== id) : [...state.completedTasks, id];
  saveState();
  renderDashboard();
}

function renderWeekChart() {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = localDateKey(date);
    return { key, label: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()], today: index === 6 };
  });
  const counts = days.map(day => state.attempts.filter(item => localDateKey(new Date(item.date)) === day.key).length);
  const max = Math.max(5, ...counts);
  $("#week-chart").innerHTML = days.map((day, index) => `<div class="day-column ${day.today ? "today" : ""}"><div class="bar-wrap"><div class="day-bar" title="${counts[index]} 道" style="height:${Math.max(3, counts[index] / max * 100)}%"></div></div><span>${day.label}</span></div>`).join("");
  const weeklyAttempts = state.attempts.filter(item => days.some(day => localDateKey(new Date(item.date)) === day.key));
  const weeklyScore = calculateAverageScore(weeklyAttempts);
  $("#weekly-total").textContent = `${weeklyAttempts.length} 次练习`;
  $("#accuracy-caption").textContent = `平均得分 ${weeklyScore === null ? "—" : weeklyScore + "%"}`;
}

function renderSubjectProgress() {
  $("#subject-progress-grid").innerHTML = Object.entries(SUBJECTS).map(([key, subject]) => {
    const attempts = state.attempts.filter(item => item.subject === key);
    const graded = attempts.filter(item => typeof item.correct === "boolean");
    const openCount = attempts.filter(item => item.mode === "open").length;
    const correct = graded.filter(item => item.correct).length;
    const score = calculateAverageScore(attempts);
    const percent = score ?? Math.min(100, openCount * 10);
    const copy = key === "writing" ? `${Object.keys(state.writingDrafts).length} 篇草稿 · ${openCount} 次微写作` : `${graded.length} 次判分 · ${openCount} 次开放作答`;
    const result = graded.length ? `${correct} 次正确` : openCount ? "持续完成开放练习" : "从今天开始积累";
    return `<div class="subject-progress"><div class="subject-progress-head"><span><b class="dot ${key}"></b>${subject.name}</span><small>${score !== null ? percent + "%" : openCount + " 次"}</small></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%;background:${subject.color}"></div></div><p>${copy} · ${result}</p></div>`;
  }).join("");
}

function renderLibrary() {
  const query = ($("#question-search")?.value || "").trim().toLowerCase();
  let questions = getQuestions().filter(question => `${question.question} ${question.topic} ${question.taskType || "选择题"} ${SUBJECTS[question.subject].name}`.toLowerCase().includes(query));
  if (libraryFilter === "wrong") questions = questions.filter(question => state.wrongIds.includes(question.id));
  else if (libraryFilter === "open") questions = questions.filter(question => question.type === "open");
  else if (libraryFilter !== "all") questions = questions.filter(question => question.subject === libraryFilter);
  $("#question-result-count").textContent = `${questions.length} 道题目`;
  const container = $("#question-list");
  if (!questions.length) {
    container.innerHTML = `<div class="empty-state"><i data-lucide="search-x"></i><h3>没有找到匹配的题目</h3><p>换一个关键词或筛选条件试试。</p></div>`;
    refreshIcons();
    return;
  }
  container.innerHTML = questions.map(question => {
    const isWrong = state.wrongIds.includes(question.id);
    const mastered = state.masteredIds.includes(question.id);
    const response = state.openResponses[question.id];
    const status = question.type === "open"
      ? response?.completedAt ? ["mastered", "已完成"] : response?.content ? ["", "有草稿"] : ["", "未作答"]
      : mastered ? ["mastered", "已掌握"] : isWrong ? ["wrong", "待复盘"] : ["", "未作答"];
    return `<article class="question-row">
      <div class="question-main"><span class="subject-stripe" style="background:${SUBJECTS[question.subject].color}"></span><div class="question-copy"><h3>${escapeHtml(question.question)}</h3><div class="question-meta"><span style="color:${SUBJECTS[question.subject].color}">${SUBJECTS[question.subject].label}</span><span>${escapeHtml(question.topic)}</span><span>${question.taskType || "选择题"}</span><span>${question.difficulty}</span></div></div></div>
      <span class="status-pill ${status[0]}">${status[1]}</span>
      <button class="row-action" type="button" data-practice-id="${question.id}">作答<i data-lucide="arrow-right"></i></button>
    </article>`;
  }).join("");
  $$('[data-practice-id]').forEach(button => button.addEventListener("click", () => startPractice(null, button.dataset.practiceId)));
  refreshIcons();
}

function startPractice(subject, specificId) {
  const questions = getQuestions();
  if (specificId) {
    const selected = questions.find(question => question.id === specificId);
    practiceQueue = selected ? [selected] : [];
  } else {
    practiceQueue = shuffle(subject === "all" ? questions : questions.filter(question => question.subject === subject)).slice(0, 5);
  }
  if (!practiceQueue.length) {
    showToast("这个学科暂时还没有可练习的题目");
    return;
  }
  practiceIndex = 0;
  selectedAnswer = null;
  answerSubmitted = false;
  $("#practice-setup").classList.add("hidden");
  $("#practice-stage").classList.remove("hidden");
  navigate("practice");
  renderQuestion();
}

function renderQuestion() {
  const question = practiceQueue[practiceIndex];
  if (question.type === "open") {
    renderOpenQuestion(question);
    return;
  }
  const percent = (practiceIndex / practiceQueue.length) * 100;
  $("#practice-stage").innerHTML = `<div class="practice-progress"><span>${practiceIndex + 1} / ${practiceQueue.length}</span><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div><span>${SUBJECTS[question.subject].name} · ${question.topic}</span></div>
    <div class="quiz-paper">
      <div class="quiz-meta"><span style="color:${SUBJECTS[question.subject].color}">${SUBJECTS[question.subject].label} / ${question.difficulty}</span><button type="button" id="flag-question" class="${state.flaggedIds.includes(question.id) ? "active" : ""}" title="标记题目" aria-label="标记题目"><i data-lucide="bookmark"></i></button></div>
      <div class="quiz-question">${escapeHtml(question.question)}</div>
      <div class="answer-options">${question.options.map((option, index) => `<button class="answer-option" type="button" data-answer="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join("")}</div>
      <div id="explanation-slot"></div>
      <div class="quiz-actions"><button class="secondary-button" id="quit-practice" type="button"><i data-lucide="x"></i>结束本组</button><button class="primary-button" id="submit-answer" type="button" disabled>提交答案<i data-lucide="arrow-right"></i></button></div>
    </div>`;
  $$('[data-answer]').forEach(button => button.addEventListener("click", () => selectOption(Number(button.dataset.answer))));
  $("#submit-answer").addEventListener("click", submitAnswer);
  $("#quit-practice").addEventListener("click", endPractice);
  $("#flag-question").addEventListener("click", () => toggleFlag(question.id));
  refreshIcons();
}

function selectOption(index) {
  if (answerSubmitted) return;
  selectedAnswer = index;
  $$('[data-answer]').forEach(button => button.classList.toggle("selected", Number(button.dataset.answer) === index));
  $("#submit-answer").disabled = false;
}

function submitAnswer() {
  const question = practiceQueue[practiceIndex];
  if (answerSubmitted) {
    advancePractice();
    return;
  }
  if (selectedAnswer === null) return;
  answerSubmitted = true;
  const correct = selectedAnswer === question.answer;
  state.attempts.push({ id: newAttemptId(), questionId: question.id, subject: question.subject, correct, mode: "choice", points: correct ? 1 : 0, maxPoints: 1, scoreSource: "answer-key", date: new Date().toISOString() });
  if (correct) state.wrongIds = state.wrongIds.filter(id => id !== question.id);
  else if (!state.wrongIds.includes(question.id)) state.wrongIds.push(question.id);
  saveState();
  $$('[data-answer]').forEach(button => {
    const index = Number(button.dataset.answer);
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
    if (index === selectedAnswer && !correct) button.classList.add("incorrect");
  });
  $("#explanation-slot").innerHTML = `<div class="explanation ${correct ? "" : "incorrect"}"><strong>${correct ? "回答正确" : "这次没有答对"}</strong><p>${escapeHtml(question.explanation)}</p></div>`;
  const submit = $("#submit-answer");
  submit.disabled = false;
  submit.innerHTML = practiceIndex < practiceQueue.length - 1 ? '下一题<i data-lucide="arrow-right"></i>' : '完成本组<i data-lucide="check"></i>';
  renderDashboard(); renderReview(); renderAnalytics(); updateNavCounts(); refreshIcons();
}

function renderOpenQuestion(question) {
  const percent = (practiceIndex / practiceQueue.length) * 100;
  const saved = state.openResponses[question.id]?.content || "";
  const passage = question.passage ? `<section class="reading-passage"><span>阅读材料</span><p>${escapeHtml(question.passage)}</p></section>` : "";
  $("#practice-stage").innerHTML = `<div class="practice-progress"><span>${practiceIndex + 1} / ${practiceQueue.length}</span><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div><span>${SUBJECTS[question.subject].name} · ${question.taskType}</span></div>
    <div class="quiz-paper open-paper">
      <div class="quiz-meta"><span style="color:${SUBJECTS[question.subject].color}">${question.taskType.toUpperCase()} / ${escapeHtml(question.topic)}</span><button type="button" id="flag-question" class="${state.flaggedIds.includes(question.id) ? "active" : ""}" title="标记题目" aria-label="标记题目"><i data-lucide="bookmark"></i></button></div>
      ${passage}
      <div class="quiz-question">${escapeHtml(question.question)}</div>
      <div class="open-editor-head"><span id="open-save-status">${saved ? "已载入上次作答" : "原始作答"}</span><strong id="open-response-count">${formatResponseCount(saved, question.wordTarget)}</strong></div>
      <textarea id="open-response" class="open-response" aria-label="开放题作答" placeholder="先写一句明确判断，再展开理由……">${escapeHtml(saved)}</textarea>
      <div id="open-review-slot"></div>
      <div class="quiz-actions open-actions"><button class="secondary-button" id="quit-practice" type="button"><i data-lucide="x"></i>结束本组</button><span><button class="secondary-button" id="save-open-draft" type="button"><i data-lucide="save"></i>保存草稿</button><button class="primary-button" id="complete-open" type="button" ${saved.trim() ? "" : "disabled"}>完成作答<i data-lucide="arrow-right"></i></button></span></div>
    </div>`;
  const editor = $("#open-response");
  editor.addEventListener("input", () => {
    $("#open-response-count").textContent = formatResponseCount(editor.value, question.wordTarget);
    $("#open-save-status").textContent = "有未保存的修改";
    $("#complete-open").disabled = !editor.value.trim();
  });
  $("#save-open-draft").addEventListener("click", () => saveOpenDraft(question));
  $("#complete-open").addEventListener("click", () => submitOpenAnswer(question));
  $("#quit-practice").addEventListener("click", endPractice);
  $("#flag-question").addEventListener("click", () => toggleFlag(question.id));
  refreshIcons();
}

function saveOpenDraft(question) {
  const content = $("#open-response").value.trim();
  if (!content) {
    showToast("写下内容后再保存草稿");
    return;
  }
  state.openResponses[question.id] = { ...(state.openResponses[question.id] || {}), content, savedAt: new Date().toISOString() };
  saveState();
  $("#open-save-status").textContent = `已保存于 ${formatTime(state.openResponses[question.id].savedAt)}`;
  renderLibrary();
  showToast("开放题草稿已保存在本机");
}

function submitOpenAnswer(question) {
  if (answerSubmitted) {
    advancePractice();
    return;
  }
  const editor = $("#open-response");
  const content = editor.value.trim();
  if (countTextUnits(content) < 20) {
    showToast("再展开一点，至少写出一个判断和一条理由");
    return;
  }
  const now = new Date().toISOString();
  state.openResponses[question.id] = { content, savedAt: now, completedAt: now };
  state.attempts.push({ id: newAttemptId(), questionId: question.id, subject: question.subject, correct: null, mode: "open", points: null, maxPoints: null, scoreSource: null, date: now });
  saveState();
  answerSubmitted = true;
  editor.disabled = true;
  $("#save-open-draft").disabled = true;
  $("#open-save-status").textContent = "本次作答已完成";
  renderOpenReview(question, content);
  const complete = $("#complete-open");
  complete.disabled = false;
  complete.innerHTML = practiceIndex < practiceQueue.length - 1 ? '下一题<i data-lucide="arrow-right"></i>' : '完成本组<i data-lucide="check"></i>';
  renderDashboard(); renderAnalytics(); renderLibrary(); refreshIcons();
}

function renderOpenReview(question, content) {
  const aiEndpoint = getAIEndpoint();
  $("#open-review-slot").innerHTML = `<section class="open-review">
    <div><span>SELF REVIEW</span><h3>先检查判断过程，再看表达。</h3></div>
    <ul>${question.checkpoints.map(item => `<li><i data-lucide="circle"></i><span>${escapeHtml(item)}</span></li>`).join("")}</ul>
    <div class="self-score-panel">
      <div class="self-score-heading"><strong>五维自评</strong><span id="self-score-total">10 / 20</span></div>
      ${SCORE_DIMENSIONS.map(dimension => `<label class="score-control"><span>${dimension.label}</span><input type="range" min="0" max="4" step="1" value="2" data-score-dimension="${dimension.key}"/><output>2</output></label>`).join("")}
      <button class="secondary-button compact" id="save-self-score" type="button"><i data-lucide="save"></i>保存自评分</button>
    </div>
    <div class="grading-actions">
      <button class="primary-button compact" id="request-ai-grade" type="button" ${aiEndpoint ? "" : "disabled"} title="${aiEndpoint ? "使用安全后端阅卷" : "当前部署未连接 AI 阅卷后端"}"><i data-lucide="sparkles"></i>AI 阅卷</button>
      <button class="secondary-button compact" id="copy-review-prompt" type="button"><i data-lucide="copy"></i>复制批改提示词</button>
    </div>
    <div id="ai-grade-result"></div>
  </section>`;
  $$('[data-score-dimension]').forEach(input => input.addEventListener("input", () => {
    input.nextElementSibling.value = input.value;
    const total = $$('[data-score-dimension]').reduce((sum, item) => sum + Number(item.value), 0);
    $("#self-score-total").textContent = `${total} / 20`;
  }));
  $("#save-self-score").addEventListener("click", () => saveSelfGrade(question));
  $("#copy-review-prompt").addEventListener("click", () => copyReviewPrompt(question, content));
  if (aiEndpoint) $("#request-ai-grade").addEventListener("click", () => requestAIGrade(question, content));
  refreshIcons();
}

function saveSelfGrade(question) {
  const dimensions = Object.fromEntries($$('[data-score-dimension]').map(input => [input.dataset.scoreDimension, Number(input.value)]));
  const total = Object.values(dimensions).reduce((sum, score) => sum + score, 0);
  const response = state.openResponses[question.id];
  response.grading = { source: "self", dimensions, total, maxPoints: 20, gradedAt: new Date().toISOString() };
  updateLatestOpenAttemptScore(question.id, total, "self");
  saveState();
  renderDashboard();
  renderAnalytics();
  showToast(`自评分已保存：${total} / 20`);
}

async function requestAIGrade(question, content) {
  const button = $("#request-ai-grade");
  button.disabled = true;
  button.innerHTML = '<i data-lucide="loader-circle"></i>阅卷中';
  refreshIcons();
  try {
    const response = await fetch(getAIEndpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: { id: question.id, prompt: question.question, passage: question.passage || "", checkpoints: question.checkpoints || [] },
        answer: content
      })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.code === "AI_NOT_CONFIGURED" ? "AI 阅卷后端尚未配置 API Key" : payload.error || "AI 阅卷失败");
    const grade = payload.grade;
    state.openResponses[question.id].grading = { source: "ai", dimensions: Object.fromEntries(SCORE_DIMENSIONS.map(item => [item.key, grade.dimensions[item.key].score])), total: grade.total, maxPoints: 20, gradedAt: payload.gradedAt, model: payload.model };
    state.openResponses[question.id].aiFeedback = grade;
    updateLatestOpenAttemptScore(question.id, grade.total, "ai");
    saveState();
    renderAIGrade(grade, payload.model);
    renderDashboard();
    renderAnalytics();
    showToast(`AI 阅卷完成：${grade.total} / 20`);
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
    button.innerHTML = '<i data-lucide="sparkles"></i>重新阅卷';
    refreshIcons();
  }
}

function renderAIGrade(grade, model) {
  $("#ai-grade-result").innerHTML = `<section class="ai-grade-report">
    <div class="grade-score"><strong>${grade.total}</strong><span>/ 20</span><small>${escapeHtml(model)}</small></div>
    <div class="grade-dimensions">${SCORE_DIMENSIONS.map(item => `<div><span>${item.label}</span><b>${grade.dimensions[item.key].score} / 4</b><p>${escapeHtml(grade.dimensions[item.key].feedback)}</p></div>`).join("")}</div>
    <p><b>优先修正：</b>${escapeHtml(grade.priority_issue)}</p>
    <p><b>教练追问：</b>${escapeHtml(grade.coaching_question)}</p>
    <p><b>局部改写建议：</b>${escapeHtml(grade.revision_suggestion)}</p>
  </section>`;
}

function updateLatestOpenAttemptScore(questionId, points, source) {
  const attempt = [...state.attempts].reverse().find(item => item.questionId === questionId && item.mode === "open");
  if (!attempt) return;
  attempt.points = points;
  attempt.maxPoints = 20;
  attempt.scoreSource = source;
}

function getAIEndpoint() {
  const configured = window.ZHIXING_CONFIG?.aiGradingEndpoint?.trim();
  if (configured) return configured;
  return ["127.0.0.1", "localhost"].includes(location.hostname) ? "/api/grade" : "";
}

function advancePractice() {
  if (practiceIndex < practiceQueue.length - 1) {
    practiceIndex += 1;
    selectedAnswer = null;
    answerSubmitted = false;
    renderQuestion();
  } else {
    endPractice(true);
  }
}

async function copyReviewPrompt(question, content) {
  const prompt = `你是一名严格但具体的逻辑与写作教练。请批改下面的作答。\n\n按五个维度各给 0-4 分：概念清晰、论证结构、证据意识、反方理解、表达质量。请先指出答案中最好的一个判断，再指出最需要修正的一处跳步；提出一个能迫使我继续思考的问题；最后只示范改写一个关键段落，不要提供整篇标准答案。\n\n题目：${question.question}\n\n我的作答：${content}`;
  try {
    await navigator.clipboard.writeText(prompt);
    showToast("批改提示词已复制");
  } catch {
    showToast("浏览器未允许复制，请使用本地预览地址重试");
  }
}

function endPractice(completed = false) {
  $("#practice-stage").classList.add("hidden");
  $("#practice-setup").classList.remove("hidden");
  if (completed) showToast("本组练习已完成，记录已经保存");
  renderAll();
}

function toggleFlag(id) {
  state.flaggedIds = state.flaggedIds.includes(id) ? state.flaggedIds.filter(item => item !== id) : [...state.flaggedIds, id];
  saveState();
  $("#flag-question").classList.toggle("active");
}

function renderReview() {
  const wrongQuestions = getQuestions().filter(question => state.wrongIds.includes(question.id));
  $("#review-summary").innerHTML = `<div><h2>${wrongQuestions.length ? "把错误变成下一次的判断依据。" : "错题本现在很干净。"}</h2><p>${wrongQuestions.length ? "重做后答对，题目会自动移出待复盘列表；确认掌握后也可以手动归档。" : "练习中答错的题会自动收进这里，方便集中复盘。"}</p></div><div class="review-count">${wrongQuestions.length}<small> 道</small></div>`;
  const container = $("#review-list");
  if (!wrongQuestions.length) {
    container.innerHTML = `<div class="empty-state"><i data-lucide="circle-check-big"></i><h3>暂时没有待复盘的题</h3><p>完成一次练习后，这里会整理你的薄弱点。</p><button class="primary-button" type="button" data-empty-practice>开始练习</button></div>`;
    $('[data-empty-practice]')?.addEventListener("click", () => navigate("practice"));
  } else {
    container.innerHTML = wrongQuestions.map(question => `<article class="review-item"><div><span class="task-tag ${question.subject}">${SUBJECTS[question.subject].name} · ${escapeHtml(question.topic)}</span><h3>${escapeHtml(question.question)}</h3><p>关键解析：${escapeHtml(question.explanation)}</p></div><div class="review-actions"><button class="secondary-button compact" type="button" data-master-id="${question.id}"><i data-lucide="archive"></i>已掌握</button><button class="primary-button compact" type="button" data-retry-id="${question.id}"><i data-lucide="rotate-ccw"></i>重做</button></div></article>`).join("");
    $$('[data-retry-id]').forEach(button => button.addEventListener("click", () => startPractice(null, button.dataset.retryId)));
    $$('[data-master-id]').forEach(button => button.addEventListener("click", () => markMastered(button.dataset.masterId)));
  }
  refreshIcons();
}

function markMastered(id) {
  state.wrongIds = state.wrongIds.filter(item => item !== id);
  if (!state.masteredIds.includes(id)) state.masteredIds.push(id);
  saveState(); renderReview(); renderLibrary(); renderDashboard();
  showToast("已归档为掌握题目");
}

function renderWriting() {
  const selected = WRITING_PROMPTS.find(prompt => prompt.id === state.selectedPrompt) || WRITING_PROMPTS[0];
  $("#prompt-list").innerHTML = WRITING_PROMPTS.map(prompt => `<button class="prompt-item ${prompt.id === selected.id ? "active" : ""}" data-prompt-id="${prompt.id}" type="button"><b>${prompt.title}</b><small>${prompt.type}</small></button>`).join("");
  $("#writing-prompt").innerHTML = `<span>${selected.type.toUpperCase()}</span><h2>${escapeHtml(selected.prompt)}</h2>`;
  $("#writing-editor").value = state.writingDrafts[selected.id]?.content || "";
  $("#draft-status").innerHTML = state.writingDrafts[selected.id] ? `<i data-lucide="cloud-check"></i>上次保存于 ${formatTime(state.writingDrafts[selected.id].savedAt)}` : '<i data-lucide="cloud"></i>尚未保存';
  const rubricItems = [
    ["position", "立场清晰", "读者能在开头识别核心观点"],
    ["structure", "结构完整", "每一段都服务于中心论点"],
    ["evidence", "论据具体", "观点后有解释、例子或证据"],
    ["language", "语言准确", "检查重复、含糊与语法错误"]
  ];
  $("#rubric-list").innerHTML = rubricItems.map(([key, title, copy]) => `<label class="rubric-item"><input type="checkbox" data-rubric="${key}" ${state.rubric[selected.id]?.[key] ? "checked" : ""}/><span><b>${title}</b><small>${copy}</small></span></label>`).join("");
  $$('[data-prompt-id]').forEach(button => button.addEventListener("click", () => selectPrompt(button.dataset.promptId)));
  $$('[data-rubric]').forEach(input => input.addEventListener("change", () => {
    state.rubric[selected.id] = { ...(state.rubric[selected.id] || {}), [input.dataset.rubric]: input.checked };
    saveState();
  }));
  updateWordCount(); refreshIcons();
}

function selectPrompt(id) {
  state.selectedPrompt = id; saveState(); renderWriting();
}

function saveDraft() {
  const content = $("#writing-editor").value;
  state.writingDrafts[state.selectedPrompt] = { content, savedAt: new Date().toISOString() };
  saveState(); renderWriting(); renderDashboard(); renderAnalytics(); showToast("草稿已保存在这台设备上");
}

function updateWordCount() {
  const text = $("#writing-editor").value.trim();
  const englishWords = (text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
  const chineseChars = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const count = countTextUnits(text);
  $("#word-count").textContent = `${count} ${chineseChars > englishWords ? "字" : "词"}`;
}

function renderAnalytics() {
  const total = state.attempts.length;
  const graded = state.attempts.filter(item => typeof item.correct === "boolean");
  const correct = graded.filter(item => item.correct).length;
  const openCompleted = state.attempts.filter(item => item.mode === "open").length;
  const accuracy = graded.length ? Math.round(correct / graded.length * 100) : 0;
  const scoredCount = state.attempts.filter(item => attemptScorePercent(item) !== null).length;
  const compositeScore = calculateAverageScore(state.attempts);
  $("#analytics-overview").innerHTML = [
    [total, "累计作答", "每一次都计入学习记录"],
    [compositeScore === null ? "—" : compositeScore + "%", "综合得分", scoredCount ? `${scoredCount} 次作答已有评分` : "完成判分或自评后生成"],
    [graded.length ? accuracy + "%" : "—", "选择题正确率", graded.length ? `${correct} / ${graded.length} 道回答正确` : "完成选择题后生成"],
    [openCompleted, "开放题完成", `${Object.keys(state.openResponses).length} 道已留有作答`]
  ].map(([value, label, copy]) => `<div class="analytics-stat"><span>${label}</span><strong>${value}</strong><small>${copy}</small></div>`).join("");
  $("#performance-list").innerHTML = Object.entries(SUBJECTS).map(([key, subject]) => {
    const attempts = state.attempts.filter(item => item.subject === key);
    const openAttempts = attempts.filter(item => item.mode === "open");
    const score = calculateAverageScore(attempts);
    const percent = score ?? 0;
    const display = score !== null ? percent + "%" : openAttempts.length ? "待评分" : "—";
    return `<div class="performance-row"><span><b class="dot ${key}"></b>${subject.name}</span><div class="progress-track"><div class="progress-fill" style="width:${percent}%;background:${subject.color}"></div></div><strong>${display}</strong></div>`;
  }).join("");
  const recent = [...state.attempts].reverse().slice(0, 6);
  $("#activity-list").innerHTML = recent.length ? recent.map(attempt => {
    const question = getQuestions().find(item => item.id === attempt.questionId);
    const isOpen = attempt.mode === "open";
    const resultClass = isOpen ? "open" : attempt.correct ? "correct" : "wrong";
    const resultIcon = isOpen ? "pen-line" : attempt.correct ? "check" : "x";
    const score = attemptScorePercent(attempt);
    return `<div class="activity-item"><span class="activity-result ${resultClass}"><i data-lucide="${resultIcon}"></i></span><span><b>${question ? escapeHtml(question.question) : "已删除的题目"}</b><small>${SUBJECTS[attempt.subject].name}${question?.taskType ? " · " + question.taskType : ""}${score === null ? "" : " · " + score + " 分"}</small></span><time>${formatTime(attempt.date)}</time></div>`;
  }).join("") : `<div class="empty-state"><i data-lucide="chart-no-axes-combined"></i><h3>还没有练习记录</h3><p>你的作答轨迹会在这里逐步展开。</p></div>`;
  refreshIcons();
}

function openQuestionModal() {
  $("#question-form").reset();
  $("#question-modal").showModal();
}

function handleQuestionForm(event) {
  const submitter = event.submitter;
  if (submitter?.value === "cancel") return;
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  state.customQuestions.push({
    id: `custom-${Date.now()}`, subject: data.get("subject"), topic: data.get("topic").trim(), difficulty: "自定义", type: "choice", taskType: "选择题",
    question: data.get("question").trim(), options: [data.get("optionA"), data.get("optionB"), data.get("optionC"), data.get("optionD")].map(value => value.trim()),
    answer: Number(data.get("answer")), explanation: data.get("explanation").trim()
  });
  saveState(); form.reset(); $("#question-modal").close(); renderLibrary(); showToast("题目已加入你的个人题库");
}

async function handleBankImport(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    if (payload.schemaVersion !== 1 || !payload.bank?.id || !Array.isArray(payload.questions)) {
      throw new Error("题库文件缺少 schemaVersion、bank.id 或 questions");
    }
    const existingIds = new Set(getQuestions().map(question => question.id));
    const imported = payload.questions.map((question, index) => normalizeImportedQuestion(question, payload.bank.id, index));
    const importedIds = new Set();
    for (const question of imported) {
      if (importedIds.has(question.id)) throw new Error(`题库包含重复 ID：${question.id}`);
      importedIds.add(question.id);
    }
    const additions = imported.filter(question => !existingIds.has(question.id));
    if (!additions.length) throw new Error("题库中的题目已经全部存在");
    state.customQuestions.push(...additions);
    state.importedBanks = [
      ...state.importedBanks.filter(bank => bank.id !== payload.bank.id),
      { id: payload.bank.id, title: payload.bank.title || payload.bank.id, version: payload.bank.version || "1.0.0", count: additions.length, importedAt: new Date().toISOString() }
    ];
    saveState();
    renderLibrary();
    renderDashboard();
    showToast(`已导入 ${additions.length} 道题：${payload.bank.title || payload.bank.id}`);
  } catch (error) {
    showToast(`题库导入失败：${error.message}`);
  } finally {
    $("#bank-import-input").value = "";
  }
}

function normalizeImportedQuestion(question, bankId, index) {
  const position = index + 1;
  const type = question.type === "open" ? "open" : "choice";
  if (!question.id || !SUBJECTS[question.subject] || !question.topic || !question.question) {
    throw new Error(`第 ${position} 题缺少 id、subject、topic 或 question`);
  }
  const normalized = {
    ...question,
    id: `bank:${bankId}:${question.id}`,
    type,
    difficulty: question.difficulty || "自定义",
    taskType: question.taskType || (type === "open" ? "开放题" : "选择题"),
    source: question.source || bankId
  };
  if (type === "choice") {
    if (!Array.isArray(question.options) || question.options.length < 2 || !Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length || !question.explanation) {
      throw new Error(`第 ${position} 题的选项、答案索引或解析无效`);
    }
  } else if (!Array.isArray(question.checkpoints) || question.checkpoints.length < 3) {
    throw new Error(`第 ${position} 道开放题至少需要三个评分检查点`);
  }
  return normalized;
}

function exportData() {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = `知行学习数据-${todayKey()}.json`; link.click(); URL.revokeObjectURL(url);
  showToast("学习数据已导出");
}

async function resetData() {
  if (!confirm("确定清空全部练习记录、错题和草稿吗？此操作无法撤销。")) return;
  state = { ...DEFAULT_STATE, attempts: [], wrongIds: [], masteredIds: [], flaggedIds: [], customQuestions: [], completedTasks: [], writingDrafts: {}, openResponses: {}, importedBanks: [], rubric: {} };
  await StudyStorage.clear();
  await StudyStorage.save(state);
  $("#data-modal").close(); renderAll(); showToast("本地学习数据已清空");
}

function updateNavCounts() {
  $("#wrong-count").textContent = state.wrongIds.length;
  $("#library-count").textContent = getQuestions().length;
}

function attemptScorePercent(attempt) {
  if (Number.isFinite(attempt.points) && Number.isFinite(attempt.maxPoints) && attempt.maxPoints > 0) {
    return Math.round(attempt.points / attempt.maxPoints * 100);
  }
  if (typeof attempt.correct === "boolean") return attempt.correct ? 100 : 0;
  return null;
}

function calculateAverageScore(attempts) {
  const scores = attempts.map(attemptScorePercent).filter(score => score !== null);
  if (!scores.length) return null;
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function calculateStreak() {
  const dates = new Set(state.attempts.map(item => localDateKey(new Date(item.date))));
  let streak = 0;
  const cursor = new Date();
  if (!dates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dates.has(localDateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

function formatTime(date) {
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

function countTextUnits(text) {
  const englishWords = (text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
  const chineseChars = (text.match(/[\u3400-\u9fff]/g) || []).length;
  return englishWords + chineseChars;
}

function formatResponseCount(text, target) {
  const englishWords = (text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
  const chineseChars = (text.match(/[\u3400-\u9fff]/g) || []).length;
  return `${countTextUnits(text)} / 建议 ${target} ${chineseChars >= englishWords ? "字" : "词"}`;
}

function newAttemptId() {
  return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  const div = document.createElement("div"); div.textContent = String(value); return div.innerHTML;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
}

document.addEventListener("DOMContentLoaded", init);
