const KNOWLEDGE_LESSONS = [
  {
    id: "clear-thinking-map",
    order: 1,
    chapter: "学习路径",
    title: "清晰思考的训练闭环",
    subtitle: "把知识变成可调用的思维程序",
    duration: 12,
    source: "《系统学习手册》第 1 章；《每日训练习题册》使用指南",
    summary: "思考不是记住更多结论，而是在真实问题里反复调用一套程序：先澄清命题，再还原论证，随后检查证据、假设和反方，最后重写。知识课负责理解工具，练习负责把工具练成习惯。",
    objectives: ["区分陈述性知识与程序性能力", "掌握学、做、评、重写的循环", "知道遇到不同问题时该调用哪类工具"],
    concepts: [
      { term: "程序性能力", english: "Procedural skill", definition: "不是知道工具名称，而是面对材料时能自动选出并使用合适工具。" },
      { term: "逆向提纲", english: "Reverse outline", definition: "写完后逐段压缩为一句话，用这些句子的顺序检查文章是否真的在推进。" },
      { term: "刻意重写", english: "Deliberate revision", definition: "选最薄弱的一题，在反馈后重做；进步主要来自修正，而不是只增加题量。" }
    ],
    method: { title: "一次完整训练", steps: [
      { title: "学", body: "用 10-15 分钟理解一个工具，只记它解决什么问题。" },
      { title: "做", body: "关闭资料独立作答，强迫自己先产出判断。" },
      { title: "评", body: "检查结论、理由、结构、反方、概念和边界。" },
      { title: "重写", body: "只重写最差的一题，并记下一条可复用的盲点。" }
    ] },
    example: { title: "不要把学习等同于阅读", prompt: "读完一章后觉得自己已经懂了，为什么仍可能不会用？", analysis: "熟悉感只能证明你见过内容。真正的掌握信号是：在新材料中能识别问题、选工具、给出理由，并根据反例修正。" },
    reflection: "今天选一个判断：你会用什么证据证明自己是真的会了，而不只是看懂了？",
    practiceTopics: ["论证结构", "提问与对话"]
  },
  {
    id: "language-definitions",
    order: 2,
    chapter: "卷一",
    title: "语言、定义与概念边界",
    subtitle: "先把关键词钉住，再讨论观点",
    duration: 16,
    source: "《每日训练习题册》卷一；《系统学习手册》第 3、12 章",
    summary: "许多争论表面上在对抗立场，实际是同一个词被赋予了不同含义。先区分歧义、含混和偷换概念，再把抽象词落到可观察的条件，讨论才有共同对象。",
    objectives: ["区分歧义、含混与偷换概念", "用属加种差给概念下定义", "识别不断改窄定义以排除反例的手法"],
    concepts: [
      { term: "歧义", english: "Ambiguity", definition: "一个表达对应多个相对清楚的含义，需要先确定当前使用的是哪一个。" },
      { term: "含混", english: "Vagueness", definition: "词义方向大致明确，但边界或程度没有标准，例如“适当”“很高”。" },
      { term: "偷换概念", english: "Equivocation", definition: "同一论证中悄悄改变关键词含义，借词形相同制造虚假的推导。" },
      { term: "属加种差", english: "Genus and differentia", definition: "先指出概念所属的大类，再说明它区别于同类事物的关键特征。" }
    ],
    method: { title: "概念澄清四问", steps: [
      { title: "所指", body: "你说的这个词具体指什么？" },
      { title: "边界", body: "满足什么条件算，什么情况不算？" },
      { title: "一致", body: "这个词在论证前后是否保持同一含义？" },
      { title: "反例", body: "定义会不会误收或误排一个关键案例？" }
    ] },
    example: { title: "“自由”是否在移动", prompt: "某管理者先把自由解释为自主安排工作，后来又说真正自由就是投入更多时间。", analysis: "词没有变化，标准却从自主权移动为额外投入。应先要求分别定义“自主安排”和“为结果负责”，再讨论工作要求是否合理。" },
    reflection: "选一个你常用的抽象词，为它写出一个包含项、一个排除项和一个边界案例。",
    practiceTopics: ["语言与定义"]
  },
  {
    id: "argument-anatomy",
    order: 3,
    chapter: "第 2 章",
    title: "论证的解剖学",
    subtitle: "从句子堆里找出前提、结论与推理类型",
    duration: 18,
    source: "《系统学习手册》第 2 章；《每日训练习题册》卷三",
    summary: "论证不是观点的罗列，而是用一个或多个前提支持结论。分析时先把口语材料还原成标准形式，再判断它是演绎、归纳还是溯因，最后用有效性和前提真实性分别检查。",
    objectives: ["识别命题、前提和结论", "区分演绎、归纳与溯因", "分开评价有效性与可靠性", "掌握四种条件推理形式"],
    concepts: [
      { term: "演绎", english: "Deduction", definition: "若前提为真，结论必然为真；重点检查结构是否有效。" },
      { term: "归纳", english: "Induction", definition: "从有限观察推出一般规律，结论只能获得程度不同的支持。" },
      { term: "溯因", english: "Abduction", definition: "从现象推测最佳解释，但最佳不等于唯一。" },
      { term: "可靠", english: "Sound", definition: "一个演绎论证既有效，而且所有前提确实为真。" }
    ],
    method: { title: "标准形式还原", steps: [
      { title: "找结论", body: "作者最终想让我相信或去做什么？" },
      { title: "列前提", body: "哪些句子被当作支持理由？" },
      { title: "判类型", body: "结论被声称为必然、或然，还是最佳解释？" },
      { title: "分两关", body: "先查结构能否推出，再查前提是否可信。" }
    ] },
    example: { title: "地湿了，所以刚下过雨？", prompt: "若下雨则地湿；现在地湿；所以刚下过雨。", analysis: "这是肯定后件，结构无效。洒水车、清洁或水管破裂都能产生同一结果。前提可以都真，结论仍推不出来。" },
    reflection: "把今天看到的一条广告还原成两条前提和一个结论，并标出推理类型。",
    practiceTopics: ["论证结构", "条件推理"]
  },
  {
    id: "fallacy-system",
    order: 4,
    chapter: "第 3 章",
    title: "谬误的五类地图",
    subtitle: "识别推理缺陷，但不做只会贴标签的人",
    duration: 22,
    source: "《系统学习手册》第 3 章；《每日训练习题册》卷一、二、四、五、六",
    summary: "谬误按问题来源可分为相关性、归纳与因果、含混、预设和形式五类。识别名称只是第一步，更重要的是指出理由与结论之间到底断在哪里，并提出能修复论证的证据或限定。",
    objectives: ["用五类地图快速定位问题", "掌握相关性、充分性、隐含前提三问", "避免把有谬误误判为结论必假"],
    concepts: [
      { term: "相关性谬误", english: "Relevance fallacy", definition: "理由看似有力，却没有回答结论需要的证据问题。" },
      { term: "预设谬误", english: "Presumption fallacy", definition: "把尚未证明或未获同意的内容偷偷塞进问题或前提。" },
      { term: "形式谬误", english: "Formal fallacy", definition: "错误来自推理结构，与换成什么具体内容无关。" },
      { term: "谬误谬误", english: "Fallacy fallacy", definition: "从“论证有缺陷”直接跳到“结论一定为假”。" }
    ],
    method: { title: "通用反驳三问", steps: [
      { title: "相关吗", body: "这个理由真的支持正在讨论的结论吗？" },
      { title: "够用吗", body: "即使理由为真，是否足以推出这么强的结论？" },
      { title: "夹带了吗", body: "推导是否依赖一个没有被说明或证明的假设？" }
    ] },
    example: { title: "来源可疑不等于内容必假", prompt: "某观点由利益相关方提出，所以这个观点是错的。", analysis: "利益关系应提高核查标准，但不能代替对证据的分析。正确动作是查研究设计、数据和替代解释，而不是用动机直接判真假。" },
    reflection: "找一条你不同意的观点：先不用谬误名称，只写出推理断裂的具体位置。",
    practiceTopics: ["谬误识别"]
  },
  {
    id: "toulmin-construction",
    order: 5,
    chapter: "第 4 章",
    title: "Toulmin 模型与论证建构",
    subtitle: "把依据连接到主张的那座桥写出来",
    duration: 20,
    source: "《系统学习手册》第 4 章；《每日训练习题册》卷三",
    summary: "现实论证往往不是简单的前提到结论。Toulmin 模型把它拆成主张、依据、理据、支撑、限定和反驳。最容易被省略也最容易出错的是理据：为什么这条依据可以支持这个主张。",
    objectives: ["掌握 Toulmin 六要素", "补全隐含假设", "区分并列支撑与链式支撑", "用钢人原则处理反方"],
    concepts: [
      { term: "理据", english: "Warrant", definition: "把依据连接到主张的一般规则或判断，是论证中最关键的桥。" },
      { term: "限定词", english: "Qualifier", definition: "说明主张强度和适用条件，例如通常、很可能、在某条件下。" },
      { term: "反驳", english: "Rebuttal", definition: "主动说明主张可能失效的例外，并决定如何回应。" },
      { term: "钢人原则", english: "Steelman", definition: "先用对方认可的最强版本复述其观点，再提出回应。" }
    ],
    method: { title: "搭一段稳健论证", steps: [
      { title: "主张", body: "先把要捍卫的判断压缩为一句可争辩的话。" },
      { title: "依据", body: "提供可核查的事实、数据或案例。" },
      { title: "理据", body: "明确写出依据为什么能够支持主张。" },
      { title: "边界", body: "加入限定、最强反方和例外条件。" }
    ] },
    example: { title: "名校经历能证明胜任吗", prompt: "候选人毕业于名校，所以一定适合这个岗位。", analysis: "依据是名校经历，主张是胜任岗位，隐含理据是“名校经历可靠代表本岗位能力”。真正的检验点是这个代表关系，而不是学校名气本身。" },
    reflection: "为你今天的一条主张分别写出依据和理据；如果两句几乎一样，说明桥还没搭出来。",
    practiceTopics: ["Toulmin 模型", "论证结构"]
  },
  {
    id: "causal-statistics",
    order: 6,
    chapter: "第 5 章 / 卷二",
    title: "因果与统计思维",
    subtitle: "相关只是线索，不是因果判决",
    duration: 22,
    source: "《系统学习手册》第 5 章；《每日训练习题册》卷二",
    summary: "看到 A 与 B 一起变化时，至少要同时考虑 A 导致 B、B 导致 A、第三变量同时影响、双向作用和取样巧合。因果判断的质量，取决于你能否主动生成替代解释并寻找能区分它们的证据。",
    objectives: ["为相关关系生成五类解释", "识别混杂、反向因果和后此谬误", "理解随机对照实验的作用", "识别回归均值、Simpson 悖论和选择偏差"],
    concepts: [
      { term: "混杂因素", english: "Confounder", definition: "同时影响原因候选和结果的第三变量，可能制造虚假相关。" },
      { term: "反向因果", english: "Reverse causation", definition: "实际方向是结果影响原因候选，或两者互相影响。" },
      { term: "回归均值", english: "Regression to the mean", definition: "极端表现之后自然向平均靠近，常被误认为干预有效。" },
      { term: "随机对照", english: "Randomized control", definition: "用随机分组让已知和未知混杂在平均意义上平衡。" }
    ],
    method: { title: "因果七问的核心版", steps: [
      { title: "证据类型", body: "结论来自观察数据还是随机实验？" },
      { title: "替代方向", body: "可能是反向、双向或第三变量吗？" },
      { title: "样本结构", body: "是否存在选择偏差、分层差异或回归均值？" },
      { title: "区分证据", body: "什么新数据能让几个解释给出不同预测？" }
    ] },
    example: { title: "喝咖啡的人更少抑郁", prompt: "长期追踪发现咖啡饮用与较低抑郁率相关。", analysis: "这支持相关，不足以证明咖啡保护大脑。生活方式可能是混杂，抑郁者减少咖啡可能构成反向因果。更可信的因果判断需要实验、机制和多种设计的一致证据。" },
    reflection: "对你最近相信的一条因果说法，至少写出一个反向解释和一个第三变量。",
    practiceTopics: ["因果与统计"]
  },
  {
    id: "probability-uncertainty",
    order: 7,
    chapter: "第 6 章",
    title: "概率与不确定性",
    subtitle: "给信念标概率，并随证据更新",
    duration: 20,
    source: "《系统学习手册》第 6 章",
    summary: "成熟判断很少是非黑即白。概率思维要求从基率出发，根据证据的区分能力更新信念；决策时看概率与结果价值的组合，同时守住不可承受损失和一次性风险的边界。",
    objectives: ["理解先验、证据和后验", "识别基率忽略", "用期望值分析重复决策", "理解校准、小样本波动和厚尾风险"],
    concepts: [
      { term: "基率", english: "Base rate", definition: "在看到个体证据之前，目标事件在总体中的基础发生率。" },
      { term: "Bayes 更新", english: "Bayesian updating", definition: "从先验出发，按证据在真假两种情况下的区分力修正信念。" },
      { term: "期望值", english: "Expected value", definition: "各结果价值乘概率后的总和，适合比较可重复选择。" },
      { term: "校准", english: "Calibration", definition: "声称有某个把握度的判断，在长期中以相近比例兑现。" }
    ],
    method: { title: "不确定判断四步", steps: [
      { title: "先验", body: "这件事在没有新证据时本来有多常见？" },
      { title: "说明力", body: "这条证据在主张真与假时出现概率差多少？" },
      { title: "更新", body: "新把握度应提高多少，而不是直接跳到 0 或 100%。" },
      { title: "行动", body: "结合收益、损失、可重复性和最坏情况决定。" }
    ] },
    example: { title: "高准确率不等于高阳性预测值", prompt: "罕见事件的检测看起来很准，阳性是否就几乎确定？", analysis: "不一定。事件本来极少时，庞大的非事件人群会产生大量假阳性。先把总体换成自然人数，再数真阳性和假阳性，比只看“准确率”可靠。" },
    reflection: "写下一个未来一周可验证的预测和把握度，到期后检查是否过度自信。",
    practiceTopics: ["概率与不确定"]
  },
  {
    id: "cognitive-biases",
    order: 8,
    chapter: "第 7 章",
    title: "认知偏误与去偏系统",
    subtitle: "偏误首先是一面镜子，不是一件攻击工具",
    duration: 22,
    source: "《系统学习手册》第 7 章",
    summary: "偏误不是偶尔粗心，而是直觉系统稳定产生的方向性误差。它们可分为信念、判断、社会和自我四类。真正有效的去偏依赖流程、外部视角和延迟，而不是提醒自己下次更理性。",
    objectives: ["识别四类常见偏误", "区分偏误与论证谬误", "掌握外部视角、事前验尸和延迟决策", "把偏误知识优先用于自查"],
    concepts: [
      { term: "确认偏误", english: "Confirmation bias", definition: "优先搜寻和记住支持已有观点的证据，忽略反例。" },
      { term: "锚定", english: "Anchoring", definition: "判断被最先出现的数字或印象过度牵引。" },
      { term: "基本归因错误", english: "Fundamental attribution error", definition: "解释他人时高估性格、低估处境，解释自己时常反过来。" },
      { term: "规划谬误", english: "Planning fallacy", definition: "只看当前计划的理想路径，系统低估时间与成本。" }
    ],
    method: { title: "三种可靠去偏机制", steps: [
      { title: "流程化", body: "把检查项写进模板，而不是依赖临场自觉。" },
      { title: "外部视角", body: "参考相似项目的真实分布，并主动邀请反对意见。" },
      { title: "事前验尸", body: "假设计划已经失败，倒推最可能的原因。" },
      { title: "延迟", body: "重大且情绪强烈的决定至少跨过一个冷静周期。" }
    ] },
    example: { title: "“三天就能完成”", prompt: "团队按每一步都顺利的内部计划估时。", analysis: "这容易触发规划谬误。应查看过去相似任务实际耗时的分布，使用外部视角，再为依赖和返工留缓冲。" },
    reflection: "选一个你确信的观点，写下什么证据会让你改变看法。若答案是“没有”，它已无法被检验。",
    practiceTopics: ["认知偏误"]
  },
  {
    id: "induction-analogy",
    order: 9,
    chapter: "卷四",
    title: "类比、归纳与样本",
    subtitle: "生动不等于可靠，相似也要与结论相关",
    duration: 18,
    source: "《每日训练习题册》卷四；《系统学习手册》第 3、5 章",
    summary: "归纳只能提供或然支持，强度取决于样本数量、代表性和反例。类比的关键不是总体上像不像，而是两者在与结论相关的属性上是否相似，以及是否存在会改变结论的关键差异。",
    objectives: ["评价样本代表性", "识别仓促概括和幸存者偏差", "检查类比的相关相似与关键差异", "主动寻找反例"],
    concepts: [
      { term: "仓促概括", english: "Hasty generalization", definition: "用过少或不具代表性的观察推出普遍结论。" },
      { term: "幸存者偏差", english: "Survivorship bias", definition: "只分析成功或可见样本，忽略退出和失败者。" },
      { term: "关键差异", english: "Relevant disanalogy", definition: "两个对象在决定结论的属性上存在不同，使类比失效。" },
      { term: "自选择", english: "Self-selection", definition: "参与样本的意愿本身与研究结论相关，导致样本系统偏离总体。" }
    ],
    method: { title: "类比与归纳审查", steps: [
      { title: "样本从哪来", body: "数量够吗，选择机制是否偏向某类对象？" },
      { title: "沉默者在哪", body: "失败、退出或未被观察的案例是否缺席？" },
      { title: "相似点相关吗", body: "被强调的共同点是否真的影响结论？" },
      { title: "差异会改结论吗", body: "找一个与结论直接相关的关键差异或反例。" }
    ] },
    example: { title: "公司像一艘船", prompt: "船需要船长统一指挥，所以公司必须由一个人决定一切。", analysis: "紧急航行和一般经营的时间压力、信息分布与成员激励不同。类比能帮助理解，但这些差异恰好关系到决策权配置，因此不能替代组织证据。" },
    reflection: "找一个你喜欢的类比，同时写出它最贴切的一点和最容易失真的一点。",
    practiceTopics: ["类比与归纳"]
  },
  {
    id: "value-tradeoffs",
    order: 10,
    chapter: "卷五",
    title: "价值权衡与两难",
    subtitle: "先描述清楚冲突，再决定愿意牺牲什么",
    duration: 18,
    source: "《每日训练习题册》卷五；《系统学习手册》第 9、11 章",
    summary: "复杂决策往往不是对错之争，而是两种正当价值无法同时最大化。成熟判断先列出真实选项、双向机会成本和不可逆损失，再用反事实检查，而不是把权衡包装成道德站队。",
    objectives: ["识别虚假两难", "计算双向机会成本", "用归零重选拆解沉没成本", "区分事实分歧与价值优先级分歧"],
    concepts: [
      { term: "机会成本", english: "Opportunity cost", definition: "选择某方案时，被放弃选项中价值最高的收益。" },
      { term: "权衡", english: "Trade-off", definition: "提高一个目标会系统损害另一个目标，无法同时最大化。" },
      { term: "反事实", english: "Counterfactual", definition: "比较如果没有采取当前行动，结果可能如何。" },
      { term: "沉没成本", english: "Sunk cost", definition: "已经发生且无法收回的投入，不应决定今天是否继续。" }
    ],
    method: { title: "两难决策表", steps: [
      { title: "列完整选项", body: "先寻找被二选一叙事隐藏的中间方案。" },
      { title: "写两种价值", body: "分别说明每个阵营真正想保护什么。" },
      { title: "算双向成本", body: "选 A 放弃什么，选 B 又放弃什么。" },
      { title: "做反事实", body: "若从零开始或五年后回看，判断是否变化。" }
    ] },
    example: { title: "有限医疗预算", prompt: "“生命无价，所以任何医疗项目都应无限投入。”", analysis: "重视生命是正当价值，但资源仍有机会成本。更负责的问题是：怎样在公平、个体关怀和总体健康收益之间说明优先级，而不是把讨论者分成善良与冷漠。" },
    reflection: "把一个“我该不该”的问题，改写为“两种什么价值在冲突”。",
    practiceTopics: ["价值权衡"]
  },
  {
    id: "writing-thinking",
    order: 11,
    chapter: "第 8 章",
    title: "写作即思考",
    subtitle: "用一句主张统领结构，用修改暴露判断",
    duration: 20,
    source: "《系统学习手册》第 8 章；《每日训练习题册》通用自评量规",
    summary: "写作不是把已经想好的内容搬到纸上，而是在压缩主张、安排理由、面对反方和删改语言时继续思考。文章的结构应让每一段承担明确任务，并使读者知道这一段与中心判断的关系。",
    objectives: ["把主题改成可检验的中心主张", "使用金字塔和段落结构", "用逆向提纲检查推进", "区分有用限定与含混护甲"],
    concepts: [
      { term: "中心主张", english: "Thesis", definition: "一句明确、可争辩且能统领全文的判断，而不是宽泛主题。" },
      { term: "金字塔结构", english: "Pyramid structure", definition: "先给结论，再用互相区分且共同完备的理由分层支撑。" },
      { term: "段落任务", english: "Paragraph function", definition: "每段只完成一个推进动作，并说明它如何服务中心主张。" },
      { term: "逆向提纲", english: "Reverse outline", definition: "写完后逐段概括功能，检查顺序、重复和断裂。" }
    ],
    method: { title: "一段论证的最小结构", steps: [
      { title: "判断", body: "首句给出本段要证明的明确观点。" },
      { title: "解释", body: "说明这个判断为何成立，写清理据。" },
      { title: "证据", body: "提供案例、事实或数据，而不是重复判断。" },
      { title: "回扣", body: "说明证据如何推进全文，并承认必要边界。" }
    ] },
    example: { title: "从主题到论点", prompt: "主题是“短视频与注意力”。", analysis: "可检验主张应加入对象、机制和条件，例如：在缺乏主动选择与停止规则时，连续推荐更容易打断深度任务。这样才能继续讨论证据和例外。" },
    reflection: "打开你最近的一段文字，为每一段写一个动词：定义、解释、举证、反驳还是总结？",
    practiceTopics: ["论证结构", "修辞与说服"]
  },
  {
    id: "mental-models",
    order: 12,
    chapter: "第 9 章",
    title: "深度思考与心智模型",
    subtitle: "换一个模型，问题的形状也会变化",
    duration: 20,
    source: "《系统学习手册》第 9 章",
    summary: "深度不是使用复杂词，而是从不同模型观察同一问题：还原第一性约束、追问二阶后果、逆向寻找失败条件、识别反馈和延迟。模型不是答案，而是帮助你生成更好问题的透镜。",
    objectives: ["使用第一性原理与逆向思维", "追踪二阶后果", "识别反馈回路和时间延迟", "避免把单一模型套遍所有问题"],
    concepts: [
      { term: "第一性原理", english: "First principles", definition: "剥离类比和惯例，回到不可再分的事实、目标与约束。" },
      { term: "二阶思维", english: "Second-order thinking", definition: "不止问行动会带来什么，还追问随后各方会如何反应。" },
      { term: "逆向思维", english: "Inversion", definition: "从如何失败、如何避免目标反面开始寻找关键条件。" },
      { term: "反馈回路", english: "Feedback loop", definition: "系统输出反过来改变后续输入，可形成强化或平衡回路。" }
    ],
    method: { title: "四镜头重看问题", steps: [
      { title: "拆到底", body: "哪些是事实、哪些只是惯例或类比？" },
      { title: "往后看", body: "下一步之后，各方行为会怎样改变？" },
      { title: "从失败倒推", body: "假设结果很糟，最可能由哪条路径造成？" },
      { title: "画反馈", body: "变量之间是强化、抑制，还是存在时间延迟？" }
    ] },
    example: { title: "只奖励速度会怎样", prompt: "团队用完成数量奖励员工，希望提高效率。", analysis: "一阶效果可能是数量上升；二阶效果可能是质量下降、任务拆碎和指标博弈。激励改变行为后，原来的指标也不再代表真实目标。" },
    reflection: "对一个正在做的决定连续问两次“然后呢”，写出至少一个你原先没考虑的后果。",
    practiceTopics: ["认知偏误", "价值权衡"]
  },
  {
    id: "questions-dialogue",
    order: 13,
    chapter: "第 10 章",
    title: "提问、对话与建设性分歧",
    subtitle: "用问题暴露假设，而不是用标签终止讨论",
    duration: 16,
    source: "《系统学习手册》第 10、11 章",
    summary: "好问题能把笼统主张变成可检验内容，并让分歧落到事实、定义、因果或价值层级。建设性对话先复述对方的最强观点，再用澄清、证据、替代解释和后果问题推进。",
    objectives: ["掌握苏格拉底式问题", "定位分歧层级", "用钢人复述建立共同对象", "把反驳改写成可回答的问题"],
    concepts: [
      { term: "澄清问题", english: "Clarifying question", definition: "要求说明关键词、范围、对象和时间条件。" },
      { term: "证据问题", english: "Evidence question", definition: "追问什么观察支持判断，以及什么证据会改变判断。" },
      { term: "替代解释", english: "Alternative explanation", definition: "提出能解释同一现象的竞争机制，要求证据加以区分。" },
      { term: "分歧层级", english: "Level of disagreement", definition: "区分双方是在事实、定义、因果、预测还是价值优先级上不同。" }
    ],
    method: { title: "六类推进问题", steps: [
      { title: "你具体指什么", body: "先锁定概念、对象和边界。" },
      { title: "依据是什么", body: "把直觉判断转成可核查证据。" },
      { title: "还可能因为什么", body: "生成竞争解释，避免单线归因。" },
      { title: "什么会让你改观", body: "检查立场是否可证伪，并定位真正分歧。" }
    ] },
    example: { title: "把否定改成提问", prompt: "“你这个方案根本不现实。”", analysis: "可改为：方案最依赖的三个条件是什么？其中哪个目前证据最弱？如果成本翻倍，核心结论是否仍成立？这样问题能产生信息，而不是只表达立场。" },
    reflection: "把一句你想说的反驳改写成两个对方可以具体回答的问题。",
    practiceTopics: ["提问与对话", "Toulmin 模型"]
  },
  {
    id: "rhetoric-persuasion",
    order: 14,
    chapter: "卷六",
    title: "修辞、说服与反操纵",
    subtitle: "让修辞服务真实论证，而不是掩盖证据缺口",
    duration: 18,
    source: "《每日训练习题册》卷六；《系统学习手册》第 8、10 章",
    summary: "逻辑决定论证是否站得住，修辞决定听众是否愿意理解。Ethos、pathos 和 logos 都是中性工具；危险在于身份、恐惧、稀缺感或伪数据取代了对主张的证明。",
    objectives: ["识别 ethos、pathos、logos", "根据受众调整证据和措辞", "识别身份绑架、稀缺感和伪数据", "同时保持感染力与证据责任"],
    concepts: [
      { term: "Ethos", english: "Credibility", definition: "说话者凭专业、经历和可信行为建立的信任。" },
      { term: "Pathos", english: "Emotion", definition: "用情绪和具体画面让受众感到问题的重要性。" },
      { term: "Logos", english: "Reason", definition: "用可核查事实和推理结构支持主张。" },
      { term: "受众分析", english: "Audience analysis", definition: "理解听众已知、在意、担忧和可能反驳的内容。" }
    ],
    method: { title: "说服前的责任检查", steps: [
      { title: "主张真实吗", body: "修辞不能把证据不足的主张包装成确定事实。" },
      { title: "信誉相关吗", body: "权威是否真在相关领域，是否披露利益关系？" },
      { title: "情绪替代理由了吗", body: "删掉情绪词后，论证是否仍有支撑？" },
      { title: "受众能复核吗", body: "关键数字、来源和选择条件是否可查？" }
    ] },
    example: { title: "“最后两个名额”", prompt: "销售同时使用成功者身份、失败恐惧、未经说明的 90% 数据和倒计时。", analysis: "先按下暂停键：数据来源是什么？有哪些中间选项？不在现场决定会损失什么？稀缺感只能说明时间压力，不能证明产品价值。" },
    reflection: "回忆一次你被当场说动的经历：对方主要调用了信誉、情绪还是理由？哪一部分最需要复核？",
    practiceTopics: ["修辞与说服", "价值权衡"]
  },
  {
    id: "thinking-checklists",
    order: 15,
    chapter: "第 11 章",
    title: "五张思维速查清单",
    subtitle: "把好判断变成稳定流程，而不是临场运气",
    duration: 18,
    source: "《逻辑 · 论证 · 思考 — 系统学习手册》第 11 章",
    summary: "知识只有进入检查流程，才会在压力下被调用。手册把常见任务整理成五张清单：审查论证、评估信息可信度、写作与发言、重要决策、因果判断。清单的作用不是替你得出答案，而是防止漏掉最常见的关键问题。",
    objectives: ["选择与任务匹配的清单", "按固定顺序检查主张、证据和边界", "把一次错误转写成下次可复用的检查项", "避免清单沦为只勾不想的仪式"],
    concepts: [
      { term: "论证审查", english: "Argument audit", definition: "依次检查主张、前提、隐含假设、反例和结论强度。" },
      { term: "来源审查", english: "Source evaluation", definition: "检查原始来源、专业相关性、利益关系、样本和可复核性。" },
      { term: "决策清单", english: "Decision checklist", definition: "把目标、备选、机会成本、最坏结果和可逆性摆在同一张纸上。" },
      { term: "因果清单", english: "Causal checklist", definition: "为相关关系生成反向、混杂、选择和巧合解释，再寻找区分证据。" }
    ],
    method: { title: "清单的正确用法", steps: [
      { title: "先分类", body: "当前任务是审查信息、建构论证、做决策，还是判断因果？" },
      { title: "逐项写", body: "每项至少写一句具体回答，不只在脑中快速打勾。" },
      { title: "找最弱", body: "完成后只标出一个最薄弱环节，优先补证据或缩小结论。" },
      { title: "沉淀规则", body: "复盘时把重复错误改写成自己的下一条检查项。" }
    ] },
    example: { title: "“一项研究证明远程办公更高效”", prompt: "面对这条消息，怎样使用信息与因果清单？", analysis: "先找研究原文和样本，再确认效率指标与比较组；随后检查自选择、管理成熟度等混杂，并追问什么设计能区分“远程导致高效”和“高效团队更愿远程”。最后把“证明”降到证据实际支持的强度。" },
    reflection: "选一条你今天准备转发的消息，用清单写出最需要核查的一项；若无法核查，你会怎样降低表述强度？",
    practiceTopics: ["习题册", "论证结构", "因果与统计"]
  },
  {
    id: "glossary-reference",
    order: 16,
    chapter: "第 12 章",
    title: "术语表：把思路准确命名",
    subtitle: "名称不是标签，而是可重复调用的检索入口",
    duration: 16,
    source: "《逻辑 · 论证 · 思考 — 系统学习手册》第 12 章",
    summary: "术语表把逻辑、谬误、因果、概率、偏误、写作和心智模型放进同一套中英对照坐标。准确命名能压缩复杂经验，但术语必须跟定义和例子绑定；只会贴标签而说不出推理断点，并不算掌握。",
    objectives: ["用自己的话解释核心术语", "区分相近概念而不混用", "从现象描述反推合适术语", "用新例子验证自己是否真的理解"],
    concepts: [
      { term: "有效与可靠", english: "Valid vs sound", definition: "有效只看演绎结构；可靠还要求全部前提真实。" },
      { term: "混杂因素", english: "Confounder", definition: "同时影响两个变量、可能制造虚假相关的第三因素。" },
      { term: "校准", english: "Calibration", definition: "长期检验主观把握度是否与真实命中率相符。" },
      { term: "钢人原则", english: "Steelman", definition: "先用对方认可的最强版本复述其观点，再回应真实分歧。" }
    ],
    method: { title: "四步掌握一个术语", steps: [
      { title: "先描述", body: "不用术语，先把观察到的思维现象说具体。" },
      { title: "再命名", body: "选择最贴切的中英文术语，并说明为何不是相邻概念。" },
      { title: "下定义", body: "写出判断标准、适用边界和一个容易混淆的反例。" },
      { title: "造新例", body: "换一个场景独立造例；能迁移，才说明真正掌握。" }
    ] },
    example: { title: "“他有利益关系，所以结论必假”", prompt: "这只是人身攻击，还是更准确的起源谬误？", analysis: "先描述断点：说话者的来源被用来直接判定内容真假。更准确的名称是起源或动机谬误。利益关系应触发更严格核查，但不能替代对研究设计和证据的判断。" },
    reflection: "从本周错题中挑一个你会叫名字却解释不清的术语，写定义、反例和一个全新例子。",
    practiceTopics: ["语言与定义", "谬误识别", "概率与不确定"]
  },
  {
    id: "four-week-path",
    order: 17,
    chapter: "第 13 章 / 使用指南",
    title: "四周学习路径与复训机制",
    subtitle: "以手册管懂，以习题册练做",
    duration: 15,
    source: "《逻辑 · 论证 · 思考 — 系统学习手册》第 13 章；《逻辑 · 写作 · 思考 — 每日训练习题册》使用指南",
    summary: "两份材料的分工非常明确：手册建立知识地图，习题册训练实际输出。一次完整训练应包含限时独立作答、先自评、再看参考、重写一题、记录一条盲点。四周后重做同一卷，用答案质量而非阅读时长检验进步。",
    objectives: ["按四周节奏配对手册章节与六卷练习", "执行先答后看、先评后改的顺序", "用重写和盲点记录形成反馈闭环", "通过隔周重做检验迁移而非熟悉感"],
    concepts: [
      { term: "检索练习", english: "Retrieval practice", definition: "关闭材料后主动产出，比重复阅读更能暴露掌握缺口。" },
      { term: "刻意重写", english: "Deliberate revision", definition: "针对最薄弱答案在反馈后重做，使错误真正转化为能力。" },
      { term: "盲点记录", english: "Blind-spot log", definition: "每次只记录一条可在下一次训练中调用的具体规则。" },
      { term: "迁移", english: "Transfer", definition: "在陌生材料和新情境中仍能识别问题并使用合适工具。" }
    ],
    method: { title: "四周主线", steps: [
      { title: "第 1 周", body: "学逻辑基础、谬误与定义；完成卷一和条件推理练习。" },
      { title: "第 2 周", body: "学论证、因果、概率与偏误；完成卷二、卷三和卷四。" },
      { title: "第 3 周", body: "学写作与心智模型；完成卷五并重写一篇论证。" },
      { title: "第 4 周", body: "学提问、清单与修辞；完成卷六并重做第一周最差的一题。" }
    ] },
    example: { title: "一题练透，而不是十题划过", prompt: "做完开放题后，怎样判断下一步该做什么？", analysis: "先按结论、理由、结构、反方、概念、第二层、判断和精炼八项自评；只选最低的一项改。参考答案用于发现缺口，不用于照抄。最后重写整题，并记下下一次能直接执行的规则。" },
    reflection: "为下一周选定一条主线、一个固定训练时段和一条可验证的进步指标。",
    practiceTopics: ["习题册"]
  }
];
