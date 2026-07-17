# 知行 · 个人学习台

[![Deploy GitHub Pages](https://github.com/machenyu2023/zhixing-study-atelier-pages/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/machenyu2023/zhixing-study-atelier-pages/actions/workflows/deploy-pages.yml)

面向个人长期学习的刷题、思辨、写作与复盘网站。目前覆盖雅思、逻辑、写作和数学，内置 55 道题，其中包括一套 14 天逻辑写作训练。

## 核心能力

- 13 道可即时判分的雅思、逻辑与数学选择题。
- 42 道材料阅读、论证简答和微写作开放题。
- 选择题解析、错题自动收集、重做和掌握归档。
- 开放题草稿、建议字数、五维自评和可选 AI 阅卷。
- 统一成绩：每题先归一化为百分制，再计算平均分，避免不同题型权重失真。
- IndexedDB 本地存储，自动迁移旧版 `localStorage` 数据。
- JSON 题库批量导入、学习数据导出和 GitHub Pages 自动部署。

## 在线部署

在线地址：[https://machenyu2023.github.io/zhixing-study-atelier-pages/](https://machenyu2023.github.io/zhixing-study-atelier-pages/)

当前 GitHub 套餐不支持私有仓库直接开启 Pages，因此使用双仓库部署：

- `zhixing-study-atelier`：私有源码仓库。
- `zhixing-study-atelier-pages`：公开部署仓库，只包含 `dist` 构建结果。

推送到私有仓库 `main` 分支后，[Publish Website](.github/workflows/publish-site.yml) 会校验并构建，再通过仅有部署仓库写权限的 Deploy Key 推送构建结果。部署仓库自己的 Action 随后发布 GitHub Pages。

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

## AI 阅卷

AI 阅卷必须通过服务端转发，不能把 OpenAI API Key 放进 GitHub Pages。复制 `.env.example` 中的变量到本机环境，设置 `OPENAI_API_KEY` 后运行 `npm start`，本地页面即可调用 `/api/grade`。

后端使用 OpenAI Responses API 的 Structured Outputs，默认模型为 `gpt-5.6-luna`，每次按概念清晰、论证结构、证据意识、反方理解、表达质量五个维度各评 0-4 分。详细设计见 [AI_GRADING.md](docs/AI_GRADING.md)。

官方依据：[GPT-5.6 模型选择](https://developers.openai.com/api/docs/guides/latest-model)；[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)。

## 扩充题库

复制 [example-bank.json](data/question-banks/example-bank.json)，按 [QUESTION_BANKS.md](docs/QUESTION_BANKS.md) 填写题目，然后在网站“题库”页面选择“导入题库”。选择题和开放题可以放在同一个文件中。

所有学习数据默认只保存在当前浏览器，不会随 GitHub 部署上传。
