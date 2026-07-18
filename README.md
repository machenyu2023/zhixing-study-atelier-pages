# 知行 · 个人学习台

[![Deploy GitHub Pages](https://github.com/machenyu2023/zhixing-study-atelier-pages/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/machenyu2023/zhixing-study-atelier-pages/actions/workflows/deploy-pages.yml)

面向个人长期学习的教材阅读、刷题、思辨、写作与复盘网站。目前覆盖雅思、逻辑、写作和数学，内置 1580 道题，并完整收录《系统学习手册》13 章和《每日训练习题册》使用指南及 6 卷正文。其中雅思题共 425 道、逻辑题共 452 道，数学重点为优化、矩阵论、随机过程和高等概率论。

## 核心能力

- 忠实呈现两份用户提供教材的原有标题、段落、表格、提示框、题型分区、参考答案与自评结构，不再使用摘要式知识课。
- 13 章手册和 6 卷习题可分别记录进度；习题册横线可直接填写并自动保存在本机。
- 60 道“习题册衍生”题可独立筛选，包括 30 道精炼填空和 30 道情境开放题；它们用于配套练习，不冒充教材原题。
- 300 道全英文原创 IELTS 风格训练：160 道 Academic Reading、60 道 transcript-based Listening、40 道 Academic Writing、40 道 Academic Language Accuracy。
- 658 道可即时判分的选择题。
- 765 道支持多答案和数值容差的填空题。
- 157 道材料阅读、论证简答和写作开放题。
- 选择题解析、错题自动收集、重做和掌握归档。
- 开放题草稿、建议字数、五维自评和可选 AI 阅卷。
- 统一成绩：每题先归一化为百分制，再计算平均分，避免不同题型权重失真。
- IndexedDB 本地存储，自动迁移旧版 `localStorage` 数据。
- JSON 题库批量导入、学习数据导出、AI 阅卷 Prompt 导出和 GitHub Pages 自动部署。

## 在线部署

在线地址：[https://machenyu2023.github.io/zhixing-study-atelier-pages/](https://machenyu2023.github.io/zhixing-study-atelier-pages/)

项目的源码、题库、文档、AI 阅卷后端和部署配置统一保存在公开仓库 [`zhixing-study-atelier-pages`](https://github.com/machenyu2023/zhixing-study-atelier-pages)。

推送到 `main` 分支后，[Deploy GitHub Pages](.github/workflows/deploy-pages.yml) 会自动校验项目、构建 `dist`，并通过 GitHub Actions 发布到 Pages。仓库不保存 API Key、个人答题记录或其他私密学习数据。

## 本地运行

需要 Node.js 22 或更高版本：

```powershell
npm start
```

访问 `http://127.0.0.1:4173`。

检查与构建：

```powershell
npm test
npm run build
```

重新生成 1225 道参数化扩展题：

```powershell
npm run generate:bank
```

重新生成 300 道原创 IELTS 风格题，并更新 IELTS 官方题型说明页的元数据快照：

```powershell
npm run generate:ielts
npm run sync:ielts:sources
```

同步脚本只保存官方页面 URL、标题、摘要、内容哈希和考试结构事实，不保存或复制官方样题正文。

如需从本机的两份原始 HTML 重新提取教材正文：

```powershell
npm run extract:curriculum -- <学习手册.html> <习题册.html>
```

原始 HTML/PDF 文件本身不进入仓库；生成的 `data/curriculum/curriculum-source.json` 是完整正文快照，会被构建并随 GitHub Pages 分发。公开部署前应确认拥有相应的公开传播授权。

## AI 阅卷

AI 阅卷必须通过服务端转发，不能把 OpenAI API Key 放进 GitHub Pages。复制 `.env.example` 中的变量到本机环境，设置 `OPENAI_API_KEY` 后运行 `npm start`，本地页面即可调用 `/api/grade`。

后端使用 OpenAI Responses API 的 Structured Outputs，默认模型为 `gpt-5.6-luna`，每次按概念清晰、论证结构、证据意识、反方理解、表达质量五个维度各评 0-4 分。详细设计见 [AI_GRADING.md](docs/AI_GRADING.md)。

官方依据：[GPT-5.6 模型选择](https://developers.openai.com/api/docs/guides/latest-model)；[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)。

## 扩充题库

复制 [example-bank.json](data/question-banks/example-bank.json)，按 [QUESTION_BANKS.md](docs/QUESTION_BANKS.md) 填写题目，然后在网站“题库”页面选择“导入题库”。选择题、填空题和开放题可以放在同一个文件中。

内置扩展题库由 [generate-open-bank.mjs](scripts/generate-open-bank.mjs) 和 [generate-ielts-bank.mjs](scripts/generate-ielts-bank.mjs) 确定性生成。IELTS 题目的文章、transcript、题干、选项、答案和解析均为项目原创；官方链接只用于核对题型结构，并不表示官方认可。公开资源接入与抓取边界见 [OPEN_BANK_PIPELINE.md](docs/OPEN_BANK_PIPELINE.md)，版权和来源规则见 [COPYRIGHT.md](docs/COPYRIGHT.md)。

所有学习数据默认只保存在当前浏览器，不会随 GitHub 部署上传。
