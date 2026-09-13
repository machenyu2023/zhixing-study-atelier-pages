/* Knowledge content is bundled; personal entries and notes share StudyStorage. */
const RemoteSensing = (() => {
  const FIELDS = ["概念", "核心物理过程", "核心公式", "变量解释", "直观理解", "与其他知识的联系", "遥感中的实际应用", "典型卫星 / 传感器", "推荐教材 / 论文 / ATBD", "可进行的 Python 小实验"];
  const LEVELS = ["未评估", "学习中", "能解释", "能推导", "能实现", "能迁移"];
  const ID = /^(?:RS-\d{2}-\d{3}|USR-[a-zA-Z0-9-]{1,80})$/;
  const e = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  let catalog, options, root, loading = false, tab = "course", section = "all", selected = null, query = "", temperature = 300, courseChapter = 0;
  const COURSE = [
    {title:"第 1 章｜遥感究竟测到了什么？", en:"Radiometry and geometry", goals:"建立辐射亮度、辐照度、立体角和观测几何的共同语言。", sections:[
      ["从地表到数字量", "遥感观测不是直接读取‘温度’或‘水分’，而是接收器在有限波段、有限视场和有限积分时间内收集到的电磁能。地表状态决定反射、发射和散射；大气改变传播；光学系统和探测器再把辐射转换成数字量。任何反演都要先写清楚这条链。"],
      ["辐射亮度与辐照度", "辐射亮度（radiance）是沿某一方向、单位投影面积、单位立体角、单位波长的功率：\n\\[L_\\lambda=\\frac{d^3\\Phi}{dA\\cos\\theta\\,d\\Omega\\,d\\lambda}\\]\n单位通常为 W m⁻² sr⁻¹ μm⁻¹。辐照度（irradiance）是到达表面的半球积分：\\[E=\\int_{2\\pi}L(\\Omega)\\cos\\theta\\,d\\Omega.\\] 对各向同性亮度，E=πL。cosθ来自投影面积，不能省略。"],
      ["例题：半球积分", "若一个水平面接收各方向恒定 L=5 W m⁻² sr⁻¹，利用\\[\\int_{2\\pi}\\cos\\theta d\\Omega=\\pi\\]，得到 E=15.71 W m⁻²。若把 E 错写成 2πL，就等于忘记了斜入射光束的投影缩短。"],
      ["自测与实验", "问题：为什么同一目标的 radiance 不是‘目标总能量’？\n答案：它带有方向、面积和光谱微分，描述的是观测几何中的密度量；总功率必须对面积、立体角和波长积分。运行 physics_demos.py 的 radiometry 例子，检查数值是否趋近 πL。"]]},
    {title:"第 2 章｜波长、波段与传感器响应", en:"Spectral sampling and bandpass", goals:"理解连续光谱如何被波段响应函数变成一个像元值。", sections:[
      ["连续谱不是观测值", "真实地表有连续的 L(λ)，传感器只在响应函数 R(λ) 加权后输出：\\[S=\\frac{\\int L(\\lambda)R(\\lambda)d\\lambda}{\\int R(\\lambda)d\\lambda}.\\] 因而‘红波段反射率’是一个加权平均，不是某个中心波长的真值。"],
      ["波长与频率", "频率 ν 与波长 λ 满足 ν=c/λ。按波长和按频率表示的谱密度不同：\\[B_\\nu=B_\\lambda\\frac{\\lambda^2}{c}.\\] 转换时 λ 必须用米，且单位从‘每米’重新换算，不能直接把数值替换。"],
      ["例题：窄带近似何时成立", "若 R(λ) 对称且窄，L(λ) 在带宽内变化很小，则 S≈L(λc)。在气体吸收线、叶绿素红边或水汽强吸收处，曲率大，窄带近似会产生明显偏差；应保留完整 R(λ) 积分。"],
      ["练习", "画一个 0.8–0.9 μm 的高斯 R(λ)，分别对平滑光谱和含窄吸收线光谱积分，比较中心波长取样与波段平均的差异。"]]},
    {title:"第 3 章｜反射率、BRDF 与方向性", en:"Reflectance and BRDF", goals:"把‘反射率’拆成方向分布、积分量和几何效应。", sections:[
      ["BRDF 的定义", "双向反射分布函数（BRDF）是出射亮度与入射辐照度的比：\\[f_r(\\Omega_i,\\Omega_o)=\\frac{dL_o(\\Omega_o)}{dE_i}.\\] 单位 sr⁻¹。它依赖入射方向、出射方向、波长、目标状态和尺度。反射率是对 BRDF 加权积分后的量，不能把二者当同义词。"],
      ["朗伯面与热点", "理想朗伯面 BRDF 为 ρ/π，与方向无关；真实植被和粗糙土壤有镜面峰、阴影和热点。太阳与传感器接近同向时阴影减少，亮度会异常升高。BRDF 归一化必须说明太阳/传感器方向约定。"],
      ["例题：能量约束", "反射半球方向的反射率为\\[\\rho(\\Omega_i)=\\int_{2\\pi}f_r(\\Omega_i,\\Omega_o)\\cos\\theta_o d\\Omega_o.\\] 被动、无增益表面应满足 0≤ρ≤1。一个只拟合某个观测角的经验函数若积分超过 1，虽然局部拟合漂亮，却违反能量约束。"],
      ["练习", "比较朗伯模型与带高斯镜面瓣的 BRDF，绘制不同观测天顶角的反射率；检查改变入射方向后是否仍满足互易性和半球积分约束。"]]},
    {title:"第 4 章｜大气传播与 TOA 反射率", en:"Atmospheric transfer", goals:"从地表反射推到传感器处的 TOA radiance，并识别大气校正假设。", sections:[
      ["最小辐射传输模型", "无散射教学近似下，传感器接收\\[L_{TOA}=L_{path}+T\\,L_{surface}.\\] 更完整的太阳反射模型还包含下行透过率、上行透过率和邻近效应。T=e^{-τ}，τ是光学厚度；大气散射会把其他方向的辐射耦合进来，不能总被一个标量 T 代替。"],
      ["定标与反射率", "Landsat 等产品先用\\[L_\\lambda=M_LQ_{cal}+A_L\\]把 DN 转为 radiance，再用元数据系数得到未做太阳角校正的 ρ′，最后按太阳天顶角进行归一化。必须区分 TOA reflectance 与经过大气模型估计的 surface reflectance。"],
      ["例题：透过率敏感性", "τ=0.2 时 T=0.819；τ=1 时 T=0.368。同样的地表信号在湿气溶胶条件下衰减更强。若把路径辐射当成零，会把大气自身的亮度错误归因于地表。"],
      ["练习", "用三个 τ 和两个路径辐射值生成 TOA 曲线；再反演 L_surface，比较已知 τ 与错估 τ=τ+0.1 时的相对误差。"]]},
    {title:"第 5 章｜热红外：Planck、亮温与 LST", en:"Thermal infrared", goals:"从谱辐射亮度区分亮温、物理温度和发射率。", sections:[
      ["Planck 定律", "黑体谱辐射亮度为\\[B_\\lambda(T)=\\frac{2hc^2}{\\lambda^5[\\exp(hc/(\\lambda k_BT))-1]}.\\] λ 用 m 时结果为 W m⁻² sr⁻¹ m⁻¹；换成每 μm 要乘 10⁻⁶。升温会增大各波长辐射，并使谱峰按 Wien 定律 λ_maxT≈2897.77 μm·K 向短波移动。"],
      ["亮温不是温度计读数", "亮温（brightness temperature）是把观测 radiance 代入黑体 Planck 反函数得到的等效温度。真实地表满足 L≈εB(T)+(1−ε)E_down/π，再经过大气传播；ε、下行辐射和透过率未知时，Tb通常低于或偏离物理温度。"],
      ["例题：10 μm", "300 K 黑体在 10 μm 处 Bλ≈9.924 W m⁻² sr⁻¹ μm⁻¹，谱峰约 9.66 μm。若 ε=0.95 且忽略下行辐射，直接用黑体反演会得到低于 300 K 的 Tb；这不是‘算法坏了’，而是发射率小于 1。"],
      ["练习", "运行 planck_demo.py 绘制 250、300、350 K 曲线；再人为乘以 ε=0.9，计算黑体反演温度，记录‘物理温度—亮温’差值。"]]},
    {title:"第 6 章｜微波、极化与土壤水分", en:"Microwave remote sensing", goals:"理解主动/被动微波观测及介电常数对信号的作用。", sections:[
      ["主动与被动", "被动微波测量自然热辐射，常以亮温 Tb 表示；主动微波（SAR）发射脉冲并测量回波的幅度和相位，常用归一化后向散射 σ⁰。二者频段可相近，但观测机制、几何和噪声不同。"],
      ["介电常数与含水量", "复介电常数 ε*=ε′−iε″（符号取决于时间约定）描述极化储能与损耗。土壤含水量升高通常使 ε′显著增大，改变 Fresnel 反射、穿透深度和粗糙面散射。经验介电模型必须标明土壤质地、频率和温度范围。"],
      ["微波亮温教学模型", "平滑、半无限、无大气的简化模型可写\\[T_b=e(\\theta,m)T_s,\\] 其中 e 是方向发射率。真实 SMAP 反演还需考虑粗糙度、植被光学厚度、土壤温度和极化。"],
      ["练习", "用教学关系 ε′=3+20m 只做敏感性演示，绘制 m=0–0.4 时 Fresnel 发射率变化；明确这不是可直接用于产品反演的土壤介电模型。"]]},
    {title:"第 7 章｜叶片、冠层与植被指数", en:"Canopy radiative transfer", goals:"从叶片吸收与冠层结构理解 NDVI 等指数的来源和局限。", sections:[
      ["Beer–Lambert 只是第一步", "无碰撞太阳光束的冠层透过率可写\\[T(\\theta)=\\exp[-G(\\theta)LAI/\\cos\\theta].\\] LAI、叶倾角分布 G 和太阳天顶角共同决定阴影与穿透。它描述的是未碰撞光束，不能单独给出完整冠层反射光谱。"],
      ["光谱机制", "叶绿素在蓝光和红光强吸收，近红外由叶片内部结构强散射；水分在短波红外有吸收特征。NDVI=(NIR−Red)/(NIR+Red) 是归一化对比量，会受土壤背景、冠层结构、饱和和大气残差影响。"],
      ["例题：指数不是生物量", "若 Red=0.05、NIR=0.45，NDVI=0.80；若两者同时因阴影减半，NDVI仍为 0.80。指数对比例更稳健，但这也说明它不能唯一确定 LAI 或生物量。"],
      ["练习", "建立 LAI=0–6 的 Beer 模型，比较不同太阳天顶角的透过率；再加入土壤反射背景，观察同一 LAI 下 NDVI 的变化。"]]},
    {title:"第 8 章｜前向模型、反演与不确定性", en:"Forward and inverse problems", goals:"把遥感问题写成可检验的模型，理解可辨识性与验证。", sections:[
      ["前向模型先于反演", "给定参数 x、状态和观测条件，通过物理模型 g 预测观测 y：\\[y=g(x,c)+\\epsilon.\\] 反演是由 y 推断 x；若多个参数产生近似相同 y，问题就是病态或不可辨识，不能靠更复杂的优化器凭空创造信息。"],
      ["敏感性与误差传播", "局部一阶近似为\\[\\delta y\\approx J\\delta x,\\quad J_{ij}=\\partial g_i/\\partial x_j.\\] J 的列相似表示参数混淆；观测噪声和先验共同决定后验不确定性。报告反演结果时应同时报告假设、误差来源和验证尺度。"],
      ["例题：两观测两参数", "若 y₁=x₁+x₂、y₂=2x₁+2x₂，两行线性相关，det(J)=0；即使有两个观测，也只能知道 x₁+x₂，无法分别估计两参数。增加一个对 x₁ 敏感的波段或先验，才可能恢复可辨识性。"],
      ["科研练习", "为‘土壤水分—亮温’建立含温度和植被的三参数 toy model，计算有限差分敏感性矩阵，改变观测频率/极化，判断哪种组合最能降低参数相关性。"]]}
  ];
  let revision = 0;

  function text(value, limit = 20000) {
    if (typeof value !== "string" || value.length > limit) throw new Error("文本字段类型或长度不符合要求");
    return value;
  }

  function validateEntry(value, sections) {
    if (!value || !ID.test(value.id) || !sections.includes(value.section)) throw new Error("条目编号或所属板块无效");
    const title = text(value.title, 200).trim();
    if (!title) throw new Error("条目需要标题");
    if (!value.body || Array.isArray(value.body)) throw new Error("条目缺少标准正文");
    const body = Object.fromEntries(FIELDS.map(field => [field, text(value.body[field] ?? "")]));
    for (const key of ["related", "sources"]) {
      if (!Array.isArray(value[key]) || value[key].length > 100 || value[key].some(id => typeof id !== "string" || id.length > 100)) throw new Error("关联条目或来源格式不正确");
    }
    if (value.related.some(id => !ID.test(id))) throw new Error("关联条目编号无效");
    return { id: value.id, section: value.section, title, aliases: text(value.aliases ?? "", 1000), summary: text(value.summary ?? "", 2000), status: text(value.status ?? "个人草稿 · 待核验", 100), related: [...value.related], sources: [...value.sources], body };
  }

  function validateState(value, sections, bundledIds = []) {
    if (!value || !Array.isArray(value.entries) || value.entries.length > 2000 || !value.records || typeof value.records !== "object" || Array.isArray(value.records)) throw new Error("备份缺少条目或学习记录");
    const ids = new Set(bundledIds);
    const entries = value.entries.map(item => {
      const entry = validateEntry(item, sections);
      if (ids.has(entry.id)) throw new Error(`存在重复或内置条目编号：${entry.id}`);
      ids.add(entry.id);
      return entry;
    });
    const records = {};
    if (Object.keys(value.records).length > 10000) throw new Error("学习记录数量过多");
    for (const [id, record] of Object.entries(value.records)) {
      if (!ID.test(id) || !record || !LEVELS.includes(record.level)) throw new Error("学习记录的编号或状态无效");
      records[id] = { note: text(record.note), level: record.level, updated: text(record.updated ?? "", 100) };
    }
    return { entries, records };
  }

  function mergeState(current, incoming) {
    const ids = new Set(current.entries.map(item => item.id));
    const additions = incoming.entries.filter(item => !ids.has(item.id));
    const recordConflicts = Object.keys(incoming.records).filter(id => Object.hasOwn(current.records, id)).length;
    return { state: { entries: [...current.entries, ...additions], records: { ...incoming.records, ...current.records } }, added: additions.length, conflicts: incoming.entries.length - additions.length + recordConflicts, recordsAdded: Object.keys(incoming.records).length - recordConflicts };
  }

  function planck(wavelengthUm, kelvin) {
    if (!Number.isFinite(wavelengthUm) || !Number.isFinite(kelvin) || wavelengthUm <= 0 || kelvin <= 0) throw new Error("波长和绝对温度必须为正数");
    const wavelength = wavelengthUm * 1e-6;
    const h = 6.62607015e-34, c = 299792458, k = 1.380649e-23;
    return 2 * h * c ** 2 / wavelength ** 5 / Math.expm1(h * c / (wavelength * k * kelvin)) * 1e-6;
  }

  const current = () => options.getState() || { entries: [], records: {} };
  const allEntries = () => [...catalog.entries, ...current().entries];
  const recordFor = id => current().records[id] || { note: "", level: LEVELS[0], updated: "" };
  const matches = item => [item.title, item.aliases, item.summary, ...Object.values(item.body), recordFor(item.id).note].join(" ").toLocaleLowerCase().includes(query);
  const sectionName = id => catalog.sections.find(item => item.id === id)?.title || id;

  async function init(settings) {
    options = settings;
    root = settings.root;
    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleChange);
    root.addEventListener("submit", handleSubmit);
    await load();
  }

  async function load() {
    if (loading) return;
    loading = true;
    try {
      const response = await fetch("data/remote-sensing/catalog.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.schemaVersion !== 1 || data.sections?.length !== 12 || JSON.stringify(data.fields) !== JSON.stringify(FIELDS) || !Array.isArray(data.entries) || !Array.isArray(data.sources)) throw new Error("知识库结构不完整");
      data.entries = data.entries.map(item => validateEntry(item, data.sections.map(item => item.id)));
      catalog = data;
      // Keep the original snapshot intact if validation fails, so full-data export can recover it.
      options.setState(validateState(current(), data.sections.map(item => item.id), data.entries.map(item => item.id)));
      render();
    } catch (error) {
      catalog = null;
      root.innerHTML = `<div class="rs-empty"><h3>知识库暂时无法加载</h3><p>${e(error.message)}。个人数据仍保留，可从数据管理导出。</p><button class="secondary-button" data-rs-action="retry">重试</button></div>`;
    } finally { loading = false; }
  }

  function render() {
    if (!root || !catalog) return;
    const entries = allEntries();
    const assessed = entries.filter(item => recordFor(item.id).level !== "未评估").length;
    root.innerHTML = `<section class="rs-hero"><div><span class="section-kicker">REMOTE SENSING · PERSONAL KNOWLEDGE</span><h2>从地表状态，到卫星观测。</h2><p>沿着电磁波的路径，建立自己的遥感物理知识体系。把概念、模型、来源与数值实验连起来，一次弄懂一个物理过程。</p></div><div class="rs-stats"><div><strong>12</strong><span>知识板块</span></div><div><strong>${entries.length}</strong><span>知识条目</span></div><div><strong>${assessed}</strong><span>已自评条目</span></div></div></section>
      <div class="rs-chain" aria-label="物理过程主线">${["地表状态", "电磁相互作用", "反射 / 吸收 / 散射 / 发射", "大气传播", "传感器观测 / TOA 信号", "前向模型", "参数反演"].map(label => `<span>${label}</span>`).join("")}</div>
      <div class="rs-toolbar"><div class="rs-tabs" aria-label="知识库栏目">${[["map", "知识地图"], ["entries", "知识条目"], ["sources", "资料与规范"], ["lab", "物理实验"]].map(([id, label]) => `<button type="button" data-rs-tab="${id}" aria-pressed="${tab === id}">${label}</button>`).join("")}</div><div class="rs-actions"><button type="button" class="secondary-button compact" data-rs-action="new">＋ 新建条目</button><button type="button" class="secondary-button compact" data-rs-action="backup">备份</button><button type="button" class="secondary-button compact" data-rs-action="import">导入</button><button type="button" class="secondary-button compact" data-rs-action="markdown">导出 Markdown</button><input type="file" accept="application/json,.json" id="rs-import-file" class="hidden" aria-label="导入遥感知识库备份"></div></div>
      ${(tab === "map" || tab === "entries") && !selected ? `<div class="rs-search"><input type="search" id="rs-query" aria-label="搜索遥感知识" placeholder="搜索中文概念、英文术语或笔记…" value="${e(query)}"><select id="rs-section" aria-label="筛选知识板块"><option value="all">全部板块</option>${catalog.sections.map(item => `<option value="${item.id}" ${item.id === section ? "selected" : ""}>${item.id} · ${e(item.title)}</option>`).join("")}</select></div>` : ""}
      <div id="rs-content"></div><dialog id="rs-dialog" class="rs-dialog" aria-label="知识条目与资料导入"></dialog>`;
    renderContent();
  }

  function renderContent() {
    const content = root.querySelector("#rs-content");
    if (!content) return;
    if (selected) { renderReader(content); return; }
    if (tab === "course") { renderCourse(content); return; }
    if (tab === "map") {
      const sections = catalog.sections.filter(item => (section === "all" || item.id === section) && ([item.title, item.description, ...item.topics].join(" ").toLocaleLowerCase().includes(query) || allEntries().some(entry => entry.section === item.id && matches(entry))));
      content.innerHTML = `<div class="rs-grid">${sections.map(item => {
        const count = allEntries().filter(entry => entry.section === item.id).length;
        return `<button type="button" class="rs-card" data-rs-section="${item.id}"><small>CHAPTER ${item.id}</small><h3>${e(item.title)}</h3><p>${e(item.description)}</p><div class="rs-tags">${item.topics.map(topic => `<span>${e(topic)}</span>`).join("")}</div><footer><span>${count ? `${count} 个条目` : "主题已规划 · 待整理"}</span><span>进入 →</span></footer></button>`;
      }).join("")}</div>${sections.length ? '<p class="rs-help">目录顺序不等于严格的先修顺序。已有基础时，可以从当前科研问题直接进入相应分支。</p>' : empty("没有匹配的主题", "尝试中文概念或更短的英文关键词。")}`;
    } else if (tab === "entries") {
      const items = allEntries().filter(item => (section === "all" || item.section === section) && matches(item));
      const selectedSection = catalog.sections.find(item => item.id === section);
      content.innerHTML = `${selectedSection ? `<div class="rs-intro"><h3>${e(selectedSection.title)}</h3><p>${e(selectedSection.description)}</p><p>建议前置：${selectedSection.prerequisites.map(sectionName).map(e).join("、") || "基础微积分与量纲意识"}</p><p>待扩展主题：${selectedSection.topics.map(e).join(" · ")}</p></div>` : ""}<div class="rs-entry-list">${items.map(item => `<button class="rs-entry-button" type="button" data-rs-entry="${e(item.id)}"><span class="section-kicker">${e(item.id)} · ${e(sectionName(item.section))}</span><h3>${e(item.title)}</h3><p>${e(item.summary || item.aliases)}</p><span class="rs-badge">${e(item.status)}</span> <span class="rs-badge">学习：${e(recordFor(item.id).level)}</span></button>`).join("")}</div>${items.length ? "" : empty("这里还没有匹配的条目", "可用十项标准模板新建条目，或先清除搜索条件。")}`;
    } else if (tab === "sources") renderSources(content);
    else renderLab(content);
  }

  function renderCourse(content) {
    const ch = COURSE[courseChapter] || COURSE[0];
    content.innerHTML = `<article class="rs-course"><aside class="rs-course-toc"><strong>系统课程 · 8 章</strong>${COURSE.map((item,i)=>`<button type="button" class="${i===courseChapter?'active':''}" data-rs-course="${i}">${item.title}</button>`).join("")}<p>每章包含概念、推导、例题和实验。建议边读边记笔记。</p></aside><main class="rs-course-main"><span class="section-kicker">CHAPTER ${String(courseChapter+1).padStart(2,'0')} · ${e(ch.en)}</span><h2>${e(ch.title)}</h2><p class="rs-course-goal"><b>本章目标：</b>${e(ch.goals)}</p>${ch.sections.map((s,i)=>`<section class="rs-lesson"><h3>${e(s[0])}</h3><div class="rs-prose">${e(s[1])}</div>${i===2?'<details class="rs-exercise"><summary>展开自测解析</summary><p>先写出已知量、单位和假设，再检查数量级与极限。答案若依赖未给出的参数，应明确说明不可唯一确定。</p></details>':''}</section>`).join("")}<div class="rs-course-nav">${courseChapter>0?`<button class="secondary-button compact" data-rs-course="${courseChapter-1}">← 上一章</button>`:'<span></span>'}${courseChapter<COURSE.length-1?`<button class="primary-button compact" data-rs-course="${courseChapter+1}">下一章 →</button>`:'<span class="rs-badge">课程第一版完成</span>'}</div></main></article>`;
    if (typeof renderMathInElement === "function") content.querySelectorAll(".rs-prose").forEach(el=>renderMathInElement(el,{delimiters:[{left:"\\[",right:"\\]",display:true},{left:"\\(",right:"\\)",display:false}],throwOnError:false}));
  }

  function empty(title, description) {
    return `<div class="rs-empty"><h3>${e(title)}</h3><p>${e(description)}</p></div>`;
  }

  function sourceCard(source) {
    const safeUrl = /^https:\/\//.test(source.url) ? source.url : "#";
    return `<section class="rs-source"><span class="section-kicker">${e(source.id)} · ${e(source.institution)} · ${e(source.type)}</span><h3><a class="rs-link" href="${e(safeUrl)}" target="_blank" rel="noopener noreferrer">${e(source.title)} ↗</a></h3><p>定位：${e(source.location)}</p><p>${e(source.scope)}</p><p>核验日期：${e(source.checked)}</p></section>`;
  }

  function courseForSection(id) {
    const map = {"01":0,"02":1,"03":3,"04":3,"05":2,"06":4,"07":5,"08":5,"09":6,"10":7,"11":7,"12":7};
    return COURSE[map[id] ?? 0];
  }

  function renderReader(content) {
    const item = allEntries().find(entry => entry.id === selected);
    if (!item) { selected = null; render(); return; }
    const record = recordFor(item.id);
    const custom = current().entries.some(entry => entry.id === item.id);
    const lesson = courseForSection(item.section);
    const lessonHtml = `<section class="rs-entry-lesson"><div class="section-kicker">配套课程 · ${e(lesson.en)}</div><h3>${e(lesson.title)}</h3><p class="rs-course-goal"><b>学习目标：</b>${e(lesson.goals)}</p>${lesson.sections.map(s => `<section class="rs-lesson"><h4>${e(s[0])}</h4><div class="rs-prose">${e(s[1])}</div></section>`).join("")}<p class="rs-help">以上是连续课程正文；下方字段用于速查、复习和记录个人理解。</p></section>`;
    content.innerHTML = `<article class="rs-reader"><button class="text-button" type="button" data-rs-action="back">← 返回条目列表</button><header><p class="section-kicker">${e(item.id)} · ${e(sectionName(item.section))}</p><h2>${e(item.title)}</h2><p class="rs-help">${e(item.aliases)}</p><span class="rs-badge">${e(item.status)}</span>${custom ? '<div class="rs-actions"><button class="secondary-button compact" type="button" data-rs-action="edit">编辑个人条目</button></div>' : ""}</header>
      ${lessonHtml}${FIELDS.map(field => `<section><h3>${e(field)}</h3><div class="rs-prose ${field === "核心公式" ? "rs-formula" : ""}">${e(item.body[field] || "待补充：保留问题与来源线索，后续逐步完善。")}</div></section>`).join("")}
      ${item.sources.length ? `<h3>可追溯来源</h3>${catalog.sources.filter(source => item.sources.includes(source.id)).map(sourceCard).join("")}` : ""}
      ${item.related.length ? `<h3>关联知识</h3><div class="rs-actions">${item.related.map(id => allEntries().find(entry => entry.id === id)).filter(Boolean).map(entry => `<button class="secondary-button compact" type="button" data-rs-entry="${e(entry.id)}">${e(entry.title)} →</button>`).join("")}</div>` : ""}
      ${item.id === "RS-06-001" ? '<button class="primary-button" type="button" data-rs-tab="lab">打开 Planck 小实验 →</button>' : ""}
      <section class="rs-notes"><h3>我的理解与待解决问题</h3><p class="rs-help">内容核验与学习掌握分别记录。以下笔记与自评保存在当前浏览器，也包含在备份中。</p><label for="rs-level">当前学习状态（自评）</label><select id="rs-level">${LEVELS.map(level => `<option ${record.level === level ? "selected" : ""}>${level}</option>`).join("")}</select><label for="rs-note">个人笔记</label><textarea id="rs-note" maxlength="20000" placeholder="用自己的话解释这个过程；记录假设、推导、阅读位置或下一步实验。">${e(record.note)}</textarea><p id="rs-save-status" class="rs-help" role="status">${record.updated ? "已载入本机记录" : "填写后自动保存"}</p></section></article>`;
    if (typeof renderMathInElement === "function") {
      content.querySelectorAll(".rs-prose").forEach(element => renderMathInElement(element, {
        delimiters: [{left: "\\[", right: "\\]", display: true}, {left: "$$", right: "$$", display: true}, {left: "\\(", right: "\\)", display: false}],
        throwOnError: false, trust: false, maxExpand: 200, maxSize: 20
      }));
    }
  }

  function renderSources(content) {
    const documents = [["README.md", "资料库使用说明"], ["知识地图.md", "完整知识地图"], ["学习路线与进度.md", "学习路线与理解检验"], ["模板/知识条目.md", "标准知识条目模板"], ["模板/资料入库.md", "资料入库与交叉验证模板"], ["模板/模型对比.md", "模型差异对比模板"], ["模板/科研问题.md", "科研问题分析模板"], ["资料/来源登记.md", "来源登记"], ["变更记录.md", "维护记录"]];
      content.innerHTML = `<div class="rs-intro"><h3>让每个结论，都能找到来处。</h3><p>推荐顺序：经典教材 → 官方 ATBD → 高质量综述 → 经典论文 → 官方技术文档 → 开源代码与教学资料。</p><p>当前有 3 个来源已核验并用于内置条目，另有 9 个教材、官方文档、ATBD 和经典论文入口处于“已定位待精读”状态；不同模型保留假设与适用范围的差异。</p></div>${catalog.sources.map(sourceCard).join("")}<section class="rs-source"><h3>长期维护工具</h3><p>资料入库时，先查重，再提取概念、公式、假设、参数与实验，合并进主条目；模型冲突单独对比。个人来源可写入条目的“推荐教材 / 论文 / ATBD”栏并注明核验状态。</p><div class="rs-actions">${documents.map(([path, title]) => `<a class="rs-link" download href="${encodeURI(`docs/remote-sensing/${path}`)}">${e(title)} ↓</a>`).join("")}</div></section><section class="rs-source"><h3>本机资料与备份</h3><p>“备份”保存个人条目、笔记和自评；“导入”可读取遥感备份或本站的完整学习数据备份，只提取遥感部分。合并时保留本机已有的同编号内容。跨设备使用时，请先备份再导入。</p><p>“导出 Markdown”包含内置与个人条目、关联来源及笔记，适合交给 Agent 继续整理。网页不会自动解析论文或运行 Python；可以把资料交给 Agent 后再整合入库。</p></section>`;
  }

  function renderLab(content) {
    content.innerHTML = `<section class="rs-lab"><span class="section-kicker">EXPERIMENT 01 · BLACKBODY RADIATION</span><h3>温度改变，黑体光谱怎样变化？</h3><p class="rs-help">先预测：升温后，10 μm 处的辐射与波长谱峰会怎样变化？再拖动滑块检验。</p><math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="Planck 波长形式：二 h c 平方除以波长五次方，再除以指数 h c 除以波长 k T 减一"><mrow><msub><mi>B</mi><mi>λ</mi></msub><mo stretchy="false">(</mo><mi>T</mi><mo stretchy="false">)</mo><mo>=</mo><mfrac><mrow><mn>2</mn><mi>h</mi><msup><mi>c</mi><mn>2</mn></msup></mrow><mrow><msup><mi>λ</mi><mn>5</mn></msup><mo>[</mo><mi>exp</mi><mo stretchy="false">(</mo><mfrac><mrow><mi>h</mi><mi>c</mi></mrow><mrow><mi>λ</mi><msub><mi>k</mi><mi>B</mi></msub><mi>T</mi></mrow></mfrac><mo stretchy="false">)</mo><mo>−</mo><mn>1</mn><mo>]</mo></mrow></mfrac></mrow></math><label for="rs-temperature">黑体温度 <input id="rs-temperature" type="range" min="200" max="400" step="1" value="${temperature}"><output id="rs-temperature-value">${temperature} K</output></label><div id="rs-plot"></div><p class="rs-lab-readout" id="rs-lab-readout" aria-live="polite"></p><p class="rs-help">实线为当前温度，虚线为 300 K 参照；纵轴固定，便于直接比较。模型：真空中的理想黑体，不含大气、发射率和传感器通道响应。λ 在计算中以 m 输入，结果换算为每 μm；谱峰仅指波长形式。</p><div class="rs-actions"><a class="secondary-button compact rs-link" href="data/remote-sensing/planck_demo.py" download>下载 Python Demo</a><button class="secondary-button compact" type="button" data-rs-action="csv">导出当前光谱 CSV</button><button class="secondary-button compact" type="button" data-rs-entry="RS-06-001">阅读概念与变量 →</button></div><p class="rs-help">Python 仅用标准库，运行 python planck_demo.py，生成 CSV。教学参考：CIMSS Blackbody Radiation Lab（见条目来源）。这不是卫星温度产品反演。</p></section>`;
    drawLab();
  }

  function drawLab() {
    const plot = root.querySelector("#rs-plot");
    if (!plot) return;
    const x = wavelength => 74 + (wavelength - 2) / 28 * 716;
    const y = radiance => 305 - radiance / 45 * 247;
    const curve = kelvin => Array.from({ length: 281 }, (_, index) => {
      const wavelength = 2 + index / 10;
      return `${index ? "L" : "M"}${x(wavelength).toFixed(2)},${y(planck(wavelength, kelvin)).toFixed(2)}`;
    }).join(" ");
    plot.innerHTML = `<svg class="rs-chart" viewBox="0 0 830 365" role="img" aria-label="黑体光谱，横轴波长 2 到 30 微米，纵轴光谱辐射亮度 0 到 45 瓦每平方米每球面度每微米"><title>黑体光谱随温度变化</title><text x="74" y="25">Bλ / (W·m⁻²·sr⁻¹·μm⁻¹)</text>${[0,10,20,30,40].map(value => `<line x1="74" x2="790" y1="${y(value)}" y2="${y(value)}" stroke="#e0e6e0"/><text x="61" y="${y(value)+4}" text-anchor="end">${value}</text>`).join("")}${[2,5,10,15,20,25,30].map(value => `<text x="${x(value)}" y="329" text-anchor="middle">${value}</text>`).join("")}<path d="M74,58 V305 H790" fill="none" stroke="#65796a"/><path d="${curve(300)}" fill="none" stroke="#a5afa7" stroke-width="2" stroke-dasharray="5 5"/><path d="${curve(temperature)}" fill="none" stroke="#245c46" stroke-width="3"/><text x="430" y="355" text-anchor="middle">波长 λ / μm</text></svg>`;
    root.querySelector("#rs-temperature-value").textContent = `${temperature} K`;
    root.querySelector("#rs-lab-readout").textContent = `当前 ${temperature} K：10 μm 处 Bλ = ${planck(10, temperature).toFixed(3)} W·m⁻²·sr⁻¹·μm⁻¹；波长谱峰约 ${ (2897.771955 / temperature).toFixed(2)} μm。`;
  }

  async function persist(statusElement) {
    const thisRevision = ++revision;
    if (statusElement) statusElement.textContent = "正在保存…";
    try {
      await options.persist();
      if (thisRevision === revision && statusElement?.isConnected) statusElement.textContent = "已保存到本机";
      return true;
    } catch {
      if (statusElement?.isConnected) statusElement.textContent = "保存失败，请立即导出备份";
      options.toast("遥感资料保存失败，当前内容仍可导出备份");
      return false;
    }
  }

  function saveRecord() {
    if (!selected) return;
    const value = current();
    value.records[selected] = { note: root.querySelector("#rs-note").value, level: root.querySelector("#rs-level").value, updated: new Date().toISOString() };
    options.setState(value);
    persist(root.querySelector("#rs-save-status"));
  }

  function handleInput(event) {
    if (event.target.id === "rs-query") { query = event.target.value.trim().toLocaleLowerCase(); renderContent(); }
    if (event.target.id === "rs-note") saveRecord();
    if (event.target.id === "rs-temperature") { temperature = Number(event.target.value); drawLab(); }
  }

  function handleChange(event) {
    if (event.target.id === "rs-section") { section = event.target.value; renderContent(); }
    if (event.target.id === "rs-level") saveRecord();
    if (event.target.id === "rs-import-file") { previewImport(event.target.files?.[0]); event.target.value = ""; }
  }

  function handleClick(event) {
    const button = event.target.closest("button");
    if (!button || !root.contains(button)) return;
    if (button.dataset.rsTab) { tab = button.dataset.rsTab; selected = null; render(); }
    if (button.dataset.rsSection) { section = button.dataset.rsSection; tab = "entries"; selected = null; query = ""; render(); }
    if (button.dataset.rsEntry) { selected = button.dataset.rsEntry; tab = "entries"; render(); root.querySelector(".rs-reader")?.scrollIntoView({ block: "start" }); }
    if (button.dataset.rsCourse) { courseChapter = Number(button.dataset.rsCourse); tab = "course"; selected = null; render(); }
    switch (button.dataset.rsAction) {
      case "retry": load(); break;
      case "new": openEditor(); break;
      case "edit": openEditor(current().entries.find(item => item.id === selected)); break;
      case "back": selected = null; tab = "entries"; render(); break;
      case "close": root.querySelector("#rs-dialog").close(); break;
      case "backup": options.download(`遥感知识库-${dateKey()}.json`, JSON.stringify({ kind: "zhixing-remote-sensing", schemaVersion: 1, exportedAt: new Date().toISOString(), catalogVersion: catalog.updated, remoteSensing: current() }, null, 2), "application/json;charset=utf-8"); break;
      case "import": root.querySelector("#rs-import-file").click(); break;
      case "markdown": options.download(`遥感物理知识库-${dateKey()}.md`, toMarkdown(allEntries(), current().records, catalog.sources)); break;
      case "csv": options.download(`planck-${temperature}K.csv`, `wavelength_um,radiance_W_m-2_sr-1_um-1,temperature_K\n${Array.from({length:281}, (_,i) => `${(2+i/10).toFixed(1)},${planck(2+i/10,temperature).toPrecision(10)},${temperature}`).join("\n")}\n`, "text/csv;charset=utf-8"); break;
    }
  }

  const dateKey = () => new Date().toISOString().slice(0, 10);

  function openEditor(item) {
    const dialog = root.querySelector("#rs-dialog");
    dialog.innerHTML = `<form class="rs-form" id="rs-editor" data-entry-id="${e(item?.id || "")}"><h2>${item ? "编辑个人条目" : "新建知识条目"}</h2><p class="rs-help">先写清楚物理问题，再逐步补充公式、来源和实验。个人条目默认待核验；同名概念会提醒查重。</p><label>主题名称<input name="title" required maxlength="200" value="${e(item?.title)}"></label><label>所属板块<select name="section">${catalog.sections.map(value => `<option value="${value.id}" ${value.id === (item?.section || (section === "all" ? "01" : section)) ? "selected" : ""}>${e(value.title)}</option>`).join("")}</select></label><label>英文术语与别名<input name="aliases" maxlength="1000" value="${e(item?.aliases)}"></label><label>一句话说明<input name="summary" maxlength="2000" value="${e(item?.summary)}"></label>${FIELDS.map((field,index) => `<label>${e(field)}<textarea name="field-${index}" maxlength="20000">${e(item?.body[field])}</textarea></label>`).join("")}<p class="rs-form-error" id="rs-form-error" role="alert"></p><div class="rs-actions"><button class="primary-button" type="submit">保存条目</button><button class="secondary-button" type="button" data-rs-action="close">取消</button></div></form>`;
    dialog.showModal();
  }

  async function handleSubmit(event) {
    if (event.target.id !== "rs-editor") return;
    event.preventDefault();
    const form = event.target;
    try {
      const data = new FormData(form);
      const id = form.dataset.entryId || `USR-${crypto.randomUUID()}`;
      const title = String(data.get("title")).trim();
      if (allEntries().some(item => item.id !== id && item.title.trim().toLocaleLowerCase() === title.toLocaleLowerCase())) throw new Error("已有同名条目。请返回检索并补充现有条目；不同模型可在标题注明模型名。");
      const previous = current().entries.find(item => item.id === id);
      const entry = validateEntry({ id, title, section: data.get("section"), aliases: data.get("aliases"), summary: data.get("summary"), status: "个人草稿 · 待核验", related: previous?.related || [], sources: previous?.sources || [], body: Object.fromEntries(FIELDS.map((field,index) => [field, data.get(`field-${index}`)])) }, catalog.sections.map(item => item.id));
      const value = current();
      value.entries = [...value.entries.filter(item => item.id !== id), entry];
      options.setState(value);
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      const saved = await persist();
      selected = id;
      tab = "entries";
      render();
      options.toast(saved ? "个人条目已保存" : "条目暂存于当前页面，请导出备份");
    } catch (error) { form.querySelector("#rs-form-error").textContent = error.message; }
  }

  async function previewImport(file) {
    if (!file) return;
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error("请选择 20 MB 以内的备份");
      const payload = JSON.parse(await file.text());
      let incoming;
      if (payload.kind === "zhixing-remote-sensing" && payload.schemaVersion === 1) incoming = payload.remoteSensing;
      else if (!payload.kind && payload.state?.remoteSensing) incoming = payload.state.remoteSensing;
      else throw new Error("请选择遥感知识库备份或包含遥感资料的完整学习备份");
      const checked = validateState(incoming, catalog.sections.map(item => item.id), catalog.entries.map(item => item.id));
      const preview = mergeState(current(), checked);
      const dialog = root.querySelector("#rs-dialog");
      dialog.innerHTML = `<h2>核对导入内容</h2><p>将新增 ${preview.added} 个个人条目、${preview.recordsAdded} 条学习记录。</p><p>遇到 ${preview.conflicts} 项同编号内容，将保留本机版本；原备份文件可继续留存用于人工对比。</p><p class="rs-help">只合并遥感知识库内容。核验标签来自备份，不代表导入时已查证来源。</p><div class="rs-actions"><button class="primary-button" type="button" id="rs-apply-import">合并导入</button><button class="secondary-button" type="button" data-rs-action="close">取消</button></div>`;
      dialog.showModal();
      dialog.querySelector("#rs-apply-import").addEventListener("click", async event => {
        event.target.disabled = true;
        const merged = mergeState(current(), checked);
        options.setState(merged.state);
        const saved = await persist();
        render();
        options.toast(saved ? `已新增 ${merged.added} 个条目、${merged.recordsAdded} 条记录；保留 ${merged.conflicts} 项本机冲突内容` : "已合并到当前页面，请导出备份");
      }, { once: true });
    } catch (error) { options.toast(`导入未执行：${error.message}`); }
  }

  function toMarkdown(entries, records, sources) {
    return `# 遥感物理个人知识库\n\n导出日期：${dateKey()}。学习状态为个人自评；内容核验状态另行标注。\n\n` + entries.map(item => {
      const record = records[item.id] || { level: "未评估", note: "" };
      return `# ${item.title}\n\nID：${item.id}\n\n板块：${item.section}\n\n别名：${item.aliases}\n\n内容状态：${item.status}\n\n学习状态：${record.level}\n\n` + FIELDS.map(field => `## 【${field}】\n\n${item.body[field] || "待补充"}\n`).join("\n") + `\n关联条目：${item.related.join("、") || "待补充"}\n\n来源编号：${item.sources.join("、") || "见资料栏目，待核验"}\n\n## 个人笔记\n\n${record.note || "尚无笔记"}\n\n---\n\n`;
    }).join("") + `# 来源登记\n\n` + sources.map(source => `## ${source.id} · ${source.title}\n\n机构：${source.institution}\n\n来源：${source.url}\n\n定位：${source.location}\n\n核验日期：${source.checked}\n\n${source.scope}\n`).join("\n");
  }

  function resetView() { selected = null; query = ""; section = "all"; tab = "map"; render(); }
  return { init, render, resetView, validateEntry, validateState, mergeState, planck, toMarkdown, FIELDS, LEVELS };
})();
