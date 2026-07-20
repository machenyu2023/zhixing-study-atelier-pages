# 开放题库扩充管线

## 当前规模

项目包含 55 道基础题、1225 道综合参数化题、300 道原创 IELTS 风格题和 400 道高阶数学标准详解题，共 1980 道：

- 优化 261 道；
- 矩阵论 261 道；
- 随机过程 261 道；
- 高等概率论 261 道；
- 逻辑 420 道，覆盖条件推理、论证结构、Toulmin 模型、五类谬误、因果与统计、概率与不确定性、认知偏误、类比与归纳、定义、价值、修辞、对话和心智模型；其中 60 道习题册衍生题对应六卷训练主题，但属于另外生成的配套练习，不冒充教材原题；
- 雅思 425 道：原有 125 道基础与学术语言题，加上 300 道全英文原创题；新增部分包括 Academic Reading 160 道、transcript-based Listening 60 道、Academic Writing 40 道、Academic Language Accuracy 40 道；
- 数学 1044 道：原有 644 道基础与参数化题，加上 400 道标准详解题；新增部分在优化、矩阵论、随机过程和高等概率论四门中各含 40 道选择、40 道计算填空和 20 道证明推导；
- 写作 45 道。

高级数学不只做基础参数替换，还覆盖 KKT 与 Lagrange 乘子、光滑优化步长、Jordan 标准形、Rayleigh 商、SVD 与谱范数、鞅、平稳 AR(1)、随机变量收敛方式、中心极限定理、特征函数和 Borel-Cantelli 引理。四道旧的初等数学题也已替换为这四门课程的概念题，因此内置数学题全部归入上述方向。

运行 `npm run generate:bank`、`npm run generate:ielts` 和 `npm run generate:math` 可以重新生成完全相同的题库。`npm test` 会检查题量、唯一 ID、答案结构、数值容差、解析和来源字段，并额外检查原创 IELTS 题库不含中文题面、不含重复题干且没有复制官方题面的标记，以及详解数学题是否具有唯一题干、标准答案和至少两步推导。

## IELTS 官方格式参考

运行 `npm run sync:ielts:sources` 会读取 IELTS 官方的 Academic 总览、Reading、Listening、Writing 和 sample questions 索引页，并更新 `data/sources/ielts-official-spec.json`。快照只保留结构事实和页面哈希，不保留官方样题正文。

原创题库将 Reading、Listening 和 Writing 题分别链接到对应的官方题型说明页。`sourceUrl` 只证明格式参考依据，题目的文字内容及答案均来自本项目。不得将同步脚本改造成试卷下载器，也不得把第三方“回忆题”“真题整理”或培训机构模拟卷混入原创题库。

## 接入公开资源

公开资源优先使用结构化 JSON，而不是抓取网页排版。运行：

```powershell
node scripts/import-open-json-bank.mjs <https-url> <output-name>
```

远端题库必须符合 schemaVersion 1，并在 `bank` 中声明 `source`、`sourceUrl` 和 `license`；每道题也必须具有来源与许可。导入脚本只接受 HTTPS，不解析 HTML，不执行远端代码。

导入后先用网站的“导入题库”进行个人试做。确认质量和许可后，才将文件加入 `BUNDLED_BANK_URLS` 作为内置题库。

## 网页抓取边界

若未来为某个公开站点编写专用适配器，需要同时满足：

1. robots.txt 和站点条款允许自动访问；
2. 内容许可允许复制和再分发；
3. 使用固定速率、缓存和可恢复断点，避免给来源站点造成负担；
4. 保存原始来源、许可、抓取日期和转换日志；
5. 对答案、重复率、公式和字符编码做自动校验与人工抽查。

许可不明时只保存链接和元数据，不复制题干。雅思等商业考试真题默认视为不可抓取内容。
