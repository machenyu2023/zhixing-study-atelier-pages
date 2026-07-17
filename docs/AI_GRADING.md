# AI 阅卷设计

## 为什么不能直接在 GitHub Pages 调用 OpenAI

GitHub Pages 只托管静态文件。把 `OPENAI_API_KEY` 写进网页、仓库变量或构建产物，会让访问者在浏览器中看到密钥。因此 Pages 版本保留本地五维自评和“复制 AI 批改提示词”，AI 自动阅卷必须经过独立后端。

## 已实现的安全接口

`server.mjs` 提供 `POST /api/grade`，只从服务端环境变量读取 `OPENAI_API_KEY`。请求使用 OpenAI Responses API 和 Structured Outputs，返回固定的五维评分结构：

- 概念清晰
- 论证结构
- 证据意识
- 反方理解
- 表达质量

每个维度 0-4 分，总分 20 分。后端会重新计算总分，避免模型返回的总分与维度之和不一致。

默认模型为 `gpt-5.6-luna`，适合高频阅卷；可通过 `OPENAI_GRADING_MODEL` 更改。API 请求设置 `store: false`。

## 部署选择

要让 GitHub Pages 上的“AI 阅卷”按钮工作，应把 `server.mjs` 的等价接口部署到 Cloudflare Workers、Vercel Functions、Netlify Functions 或自有服务器，再在 `config.js` 中填写完整 HTTPS 地址，并为该后端限制允许的站点来源和请求频率。

不要把 API Key 放入 `config.js`、GitHub Pages Secrets 注入的前端文件或浏览器存储。
