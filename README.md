# 知行 · 个人学习台

[![Deploy GitHub Pages](https://github.com/machenyu2023/zhixing-study-atelier-pages/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/machenyu2023/zhixing-study-atelier-pages/actions/workflows/deploy-pages.yml)

面向个人长期学习的知识学习、刷题、思辨、写作与复盘网站。目前覆盖雅思、逻辑、写作和数学，内置 1280 道题和 14 节逻辑思维知识课。其中逻辑题共 452 道，数学重点为优化、矩阵论、随机过程和高等概率论。

## 核心能力

- 14 节知识课，覆盖定义、论证、谬误、因果、概率、偏误、写作、心智模型与对话，并支持课程进度和配套练习。
- 488 道可即时判分的雅思、逻辑与数学选择题。
- 705 道支持多答案和数值容差的填空题。
- 87 道材料阅读、论证简答和写作开放题。
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

## AI 阅卷

AI 阅卷必须通过服务端转发，不能把 OpenAI API Key 放进 GitHub Pages。复制 `.env.example` 中的变量到本机环境，设置 `OPENAI_API_KEY` 后运行 `npm start`，本地页面即可调用 `/api/grade`。

后端使用 OpenAI Responses API 的 Structured Outputs，默认模型为 `gpt-5.6-luna`，每次按概念清晰、论证结构、证据意识、反方理解、表达质量五个维度各评 0-4 分。详细设计见 [AI_GRADING.md](docs/AI_GRADING.md)。

官方依据：[GPT-5.6 模型选择](https://developers.openai.com/api/docs/guides/latest-model)；[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)。

## 扩充题库

复制 [example-bank.json](data/question-banks/example-bank.json)，按 [QUESTION_BANKS.md](docs/QUESTION_BANKS.md) 填写题目，然后在网站“题库”页面选择“导入题库”。选择题、填空题和开放题可以放在同一个文件中。

内置扩展题库由 [generate-open-bank.mjs](scripts/generate-open-bank.mjs) 确定性生成。公开资源接入与抓取边界见 [OPEN_BANK_PIPELINE.md](docs/OPEN_BANK_PIPELINE.md)，版权和来源规则见 [COPYRIGHT.md](docs/COPYRIGHT.md)。

所有学习数据默认只保存在当前浏览器，不会随 GitHub 部署上传。
