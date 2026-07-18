# 版权与题目来源

## 项目原创内容

除另有标注外，界面文案、14 天逻辑写作训练、写作题和参数化生成题为本项目原创，仅供个人学习使用。公开仓库并不自动意味着放弃版权或允许任意再分发。

`data/question-banks/open-practice-bank.json` 由 `scripts/generate-open-bank.mjs` 确定性生成。题目带有稳定 ID、`source` 和 `license` 字段，便于审计、修订和重新生成。

`data/question-banks/ielts-original-bank.json` 由 `scripts/generate-ielts-bank.mjs` 确定性生成。其中的阅读文章、听力 transcript、写作任务、语言题、题干、选项、答案和解析均为项目原创，仅借鉴 IELTS 官方公开说明中的考试结构、题型名称、时间和字数要求。每道题均设置 `referenceOnly: true` 和 `officialQuestionTextCopied: false`，官方链接不是题目正文的来源，也不表示 IELTS 官方认可本项目。

`data/sources/ielts-official-spec.json` 只保存官方说明页的 URL、标题、摘要、内容哈希和结构化考试事实。它不保存官方样题正文。运行 `scripts/sync-ielts-official-sources.mjs` 时不得扩展为下载、复制或重新分发官方试卷。

## 用户提供的学习材料

“教材”页面使用 `data/curriculum/curriculum-source.json`，忠实保存用户提供的《逻辑 · 论证 · 思考 — 系统学习手册》13 章正文，以及《逻辑 · 写作 · 思考 — 每日训练习题册》的使用指南和六卷正文。网站只增加目录导航、进度记录、作答输入框和折叠答案等交互，不以摘要或改写文本替代教材正文。

两份原始 HTML 及对应 PDF 文件本身不纳入本仓库，但提取出的完整教材正文快照会纳入仓库并随 GitHub Pages 分发。其著作权及相关权利归原权利人所有；本项目中的来源说明不构成再分发授权。仓库公开部署者有责任确认自己拥有保存和公开传播这些正文的权限；如无法确认，应将仓库与 Pages 设为仅限本人可访问，或移除 `data/curriculum/curriculum-source.json`。

## 第三方内容

第三方题目只有在许可明确允许复制、修改与再分发时才能进入内置题库，并必须保留：

- 作者或机构名称；
- 原始来源 URL；
- 许可名称与许可 URL；
- 是否修改以及修改内容；
- 抓取或同步日期。

不得绕过登录、访问控制、付费墙、验证码或网站技术限制。不得将商业题库、培训机构材料、未公开授权的考试回忆题或受版权保护的真题提交到公开仓库。

## 用户内容与学习数据

用户录入或导入的题目、作答、草稿和评分默认只保存在当前浏览器 IndexedDB，不会随 GitHub Pages 上传。内容权利仍归原权利人所有，用户应自行确认导入权限。

## 商标

IELTS 是其权利人的注册商标。本项目为非官方个人学习工具，与 IELTS 官方机构不存在隶属、合作或认可关系。
